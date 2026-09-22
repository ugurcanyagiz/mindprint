import { describe, expect, it } from "vitest";

import {
  buildCognitiveProfile,
  calculateProfileMetrics,
  createProfileSummary,
} from "./profile";
import type { AssessmentResponse } from "./types";

function response(
  taskId: string,
  answer: unknown,
  confidence?: number,
): AssessmentResponse {
  return {
    taskId,
    answer,
    confidence,
    startedAt: "2026-09-22T00:00:00.000Z",
    completedAt: "2026-09-22T00:01:00.000Z",
  };
}

const perfectResponses: AssessmentResponse[] = [
  response(
    "task-01-information-filtering",
    ["operating-margin", "churn"],
    100,
  ),
  response("task-02-reasoning", "insufficient", 100),
  response(
    "task-03-evidence-evaluation",
    [
      "rct",
      "observational-study",
      "manufacturer-study",
      "viral-video",
    ],
    100,
  ),
  response("task-04-adaptive-rule", { phaseA: "14", phaseB: "15" }),
  response("task-05-missing-information", "insufficient", 100),
  response("task-06-knowledge-transfer", "shift-load"),
];

describe("cognitive profile metrics", () => {
  it("reports perfect objective accuracy and zero calibration gap for perfect calibrated responses", () => {
    expect(calculateProfileMetrics(perfectResponses)).toEqual({
      averageConfidence: 100,
      responseAccuracy: 100,
      calibrationGap: 0,
    });
  });

  it("calculates calibration gap from confidence-bearing tasks only", () => {
    const responses = perfectResponses.map((item) =>
      item.taskId === "task-02-reasoning"
        ? response(item.taskId, "supported", 90)
        : item,
    );

    const metrics = calculateProfileMetrics(responses);

    expect(metrics.averageConfidence).toBe(98);
    expect(metrics.responseAccuracy).toBe(83);
    expect(metrics.calibrationGap).toBe(23);
  });
});

describe("cognitive profile copy", () => {
  it("avoids percentile or IQ-equivalent claims in interpretation copy", () => {
    const profile = buildCognitiveProfile(perfectResponses);
    const combined = [
      profile.strengthsText,
      profile.calibrationText,
      profile.assessmentNote,
    ].join(" ");

    expect(combined.toLowerCase()).not.toContain("percentile");
    expect(combined.toLowerCase()).not.toContain("iq");
    expect(combined.toLowerCase()).not.toContain("you are a");
  });

  it("creates a complete copyable summary", () => {
    const summary = createProfileSummary(buildCognitiveProfile(perfectResponses));

    expect(summary).toContain("Cognitive Profile");
    expect(summary).toContain("Reasoning: 100/100");
    expect(summary).toContain("not standardized IQ scores");
  });
});

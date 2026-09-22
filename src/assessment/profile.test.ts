import { describe, expect, it } from "vitest";

import {
  buildCognitiveProfile,
  calculateProfileMetrics,
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

export const perfectResponses: AssessmentResponse[] = [
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

  it("keeps the profile domain language-neutral", () => {
    expect(buildCognitiveProfile(perfectResponses)).toEqual({
      scores: {
        reasoning: 100,
        adaptiveLearning: 100,
        evidenceEvaluation: 100,
        informationFiltering: 100,
        metacognitiveCalibration: 100,
        knowledgeTransfer: 100,
      },
      averageConfidence: 100,
      responseAccuracy: 100,
      calibrationGap: 0,
    });
  });
});

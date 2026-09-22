import { describe, expect, it } from "vitest";

import { assessmentTasks } from "./tasks";
import {
  calculateAssessmentScore,
  combineObjectiveAndCalibration,
  rankDistanceQuality,
  scoreAdaptiveObjective,
} from "./scoring";
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

describe("confidence calibration", () => {
  it("rewards correct calibrated confidence", () => {
    expect(combineObjectiveAndCalibration(1, 100)).toBe(100);
  });

  it("penalizes high confidence more than low confidence when wrong", () => {
    expect(combineObjectiveAndCalibration(0, 100)).toBeLessThan(
      combineObjectiveAndCalibration(0, 10),
    );
  });

  it("does not make low confidence automatically bad", () => {
    expect(combineObjectiveAndCalibration(1, 20)).toBeGreaterThanOrEqual(85);
    expect(combineObjectiveAndCalibration(0, 10)).toBeGreaterThan(0);
  });
});

describe("evidence ranking", () => {
  const ideal = [
    "rct",
    "observational-study",
    "manufacturer-study",
    "viral-video",
  ];

  it("gives full quality to the optimal order", () => {
    expect(rankDistanceQuality(ideal, ideal)).toBe(1);
  });

  it("scores a reversed order lower than a near miss", () => {
    const reverse = [...ideal].reverse();
    const nearMiss = [
      "rct",
      "manufacturer-study",
      "observational-study",
      "viral-video",
    ];

    expect(rankDistanceQuality(reverse, ideal)).toBeLessThan(
      rankDistanceQuality(nearMiss, ideal),
    );
  });
});

describe("adaptive learning", () => {
  const task = assessmentTasks.find(
    (candidate) => candidate.kind === "adaptive-rule",
  );

  if (!task || task.kind !== "adaptive-rule") {
    throw new Error("Adaptive task fixture missing");
  }

  it("weights successful adaptation more heavily than initial rule learning", () => {
    const onlyPhaseA = scoreAdaptiveObjective(task, {
      phaseA: task.phaseA.answerKey,
      phaseB: "wrong",
    });
    const onlyPhaseB = scoreAdaptiveObjective(task, {
      phaseA: "wrong",
      phaseB: task.phaseB.answerKey,
    });

    expect(onlyPhaseA).toBeCloseTo(0.35);
    expect(onlyPhaseB).toBeCloseTo(0.65);
    expect(onlyPhaseB).toBeGreaterThan(onlyPhaseA);
  });
});

describe("full assessment scoring", () => {
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

  it("returns bounded 0-100 scores for every dimension", () => {
    const { scores } = calculateAssessmentScore(perfectResponses);

    for (const score of Object.values(scores)) {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it("gives a perfect profile for perfect, well-calibrated responses", () => {
    expect(calculateAssessmentScore(perfectResponses).scores).toEqual({
      reasoning: 100,
      adaptiveLearning: 100,
      evidenceEvaluation: 100,
      informationFiltering: 100,
      metacognitiveCalibration: 100,
      knowledgeTransfer: 100,
    });
  });

  it("makes recognizing missing information materially important", () => {
    const correct = calculateAssessmentScore(perfectResponses).scores
      .metacognitiveCalibration;

    const incorrectResponses = perfectResponses.map((item) =>
      item.taskId === "task-05-missing-information"
        ? response(item.taskId, "sam", 100)
        : item,
    );

    const incorrect = calculateAssessmentScore(incorrectResponses).scores
      .metacognitiveCalibration;

    expect(correct - incorrect).toBeGreaterThanOrEqual(60);
  });
});

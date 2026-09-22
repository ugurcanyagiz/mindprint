import { describe, expect, it } from "vitest";

import { experimentalTasks } from "../experimental/tasks";
import { assessmentTasks } from "../tasks";
import { calculateAssessmentScore } from "../scoring";
import type { AssessmentResponse } from "../types";
import { detectResearchDataIssues, applyExplicitExclusionRules } from "./data-quality";
import { summarizeFairnessGroups } from "./fairness";
import { syntheticResearchDataset } from "./fixtures/synthetic";
import { analyzeResearchItem } from "./item-analysis";
import { mean, pearsonCorrelation } from "./metrics";
import { toResearchTaskRecord } from "./records";
import {
  createItemReview,
  hasAutomaticFinalDecision,
  initialDispositionForTask,
} from "./selection";
import { validateResearchTaskRecord } from "./validation";
import { assessIrtReadiness } from "./validity";
import type { ResearchTaskRecord } from "./types";

function productionResponse(
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

const perfectProductionResponses: AssessmentResponse[] = [
  productionResponse(
    "task-01-information-filtering",
    ["operating-margin", "churn"],
    100,
  ),
  productionResponse("task-02-reasoning", "insufficient", 100),
  productionResponse(
    "task-03-evidence-evaluation",
    ["rct", "observational-study", "manufacturer-study", "viral-video"],
    100,
  ),
  productionResponse(
    "task-04-adaptive-rule",
    { phaseA: "14", phaseB: "15" },
  ),
  productionResponse("task-05-missing-information", "insufficient", 100),
  productionResponse("task-06-knowledge-transfer", "shift-load"),
];

describe("research schema and mapping", () => {
  it("maps all 12 experimental tasks into canonical research records", () => {
    expect(
      new Set(syntheticResearchDataset.records.map((record) => record.taskId))
        .size,
    ).toBe(12);
    expect(experimentalTasks).toHaveLength(12);

    for (const record of syntheticResearchDataset.records) {
      expect(validateResearchTaskRecord(record).valid).toBe(true);
      expect(record.source).toBe("synthetic");
      expect(record.taskVersion).toBeGreaterThan(0);
      expect(record.dimension).toBeTruthy();
      expect(record.subfacet).toBeTruthy();
    }
  });

  it("keeps production at six tasks and preserves known perfect scoring", () => {
    expect(assessmentTasks).toHaveLength(6);
    expect(calculateAssessmentScore(perfectProductionResponses).scores).toEqual({
      reasoning: 100,
      adaptiveLearning: 100,
      evidenceEvaluation: 100,
      informationFiltering: 100,
      metacognitiveCalibration: 100,
      knowledgeTransfer: 100,
    });
  });

  it("marks out-of-bounds confidence as invalid rather than silently normalizing research data", () => {
    const record = structuredClone(syntheticResearchDataset.records[0]);
    record.phaseResponses[0].confidence = 140;

    const validation = validateResearchTaskRecord(record);
    expect(validation.valid).toBe(false);
    expect(validation.errors.join(" ")).toContain("confidence");
  });
});

describe("descriptive item analysis", () => {
  const taskId = "reasoning-causal-01";

  it("calculates completion, missingness, objective, confidence, calibration, and revision metrics", () => {
    const metrics = analyzeResearchItem(
      syntheticResearchDataset.records,
      taskId,
    );

    expect(metrics.nAttempted).toBe(3);
    expect(metrics.nCompleted).toBe(3);
    expect(metrics.completionRate).toBe(1);
    expect(metrics.missingRate).toBe(0);
    expect(metrics.objectiveMean).toBeCloseTo(2 / 3);
    expect(metrics.confidenceMean).toBeCloseTo(85);
    expect(metrics.calibrationGap).not.toBeNull();
    expect(metrics.medianResponseDurationMs).toBeGreaterThan(0);
    expect(metrics.revisionRate).toBeCloseTo(1 / 3);
  });

  it("treats incomplete records as missing rather than automatically wrong", () => {
    const records = syntheticResearchDataset.records
      .filter((record) => record.taskId === taskId)
      .map((record) => structuredClone(record));

    records[0].completionStatus = "interrupted";
    const metrics = analyzeResearchItem(records, taskId);

    expect(metrics.nAttempted).toBe(3);
    expect(metrics.nCompleted).toBe(2);
    expect(metrics.missingRate).toBeCloseTo(1 / 3);
  });

  it("provides multi-phase accuracy for phased tasks", () => {
    const metrics = analyzeResearchItem(
      syntheticResearchDataset.records,
      "adaptive-interference-01",
    );

    expect(metrics.phaseAccuracy.map((phase) => phase.phaseId)).toEqual([
      "rule-a",
      "rule-b",
      "interference",
    ]);
    expect(metrics.appropriateRevisionRate).not.toBeNull();
  });
});

describe("data quality and exclusions", () => {
  it("flags invalid durations and duplicate task records", () => {
    const original = structuredClone(syntheticResearchDataset.records[0]);
    const invalid = structuredClone(original);
    invalid.durationMs = -1;

    const issues = detectResearchDataIssues([original, invalid]);
    expect(issues.some((issue) => issue.type === "duplicate-record")).toBe(true);
    expect(issues.some((issue) => issue.type === "invalid-duration")).toBe(true);
  });

  it("does not exclude a participant solely for timing or duplicate flags", () => {
    const record = structuredClone(syntheticResearchDataset.records[0]);
    record.durationMs = -1;
    const issues = detectResearchDataIssues([record]);

    const [decision] = applyExplicitExclusionRules(
      [record.participantId],
      issues,
    );

    expect(decision.excluded).toBe(false);
    expect(decision.ruleIds).toEqual([]);
  });
});

describe("fairness and selection guardrails", () => {
  it("handles missing fairness group metadata without crashing", () => {
    const participants = syntheticResearchDataset.participants.map(
      (participant) => ({ ...participant, educationBand: undefined }),
    );

    expect(
      summarizeFairnessGroups(
        syntheticResearchDataset.records,
        participants,
        "educationBand",
      ),
    ).toEqual([]);
  });

  it("creates pilot reviews without an automatic retain/retire decision", () => {
    const review = createItemReview("reasoning-causal-01");

    expect(review.disposition).toBe("pilot");
    expect(review.manualReviewRequired).toBe(true);
    expect(hasAutomaticFinalDecision(review)).toBe(false);
    expect(initialDispositionForTask(true)).toBe("pilot");
    expect(initialDispositionForTask(false)).toBe("draft");
    expect(() =>
      createItemReview("reasoning-causal-01", "retain"),
    ).toThrow();
  });
});

describe("research-only statistical helpers", () => {
  it("returns stable descriptive values for small fixtures", () => {
    expect(mean([0, 1, 1])).toBeCloseTo(2 / 3);
    expect(pearsonCorrelation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
  });

  it("does not claim IRT readiness from synthetic fixture data", () => {
    const readiness = assessIrtReadiness(syntheticResearchDataset.records);
    expect(readiness.readyForModelSelection).toBe(false);
    expect(readiness.reasons.length).toBeGreaterThan(0);
  });
});

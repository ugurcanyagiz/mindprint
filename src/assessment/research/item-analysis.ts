import type {
  ItemAnalysisThresholds,
  ResearchItemMetrics,
  ResearchTaskRecord,
} from "./types";
import { mean, median, proportion, variance } from "./metrics";

export const defaultItemAnalysisThresholds: ItemAnalysisThresholds = {
  floorObjectiveMean: 0.15,
  ceilingObjectiveMean: 0.9,
  highMissingRate: 0.15,
};

function completed(records: ResearchTaskRecord[]) {
  return records.filter((record) => record.completionStatus === "completed");
}

function phaseObjectiveValues(
  records: ResearchTaskRecord[],
  phaseId: string,
): number[] {
  return records.flatMap((record) => {
    const value = record.phaseResponses.find(
      (phase) => phase.phaseId === phaseId,
    )?.objectiveQuality;
    return value === null || value === undefined ? [] : [value];
  });
}

function optionDistribution(records: ResearchTaskRecord[]) {
  const result: Record<string, number> = {};

  for (const record of records) {
    for (const phase of record.phaseResponses) {
      if (typeof phase.answer === "string") {
        result[phase.answer] = (result[phase.answer] ?? 0) + 1;
      } else if (Array.isArray(phase.answer)) {
        for (const answer of phase.answer) {
          result[answer] = (result[answer] ?? 0) + 1;
        }
      }
    }
  }

  return result;
}

export function analyzeResearchItem(
  allRecords: ResearchTaskRecord[],
  taskId: string,
  thresholds: ItemAnalysisThresholds = defaultItemAnalysisThresholds,
): ResearchItemMetrics {
  const records = allRecords.filter((record) => record.taskId === taskId);
  const completedRecords = completed(records);
  const attempted = records.length;
  const completedCount = completedRecords.length;

  const objectiveValues = completedRecords.flatMap((record) =>
    record.phaseResponses.flatMap((phase) =>
      phase.objectiveQuality === null ? [] : [phase.objectiveQuality],
    ),
  );
  const confidenceValues = completedRecords.flatMap((record) =>
    record.phaseResponses.flatMap((phase) =>
      phase.confidence === null ? [] : [phase.confidence],
    ),
  );
  const calibrationGaps = completedRecords.flatMap((record) =>
    record.phaseResponses.flatMap((phase) =>
      phase.confidence === null || phase.objectiveQuality === null
        ? []
        : [Math.abs(phase.confidence / 100 - phase.objectiveQuality)],
    ),
  );
  const durationValues = completedRecords.flatMap((record) =>
    record.durationMs === null || record.durationMs < 0
      ? []
      : [record.durationMs],
  );
  const revisions = completedRecords.map((record) =>
    record.revisions > 0 ? 1 : 0,
  );

  const phaseIds = Array.from(
    new Set(records.flatMap((record) => record.phaseResponses.map((p) => p.phaseId))),
  );

  const objectiveMean = mean(objectiveValues);
  const missingRate = proportion(attempted - completedCount, attempted);
  const flags: ResearchItemMetrics["flags"] = [];

  if (objectiveMean !== null && objectiveMean <= thresholds.floorObjectiveMean) {
    flags.push("possible-floor");
  }
  if (
    objectiveMean !== null &&
    objectiveMean >= thresholds.ceilingObjectiveMean
  ) {
    flags.push("possible-ceiling");
  }
  if (missingRate !== null && missingRate >= thresholds.highMissingRate) {
    flags.push("high-missingness");
  }
  if (records.some((record) => record.durationMs !== null && record.durationMs < 0)) {
    flags.push("invalid-duration");
  }

  const beliefRecords = completedRecords.filter(
    (record) => record.beliefChanged !== null,
  );
  const revisionRecords = completedRecords.filter(
    (record) => record.phaseResponses.length > 1,
  );
  const appropriateRevisions = revisionRecords.filter((record) => {
    const last = record.phaseResponses.at(-1);
    return last?.objectiveQuality === 1;
  });

  const confidenceChanges = completedRecords.flatMap((record) =>
    record.confidenceDelta === null ? [] : [record.confidenceDelta],
  );

  return {
    taskId,
    nAttempted: attempted,
    nCompleted: completedCount,
    completionRate: proportion(completedCount, attempted),
    missingRate,
    objectiveMean,
    objectiveVariance: variance(objectiveValues),
    optionDistribution: optionDistribution(completedRecords),
    confidenceMean: mean(confidenceValues),
    confidenceVariance: variance(confidenceValues),
    calibrationGap: mean(calibrationGaps),
    medianResponseDurationMs: median(durationValues),
    revisionRate: mean(revisions),
    phaseAccuracy: phaseIds.map((phaseId) => ({
      phaseId,
      meanObjectiveQuality: mean(
        phaseObjectiveValues(completedRecords, phaseId),
      ),
    })),
    beliefChangeRate: proportion(
      beliefRecords.filter((record) => record.beliefChanged).length,
      beliefRecords.length,
    ),
    appropriateRevisionRate: proportion(
      appropriateRevisions.length,
      revisionRecords.length,
    ),
    confidenceChangeMean: mean(confidenceChanges),
    flags: Array.from(new Set(flags)),
  };
}

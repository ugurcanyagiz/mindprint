import { pearsonCorrelation } from "./metrics";

export type ReliabilityFramework = {
  descriptiveAvailableHere: string[];
  advancedExternalPipeline: string[];
};

export const reliabilityFramework: ReliabilityFramework = {
  descriptiveAvailableHere: [
    "test-retest correlation when matched observations are supplied",
    "corrected item-total correlation when item and remainder scores are supplied",
  ],
  advancedExternalPipeline: [
    "McDonald's omega",
    "factor-based reliability",
    "dimension-level internal consistency with model diagnostics",
    "task-family consistency",
  ],
};

export function correctedItemTotalCorrelation(
  itemScores: number[],
  remainderScores: number[],
): number | null {
  return pearsonCorrelation(itemScores, remainderScores);
}

export function testRetestCorrelation(
  firstScores: number[],
  secondScores: number[],
): number | null {
  return pearsonCorrelation(firstScores, secondScores);
}

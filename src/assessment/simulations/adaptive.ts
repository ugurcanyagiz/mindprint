import type {
  AdaptationRule,
  DifficultyAdjustment,
  EnvironmentDifficulty,
  TraceSummary,
} from "./types";

export const defaultEnvironmentDifficulty: EnvironmentDifficulty = {
  informationDensity: 0.5,
  distractorSimilarity: 0.5,
  volatility: 0.5,
  uncertainty: 0.5,
  transferDistance: 0.5,
  interruptionLoad: 0.5,
  ruleComplexity: 0.5,
};

export function clampDifficulty(value: number) {
  return Math.min(1, Math.max(0, Number(value.toFixed(3))));
}

export const adaptationRules: AdaptationRule[] = [
  {
    id: "filtering-pressure",
    researchRationale:
      "Good outcomes with weak selection quality can be probed by increasing distractor competition rather than simply increasing speed.",
    evaluate: (summary) =>
      summary.correctOutcomeRate !== null &&
      summary.correctOutcomeRate >= 0.75 &&
      summary.selectionQuality !== null &&
      summary.selectionQuality < 0.6
        ? [
            {
              parameter: "informationDensity",
              delta: 0.1,
              rationale: "Increase irrelevant information density.",
              ruleId: "filtering-pressure",
            },
            {
              parameter: "distractorSimilarity",
              delta: 0.1,
              rationale: "Make distractors more similar to diagnostic signals.",
              ruleId: "filtering-pressure",
            },
          ]
        : [],
  },
  {
    id: "calibration-probe",
    researchRationale:
      "High-confidence errors motivate an uncertainty/calibration probe without treating confidence itself as intelligence.",
    evaluate: (summary) =>
      summary.highConfidenceErrorRate !== null &&
      summary.highConfidenceErrorRate >= 0.4
        ? [
            {
              parameter: "uncertainty",
              delta: 0.1,
              rationale: "Increase ambiguity for a calibration probe.",
              ruleId: "calibration-probe",
            },
          ]
        : [],
  },
  {
    id: "interference-probe",
    researchRationale:
      "Rule-update errors motivate a stronger interference condition.",
    evaluate: (summary) =>
      summary.ruleUpdateErrorRate !== null &&
      summary.ruleUpdateErrorRate >= 0.4
        ? [
            {
              parameter: "volatility",
              delta: 0.1,
              rationale: "Increase change pressure for an update probe.",
              ruleId: "interference-probe",
            },
            {
              parameter: "ruleComplexity",
              delta: 0.05,
              rationale: "Increase competing-rule similarity slightly.",
              ruleId: "interference-probe",
            },
          ]
        : [],
  },
];

export function chooseDifficultyAdjustments(
  summary: TraceSummary,
): DifficultyAdjustment[] {
  return adaptationRules.flatMap((rule) => rule.evaluate(summary));
}

export function applyDifficultyAdjustments(
  current: EnvironmentDifficulty,
  adjustments: DifficultyAdjustment[],
): EnvironmentDifficulty {
  const next = { ...current };

  for (const adjustment of adjustments) {
    next[adjustment.parameter] = clampDifficulty(
      next[adjustment.parameter] + adjustment.delta,
    );
  }

  return next;
}

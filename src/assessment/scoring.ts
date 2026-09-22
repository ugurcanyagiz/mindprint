import {
  cognitiveDimensions,
  type AssessmentResponse,
  type DimensionScores,
} from "./types";

const clampScore = (value: number) => Math.min(100, Math.max(0, value));

export function createEmptyScores(): DimensionScores {
  return Object.fromEntries(
    cognitiveDimensions.map((dimension) => [dimension, 0]),
  ) as DimensionScores;
}

/**
 * Placeholder scoring boundary. Keep scoring deterministic and isolated from
 * React. Later milestones should replace this with tested task-specific logic.
 */
export function calculateScores(
  _responses: AssessmentResponse[],
): DimensionScores {
  const scores = createEmptyScores();

  return Object.fromEntries(
    Object.entries(scores).map(([dimension, score]) => [
      dimension,
      clampScore(score),
    ]),
  ) as DimensionScores;
}

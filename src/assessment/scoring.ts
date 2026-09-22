import { assessmentTasks } from "./tasks";
import {
  cognitiveDimensions,
  type AdaptiveRuleTask,
  type AssessmentResponse,
  type AssessmentTask,
  type DimensionScores,
  type MultiSelectTask,
  type RankingTask,
  type SingleChoiceTask,
} from "./types";

export type TaskScore = {
  taskId: string;
  dimension: AssessmentTask["dimension"];
  objectiveQuality: number;
  calibration: number | null;
  score: number;
};

export type AssessmentScoreResult = {
  scores: DimensionScores;
  taskScores: TaskScore[];
};

const METACOGNITIVE_AWARENESS_WEIGHT = 0.65;
const GLOBAL_CALIBRATION_WEIGHT = 0.35;
const OBJECTIVE_WEIGHT = 0.85;
const CALIBRATION_WEIGHT = 0.15;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function clampScore(value: number) {
  return Math.min(100, Math.max(0, value));
}

function roundScore(value: number) {
  return Math.round(clampScore(value));
}

function toConfidenceUnit(confidence: number | undefined) {
  if (confidence === undefined || !Number.isFinite(confidence)) {
    return null;
  }

  return clamp01(confidence / 100);
}

export function createEmptyScores(): DimensionScores {
  return Object.fromEntries(
    cognitiveDimensions.map((dimension) => [dimension, 0]),
  ) as DimensionScores;
}

/**
 * Calibration compares stated confidence with observed item quality.
 *
 * Low confidence is not intrinsically penalized. It is well calibrated when
 * performance is weak and poorly calibrated when performance is strong.
 */
export function calculateCalibration(
  objectiveQuality: number,
  confidence: number | undefined,
): number | null {
  const normalizedConfidence = toConfidenceUnit(confidence);

  if (normalizedConfidence === null) {
    return null;
  }

  return clamp01(
    1 - Math.abs(normalizedConfidence - clamp01(objectiveQuality)),
  );
}

export function combineObjectiveAndCalibration(
  objectiveQuality: number,
  confidence: number | undefined,
): number {
  const objective = clamp01(objectiveQuality);
  const calibration = calculateCalibration(objective, confidence);

  if (calibration === null) {
    return roundScore(objective * 100);
  }

  return roundScore(
    (objective * OBJECTIVE_WEIGHT + calibration * CALIBRATION_WEIGHT) * 100,
  );
}

function arraysContainSameUniqueItems(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  const leftSet = new Set(left);
  const rightSet = new Set(right);

  if (leftSet.size !== left.length || rightSet.size !== right.length) {
    return false;
  }

  return left.every((item) => rightSet.has(item));
}

export function scoreMultiSelectObjective(
  task: MultiSelectTask,
  answer: unknown,
): number {
  if (!Array.isArray(answer) || !answer.every((item) => typeof item === "string")) {
    return 0;
  }

  const uniqueAnswers = new Set(answer);
  const correctSelections = task.answerKey.filter((item) =>
    uniqueAnswers.has(item),
  ).length;

  return clamp01(correctSelections / task.answerKey.length);
}

export function scoreSingleChoiceObjective(
  task: SingleChoiceTask,
  answer: unknown,
): number {
  return typeof answer === "string" && answer === task.answerKey ? 1 : 0;
}

export function rankDistanceQuality(
  submittedOrder: string[],
  idealOrder: string[],
): number {
  if (!arraysContainSameUniqueItems(submittedOrder, idealOrder)) {
    return 0;
  }

  const submittedPosition = new Map(
    submittedOrder.map((item, index) => [item, index]),
  );

  const distance = idealOrder.reduce((sum, item, idealIndex) => {
    const submittedIndex = submittedPosition.get(item);

    return (
      sum +
      Math.abs((submittedIndex ?? submittedOrder.length) - idealIndex)
    );
  }, 0);

  const maximumDistance = Math.floor((idealOrder.length ** 2) / 2);

  if (maximumDistance === 0) {
    return 1;
  }

  return clamp01(1 - distance / maximumDistance);
}

export function scoreRankingObjective(
  task: RankingTask,
  answer: unknown,
): number {
  if (!Array.isArray(answer) || !answer.every((item) => typeof item === "string")) {
    return 0;
  }

  return rankDistanceQuality(answer, task.answerKey);
}

export function scoreAdaptiveObjective(
  task: AdaptiveRuleTask,
  answer: unknown,
): number {
  if (
    typeof answer !== "object" ||
    answer === null ||
    !("phaseA" in answer) ||
    !("phaseB" in answer)
  ) {
    return 0;
  }

  const phaseA = String(answer.phaseA ?? "");
  const phaseB = String(answer.phaseB ?? "");

  const phaseAQuality = phaseA === task.phaseA.answerKey ? 1 : 0;
  const phaseBQuality = phaseB === task.phaseB.answerKey ? 1 : 0;

  return clamp01(
    phaseAQuality * task.scoringMeta.phaseAWeight +
      phaseBQuality * task.scoringMeta.phaseBWeight,
  );
}

export function scoreTaskObjective(
  task: AssessmentTask,
  response: AssessmentResponse | undefined,
): number {
  if (!response) {
    return 0;
  }

  switch (task.kind) {
    case "multi-select":
      return scoreMultiSelectObjective(task, response.answer);
    case "ranking":
      return scoreRankingObjective(task, response.answer);
    case "adaptive-rule":
      return scoreAdaptiveObjective(task, response.answer);
    case "single-choice":
      return scoreSingleChoiceObjective(task, response.answer);
  }
}

export function scoreTask(
  task: AssessmentTask,
  response: AssessmentResponse | undefined,
): TaskScore {
  const objectiveQuality = scoreTaskObjective(task, response);
  const confidence = response?.confidence;
  const calibration =
    "confidenceRequired" in task && task.confidenceRequired
      ? calculateCalibration(objectiveQuality, confidence)
      : null;

  const score =
    "confidenceRequired" in task && task.confidenceRequired
      ? combineObjectiveAndCalibration(objectiveQuality, confidence)
      : roundScore(objectiveQuality * 100);

  return {
    taskId: task.id,
    dimension: task.dimension,
    objectiveQuality,
    calibration,
    score,
  };
}

function mean(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateAssessmentScore(
  responses: AssessmentResponse[],
): AssessmentScoreResult {
  const responseByTaskId = new Map(
    responses.map((response) => [response.taskId, response]),
  );

  const taskScores = assessmentTasks.map((task) =>
    scoreTask(task, responseByTaskId.get(task.id)),
  );

  const scores = createEmptyScores();

  for (const taskScore of taskScores) {
    if (taskScore.dimension === "metacognitiveCalibration") {
      continue;
    }

    scores[taskScore.dimension] = roundScore(taskScore.score);
  }

  const metacognitiveTask = assessmentTasks.find(
    (task) => task.dimension === "metacognitiveCalibration",
  );
  const metacognitiveTaskScore = metacognitiveTask
    ? scoreTaskObjective(
        metacognitiveTask,
        responseByTaskId.get(metacognitiveTask.id),
      )
    : 0;

  const calibrationValues = taskScores
    .map((taskScore) => taskScore.calibration)
    .filter((value): value is number => value !== null);

  const globalCalibration = mean(calibrationValues);

  scores.metacognitiveCalibration = roundScore(
    100 *
      (metacognitiveTaskScore * METACOGNITIVE_AWARENESS_WEIGHT +
        globalCalibration * GLOBAL_CALIBRATION_WEIGHT),
  );

  return {
    scores,
    taskScores,
  };
}

export function calculateScores(
  responses: AssessmentResponse[],
): DimensionScores {
  return calculateAssessmentScore(responses).scores;
}

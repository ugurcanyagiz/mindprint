import { assessmentTasks } from "./tasks";
import { calculateAssessmentScore, scoreTaskObjective } from "./scoring";
import type { AssessmentResponse, DimensionScores } from "./types";

export type CognitiveProfile = {
  scores: DimensionScores;
  averageConfidence: number;
  responseAccuracy: number;
  calibrationGap: number;
};

function mean(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number) {
  return Math.round(value);
}

export function calculateProfileMetrics(
  responses: AssessmentResponse[],
): Pick<
  CognitiveProfile,
  "averageConfidence" | "responseAccuracy" | "calibrationGap"
> {
  const responseByTaskId = new Map(
    responses.map((response) => [response.taskId, response]),
  );

  const objectivePercentages = assessmentTasks.map((task) => {
    const response = responseByTaskId.get(task.id);
    return scoreTaskObjective(task, response) * 100;
  });

  const confidencePairs = assessmentTasks.flatMap((task) => {
    if (!("confidenceRequired" in task) || !task.confidenceRequired) {
      return [];
    }

    const response = responseByTaskId.get(task.id);

    if (!response || response.confidence === undefined) {
      return [];
    }

    return [
      {
        confidence: response.confidence,
        objective: scoreTaskObjective(task, response) * 100,
      },
    ];
  });

  const averageConfidence = mean(
    confidencePairs.map((pair) => pair.confidence),
  );
  const calibrationGap = mean(
    confidencePairs.map((pair) =>
      Math.abs(pair.confidence - pair.objective),
    ),
  );

  return {
    averageConfidence: round(averageConfidence),
    responseAccuracy: round(mean(objectivePercentages)),
    calibrationGap: round(calibrationGap),
  };
}

export function buildCognitiveProfile(
  responses: AssessmentResponse[],
): CognitiveProfile {
  const { scores } = calculateAssessmentScore(responses);

  return {
    scores,
    ...calculateProfileMetrics(responses),
  };
}

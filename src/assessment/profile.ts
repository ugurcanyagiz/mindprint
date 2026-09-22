import { assessmentTasks } from "./tasks";
import { calculateAssessmentScore, scoreTaskObjective } from "./scoring";
import type {
  AssessmentResponse,
  CognitiveDimension,
  DimensionScores,
} from "./types";

export const dimensionLabels: Record<CognitiveDimension, string> = {
  reasoning: "Reasoning",
  adaptiveLearning: "Adaptive Learning",
  evidenceEvaluation: "Evidence Evaluation",
  informationFiltering: "Information Filtering",
  metacognitiveCalibration: "Metacognitive Calibration",
  knowledgeTransfer: "Knowledge Transfer",
};

export type CognitiveProfile = {
  scores: DimensionScores;
  averageConfidence: number;
  responseAccuracy: number;
  calibrationGap: number;
  strengthsText: string;
  calibrationText: string;
  assessmentNote: string;
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

function formatDimensionList(dimensions: CognitiveDimension[]) {
  const labels = dimensions.map((dimension) => dimensionLabels[dimension]);

  if (labels.length === 1) {
    return labels[0];
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }

  return `${labels.slice(0, -1).join(", ")}, and ${labels.at(-1)}`;
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

function createStrengthsText(scores: DimensionScores) {
  const ranked = (Object.entries(scores) as [
    CognitiveDimension,
    number,
  ][]).sort((left, right) => right[1] - left[1]);

  const spread = ranked[0][1] - ranked[ranked.length - 1][1];

  if (spread <= 8) {
    return "Performance was relatively even across the measured dimensions within this assessment.";
  }

  const strongest = ranked.slice(0, 2).map(([dimension]) => dimension);

  return `Your responses showed comparatively strong performance in ${formatDimensionList(strongest)} within this assessment.`;
}

function createCalibrationText(calibrationGap: number) {
  if (calibrationGap <= 15) {
    return "Your stated confidence tracked observed task performance closely overall.";
  }

  if (calibrationGap <= 30) {
    return "Your stated confidence showed some distance from observed task performance.";
  }

  return "Your stated confidence varied noticeably from observed task performance across the calibrated tasks.";
}

export function buildCognitiveProfile(
  responses: AssessmentResponse[],
): CognitiveProfile {
  const { scores } = calculateAssessmentScore(responses);
  const metrics = calculateProfileMetrics(responses);

  return {
    scores,
    ...metrics,
    strengthsText: createStrengthsText(scores),
    calibrationText: createCalibrationText(metrics.calibrationGap),
    assessmentNote:
      "Scores reflect performance in this six-task experimental prototype and should be read as task-level signals rather than stable traits.",
  };
}

export function createProfileSummary(profile: CognitiveProfile) {
  const dimensions = (
    Object.entries(profile.scores) as [CognitiveDimension, number][]
  )
    .map(
      ([dimension, score]) =>
        `${dimensionLabels[dimension]}: ${score}/100`,
    )
    .join("\n");

  return [
    "MINDPRINT — Cognitive Profile",
    "",
    dimensions,
    "",
    `Average Confidence: ${profile.averageConfidence}%`,
    `Response Accuracy: ${profile.responseAccuracy}%`,
    `Calibration Gap: ${profile.calibrationGap} pts`,
    "",
    profile.strengthsText,
    profile.calibrationText,
    "",
    "These scores summarize performance within this experimental prototype. They are not standardized IQ scores, clinical findings, or population percentiles.",
  ].join("\n");
}

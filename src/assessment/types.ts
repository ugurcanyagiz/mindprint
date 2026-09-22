export const cognitiveDimensions = [
  "reasoning",
  "adaptiveLearning",
  "evidenceEvaluation",
  "informationFiltering",
  "metacognitiveCalibration",
  "knowledgeTransfer",
] as const;

export type CognitiveDimension = (typeof cognitiveDimensions)[number];
export type Confidence = number;

export type AssessmentResponse = {
  taskId: string;
  answer: unknown;
  confidence?: Confidence;
  startedAt: string;
  completedAt: string;
};

export type DimensionScores = Record<CognitiveDimension, number>;

export type AssessmentTask = {
  id: string;
  dimension: CognitiveDimension;
  version: number;
  prompt: string;
};

export type AssessmentTaskBlueprint = {
  id: string;
  dimension: CognitiveDimension;
  order: number;
};

export type AssessmentSession = {
  status: "not_started" | "in_progress";
  currentTaskIndex: number;
  confidence: Confidence;
  startedAt: string | null;
  updatedAt: string;
};

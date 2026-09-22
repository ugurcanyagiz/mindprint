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

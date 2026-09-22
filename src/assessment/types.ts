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

export type ChoiceOption = {
  id: string;
  label: string;
};

export type RuleExample = {
  expression: string;
  result: string;
};

type AssessmentTaskBase = {
  id: string;
  dimension: CognitiveDimension;
  version: number;
  order: number;
  eyebrow: string;
  title: string;
};

export type AdaptiveRuleTask = AssessmentTaskBase & {
  kind: "adaptive-rule";
  phaseA: {
    examples: RuleExample[];
    prompt: string;
    answerKey: string;
  };
  phaseB: {
    examples: RuleExample[];
    prompt: string;
    answerKey: string;
  };
  scoringMeta: {
    phaseAWeight: number;
    phaseBWeight: number;
  };
};

export type SingleChoiceTask = AssessmentTaskBase & {
  kind: "single-choice";
  context?: string[];
  principle?: string;
  prompt: string;
  options: ChoiceOption[];
  answerKey: string;
  confidenceRequired: boolean;
};

export type AssessmentTask = AdaptiveRuleTask | SingleChoiceTask;

export type AssessmentResponse = {
  taskId: string;
  answer: unknown;
  confidence?: Confidence;
  startedAt: string;
  completedAt: string;
};

export type DimensionScores = Record<CognitiveDimension, number>;

export type AdaptivePhase = "phase-a" | "transition" | "phase-b";

export type AssessmentSession = {
  version: 2;
  status: "not_started" | "in_progress" | "completed";
  currentTaskIndex: number;
  confidence: Confidence;
  draftAnswer: string | null;
  adaptivePhase: AdaptivePhase;
  adaptivePhaseAAnswer: string | null;
  responses: AssessmentResponse[];
  startedAt: string | null;
  taskStartedAt: string | null;
  updatedAt: string;
};

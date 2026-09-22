import type { Locale } from "../i18n/config";

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
export type AssessmentDraftAnswer = string | string[] | null;

export type ChoiceOption = {
  id: string;
  label: string;
};

export type MetricItem = {
  id: string;
  label: string;
  value: string;
};

export type RankingItem = {
  id: string;
  label: string;
  detail: string;
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

export type MultiSelectTask = AssessmentTaskBase & {
  kind: "multi-select";
  context: string;
  prompt: string;
  metrics: MetricItem[];
  selectionLimit: number;
  answerKey: string[];
  confidenceRequired: boolean;
};

export type RankingTask = AssessmentTaskBase & {
  kind: "ranking";
  claim: string;
  prompt: string;
  items: RankingItem[];
  answerKey: string[];
  confidenceRequired: boolean;
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
  analysis?: string;
  prompt: string;
  options: ChoiceOption[];
  answerKey: string;
  confidenceRequired: boolean;
};

export type AssessmentTask =
  | MultiSelectTask
  | RankingTask
  | AdaptiveRuleTask
  | SingleChoiceTask;

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
  version: 4;
  status: "not_started" | "in_progress" | "completed";
  assessmentLanguage: Locale | null;
  currentTaskIndex: number;
  confidence: Confidence;
  draftAnswer: AssessmentDraftAnswer;
  adaptivePhase: AdaptivePhase;
  adaptivePhaseAAnswer: string | null;
  responses: AssessmentResponse[];
  startedAt: string | null;
  taskStartedAt: string | null;
  updatedAt: string;
};

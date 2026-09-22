import type { CognitiveDimension } from "../types";

export const taskDifficulties = ["easy", "medium", "hard"] as const;
export type TaskDifficulty = (typeof taskDifficulties)[number];

export const languageSensitivities = ["low", "medium", "high"] as const;
export type LanguageSensitivity = (typeof languageSensitivities)[number];

export const taskFamilies = [
  "single-decision",
  "ai-judgment",
  "belief-revision",
  "rule-change",
  "signal-vs-noise",
  "source-comparison",
  "base-rate",
  "quantitative-structure",
  "causal-reasoning",
  "confidence-calibration",
  "knowledge-transfer",
] as const;
export type TaskFamily = (typeof taskFamilies)[number];

export const expectedResponseTypes = [
  "single-choice",
  "multi-select",
  "ranking",
  "numeric",
  "phased-choice",
  "phased-numeric",
  "confidence-pair",
] as const;
export type ExpectedResponseType = (typeof expectedResponseTypes)[number];

export const scoringStrategies = [
  "binary-correctness",
  "partial-credit",
  "rank-distance",
  "objective-with-calibration",
  "belief-revision-quality",
  "phase-weighted-adaptation",
  "evidence-selection-quality",
  "transfer-quality",
] as const;
export type ScoringStrategy = (typeof scoringStrategies)[number];

export const confoundTypes = [
  "education",
  "numeracy",
  "language-proficiency",
  "digital-literacy",
  "finance-familiarity",
  "scientific-literacy",
  "ai-familiarity",
  "reading-speed",
  "domain-familiarity",
  "working-memory",
] as const;
export type ConfoundType = (typeof confoundTypes)[number];

export const dimensionSubfacets = {
  reasoning: [
    "logicalSufficiency",
    "causalReasoning",
    "quantitativeReasoning",
    "baseRateReasoning",
  ],
  adaptiveLearning: [
    "ruleInduction",
    "ruleRevision",
    "interferenceResistance",
    "adaptationAfterFeedback",
  ],
  evidenceEvaluation: [
    "sourceCredibility",
    "studyDesignQuality",
    "contradictoryEvidence",
    "independenceConflict",
  ],
  informationFiltering: [
    "signalVsNoise",
    "relevanceSelection",
    "misleadingSalienceResistance",
    "informationPrioritization",
  ],
  metacognitiveCalibration: [
    "uncertaintyRecognition",
    "confidenceCalibration",
    "insufficientInformationDetection",
    "beliefRevision",
  ],
  knowledgeTransfer: [
    "principleAbstraction",
    "crossDomainTransfer",
    "structuralAnalogy",
    "applicationUnderConstraints",
  ],
} as const satisfies Record<CognitiveDimension, readonly string[]>;

export type TaskBankSubfacet =
  (typeof dimensionSubfacets)[keyof typeof dimensionSubfacets][number];

export type TelemetryPlan = {
  answer: boolean;
  confidence: boolean;
  responseTime: boolean;
  revisions: boolean;
  rankingMovements: boolean;
  selectedEvidence: boolean;
  informationViews: boolean;
  beliefChange: boolean;
  confidenceChange: boolean;
  phaseChanges: boolean;
  ruleUpdateErrors: boolean;
};

export type ResearchTaskDefinition = {
  id: string;
  dimension: CognitiveDimension;
  subfacet: TaskBankSubfacet;
  version: number;
  status: "production" | "candidate";
  difficulty: TaskDifficulty;
  taskFamily: TaskFamily;
  cognitiveTarget: string;
  scenarioBlueprint: string;
  expectedResponseType: ExpectedResponseType;
  scoringStrategy: ScoringStrategy;
  languageSensitivity: LanguageSensitivity;
  confounds: ConfoundType[];
  telemetry: TelemetryPlan;
  canonicalAnswerIds: string[];
  difficultyDrivers: string[];
};

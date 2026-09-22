export type ConstructStatus =
  | "hypothesized"
  | "experimental"
  | "supported"
  | "validated";

export type DynamicConstructId =
  | "modelFormation"
  | "attentionControl"
  | "learningDynamics"
  | "metacognitiveRegulation"
  | "epistemicJudgment"
  | "knowledgeTransfer"
  | "augmentedCognition";

export type SimulationMode = "step" | "real-time";

export type EnvironmentFamilyId =
  | "dynamic-attention"
  | "hidden-system-learning"
  | "dynamic-evidence-stream"
  | "information-search"
  | "structural-transfer"
  | "adaptive-volatility"
  | "ai-collaboration"
  | "uncertainty-decision";

export type DeviceSensitivity = "low" | "medium" | "high";
export type LanguageSensitivity = "low" | "medium" | "high";

export type EnvironmentDifficulty = {
  informationDensity: number;
  distractorSimilarity: number;
  volatility: number;
  uncertainty: number;
  transferDistance: number;
  interruptionLoad: number;
  ruleComplexity: number;
};

export type SimulationEventType =
  | "signal-update"
  | "new-evidence"
  | "rule-change"
  | "interruption"
  | "feedback"
  | "ai-message"
  | "trial"
  | "decision-checkpoint";

export type SimulationEvent = {
  id: string;
  at: number;
  type: SimulationEventType;
  label: string;
};

export type TraceType =
  | "signal-selection"
  | "decision"
  | "confidence"
  | "information-request"
  | "revision"
  | "rule-prediction"
  | "rule-change-detection"
  | "transfer-choice"
  | "ai-reliance"
  | "interruption"
  | "evidence-update";

export type TraceCategory = "outcome" | "process";

export type CognitiveTrace = {
  id: string;
  type: TraceType;
  category: TraceCategory;
  timestampMs: number;
  environmentId: EnvironmentFamilyId;
  prototypeId: string;
  trialId: string;
  eventId?: string;
  payload: Record<string, string | number | boolean | string[] | null>;
};

export type TraceConstructHypothesis = {
  trace: TraceType;
  hypothesizedConstructs: DynamicConstructId[];
  interpretationStatus: "hypothesized";
  limitation: string;
};

export type DynamicConstructDefinition = {
  id: DynamicConstructId;
  label: string;
  status: ConstructStatus;
  subconstructs: string[];
};

export type EnvironmentMetadata = {
  id: EnvironmentFamilyId;
  label: string;
  version: number;
  validationStatus: "hypothesized" | "experimental";
  hypothesizedConstructs: DynamicConstructId[];
  difficultyParameters: Array<keyof EnvironmentDifficulty>;
  traceTypes: TraceType[];
  knownConfounds: string[];
  languageSensitivity: LanguageSensitivity;
  deviceSensitivity: DeviceSensitivity;
  accessibilityConsiderations: string[];
  prototypeAvailable: boolean;
};

export type TraceSummary = {
  correctOutcomeRate: number | null;
  selectionQuality: number | null;
  meanConfidence: number | null;
  highConfidenceErrorRate: number | null;
  ruleUpdateErrorRate: number | null;
  unnecessaryInformationRate: number | null;
  postInterruptionRecovery: number | null;
};

export type DifficultyAdjustment = {
  parameter: keyof EnvironmentDifficulty;
  delta: number;
  rationale: string;
  ruleId: string;
};

export type AdaptationRule = {
  id: string;
  researchRationale: string;
  evaluate: (summary: TraceSummary) => DifficultyAdjustment[];
};

export type SimulationDiagnostic = {
  prototypeId: string;
  traceSummary: Record<string, number | string | null>;
  outcomeSignals: Record<string, number | string | boolean | null>;
  processSignals: Record<string, number | string | boolean | null>;
};

export type AttentionSignal = {
  id: string;
  label: string;
};

export type AttentionFrame = {
  event: SimulationEvent;
  values: Record<string, number>;
  note?: string;
};

export type AttentionPrototype = {
  id: string;
  kind: "attention";
  family: "dynamic-attention";
  title: string;
  description: string;
  signals: AttentionSignal[];
  frames: AttentionFrame[];
  diagnosticSignalIds: string[];
  selectionLimit: number;
  difficulty: EnvironmentDifficulty;
};

export type HiddenSystemTrial = {
  id: string;
  input: number;
  expected: number;
  phase: "stable-a" | "anomaly" | "changed-b" | "transfer";
  feedbackAfterSubmission: boolean;
  hypothesisCheckpoint?: boolean;
};

export type HiddenSystemPrototype = {
  id: string;
  kind: "hidden-system";
  family: "hidden-system-learning";
  title: string;
  description: string;
  trials: HiddenSystemTrial[];
  changeTrialIndex: number;
  difficulty: EnvironmentDifficulty;
};

export type EvidenceEvent = {
  id: string;
  event: SimulationEvent;
  source: string;
  evidence: string;
  evidentialDirection: "supports" | "contradicts" | "mixed";
  evidentialWeight: "weak" | "moderate" | "strong";
  independence: string;
  studyQuality: string;
  sampleInformation: string;
  conflictOfInterest: string;
  diagnosticWeight: number;
};

export type EvidencePrototype = {
  id: string;
  kind: "evidence-stream";
  family: "dynamic-evidence-stream";
  title: string;
  description: string;
  hypothesis: string;
  evidence: EvidenceEvent[];
  responseOptions: Array<{ id: string; label: string }>;
  difficulty: EnvironmentDifficulty;
};

export type SimulationPrototype =
  | AttentionPrototype
  | HiddenSystemPrototype
  | EvidencePrototype;

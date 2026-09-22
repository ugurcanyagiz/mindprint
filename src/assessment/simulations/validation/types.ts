import type {
  AttentionPrototype,
  CognitiveTrace,
  DynamicConstructId,
  EnvironmentDifficulty,
  EnvironmentFamilyId,
  EvidencePrototype,
  HiddenSystemPrototype,
  SimulationPrototype,
} from "../types";

export type SimulationFormLabel = "A" | "B";
export type DevelopmentDifficulty =
  | "development-easy"
  | "development-medium"
  | "development-hard";
export type MobileRisk = "low" | "medium" | "high";

export type AttentionManipulation = {
  kind: "attention";
  relevantSignalCount: number;
  irrelevantSignalCount: number;
  salientDistractorId: string;
  salientDistractorPresent: boolean;
  interruptionPresent: boolean;
  distractorPeakMagnitude: number;
};

export type RuleDefinition = {
  id: string;
  description: string;
};

export type HiddenSystemManipulation = {
  kind: "hidden-system";
  stableTrials: number;
  anomalyTrials: number;
  anomalyTrialIds: string[];
  trueChangeTrial: number;
  postChangeTrials: number;
  transferTrials: number;
  oldRule: RuleDefinition;
  newRule: RuleDefinition;
};

export type EvidenceManipulation = {
  kind: "evidence-stream";
  evidenceCount: number;
  requiresDirectionVariation: true;
  requiresStrengthVariation: true;
  requiresStrongContradiction: true;
};

export type SimulationManipulation =
  | AttentionManipulation
  | HiddenSystemManipulation
  | EvidenceManipulation;

export type SimulationForm<T extends SimulationPrototype = SimulationPrototype> = {
  id: string;
  environmentId: EnvironmentFamilyId;
  version: number;
  formLabel: SimulationFormLabel;
  structuralTemplateId: string;
  manipulationProfile: EnvironmentDifficulty;
  language: "en";
  intendedDifficulty: DevelopmentDifficulty;
  validationStatus: "experimental";
  parallelFormOf: string;
  mobileRisk: MobileRisk;
  prototype: T;
  manipulation: SimulationManipulation;
};

export type AttentionSimulationForm = SimulationForm<AttentionPrototype>;
export type HiddenSystemSimulationForm = SimulationForm<HiddenSystemPrototype>;
export type EvidenceSimulationForm = SimulationForm<EvidencePrototype>;

export type ManipulationValidationResult = {
  formId: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type ObservationType =
  | "diagnostic-selection-quality"
  | "distractor-capture"
  | "post-interruption-priority-retention"
  | "final-confidence"
  | "pre-change-accuracy"
  | "anomaly-overreaction"
  | "post-change-accuracy"
  | "transfer-success"
  | "change-detection-trial"
  | "belief-update-count"
  | "strong-contradiction-sensitivity"
  | "confidence-after-strong-evidence"
  | "final-judgment";

export type CognitiveObservation = {
  id: string;
  participantSessionId: string;
  environmentId: EnvironmentFamilyId;
  formId: string;
  constructHypotheses: DynamicConstructId[];
  observationType: ObservationType;
  value: number | boolean | string | null;
  sourceTraceIds: string[];
  interpretationStatus: "hypothesized";
  qualityFlags: string[];
};

export type SimulationQualityFlagType =
  | "background-tab"
  | "invalid-event-order"
  | "missing-confidence"
  | "incomplete-form"
  | "duplicate-trace"
  | "unsupported-trace"
  | "timing-anomaly"
  | "form-validation-warning";

export type SimulationQualityFlag = {
  id: string;
  type: SimulationQualityFlagType;
  scope: "session" | "form" | "trace";
  formId?: string;
  traceId?: string;
  detail: string;
  automaticExclusion: false;
};

export type InputMode = "mouse" | "touch" | "keyboard" | "unknown";
export type DeviceClass = "mobile" | "tablet" | "desktop";
export type ViewportWidthBand = "narrow" | "medium" | "wide";
export type PixelRatioBand = "standard" | "retina-like" | "high";

export type SimulationDeviceContext = {
  viewportWidthBand: ViewportWidthBand;
  inputMode: InputMode;
  deviceClass: DeviceClass;
  reducedMotion: boolean;
  pixelRatioBand: PixelRatioBand;
};

export type InstrumentationEvent = {
  id: string;
  type: "tab-hidden" | "tab-visible" | "input-mode";
  timestampMs: number;
  value?: string;
};

export type SimulationTimingContext = {
  timingSource: "performance-now" | "date-now";
  precision: "browser-contextual";
  backgroundTabDetected: boolean;
  interruptionsDetected: boolean;
  wallClockDurationMs: number | null;
  activeDurationMs: number | null;
};

export type SimulationCompletionStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "abandoned"
  | "interrupted"
  | "invalid";

export type SimulationResearchExport = {
  schemaVersion: string;
  simulationEngineVersion: string;
  researchProtocolVersion: string;
  source: "local-pilot-export";
  session: {
    researchSessionId: string;
    studyVersion: string;
    status: SimulationCompletionStatus;
    startedAt: string | null;
    completedAt: string | null;
    mode: "step" | "real-time";
  };
  forms: Array<{
    id: string;
    environmentId: EnvironmentFamilyId;
    version: number;
    formLabel: SimulationFormLabel;
    structuralTemplateId: string;
  }>;
  traces: CognitiveTrace[];
  observations: CognitiveObservation[];
  qualityFlags: SimulationQualityFlag[];
  deviceContext: SimulationDeviceContext;
  timingContext: SimulationTimingContext;
};

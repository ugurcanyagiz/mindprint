import type { ExperimentalTaskResponse } from "../experimental/types";
import type { CognitiveDimension } from "../types";
import type { Locale } from "../../i18n/config";
import type { TaskBankSubfacet } from "../task-bank/types";

export const researchCompletionStatuses = [
  "completed",
  "skipped",
  "abandoned",
  "incomplete-phase",
  "interrupted",
] as const;
export type ResearchCompletionStatus =
  (typeof researchCompletionStatuses)[number];

export const candidateDispositionStatuses = [
  "draft",
  "pilot",
  "review",
  "retain",
  "revise",
  "retire",
] as const;
export type CandidateDispositionStatus =
  (typeof candidateDispositionStatuses)[number];

export type DeviceClass = "mobile" | "tablet" | "desktop";

export type ResearchParticipantContext = {
  participantId: string;
  studyVersion: string;
  assessmentLanguage: Locale;
  ageBand?: string;
  educationBand?: string;
  primaryLanguage?: string;
  digitalUseFrequency?: string;
  aiUseFrequency?: string;
  deviceClass?: DeviceClass;
  consentVersion: string;
};

export type ResearchPhaseRecord = {
  phaseId: string;
  answer: string | string[] | null;
  confidence: number | null;
  objectiveQuality: number | null;
  revisions: number;
  startedAt: string | null;
  completedAt: string | null;
  durationMs: number | null;
};

export type ResearchTaskRecord = {
  participantId: string;
  studyVersion: string;
  taskId: string;
  taskVersion: number;
  dimension: CognitiveDimension;
  subfacet: TaskBankSubfacet;
  language: Locale;
  completionStatus: ResearchCompletionStatus;
  startedAt: string | null;
  completedAt: string | null;
  durationMs: number | null;
  phaseResponses: ResearchPhaseRecord[];
  revisions: number;
  selectedEvidence: string[];
  rankingMovements: number | null;
  initialAnswer: string | string[] | null;
  revisedAnswer: string | string[] | null;
  initialConfidence: number | null;
  revisedConfidence: number | null;
  beliefChanged: boolean | null;
  confidenceDelta: number | null;
  source: "synthetic" | "pilot";
};

export type ResearchDataset = {
  source: "synthetic" | "pilot";
  participants: ResearchParticipantContext[];
  records: ResearchTaskRecord[];
};

export type ResearchItemMetrics = {
  taskId: string;
  nAttempted: number;
  nCompleted: number;
  completionRate: number | null;
  missingRate: number | null;
  objectiveMean: number | null;
  objectiveVariance: number | null;
  optionDistribution: Record<string, number>;
  confidenceMean: number | null;
  confidenceVariance: number | null;
  calibrationGap: number | null;
  medianResponseDurationMs: number | null;
  revisionRate: number | null;
  phaseAccuracy: Array<{
    phaseId: string;
    meanObjectiveQuality: number | null;
  }>;
  beliefChangeRate: number | null;
  appropriateRevisionRate: number | null;
  confidenceChangeMean: number | null;
  flags: ResearchItemFlag[];
};

export type ResearchItemFlag =
  | "possible-floor"
  | "possible-ceiling"
  | "high-missingness"
  | "invalid-duration";

export type ItemAnalysisThresholds = {
  floorObjectiveMean: number;
  ceilingObjectiveMean: number;
  highMissingRate: number;
};

export type ResearchDataIssue =
  | {
      type: "invalid-duration";
      participantId: string;
      taskId: string;
    }
  | {
      type: "duplicate-record";
      participantId: string;
      taskId: string;
    }
  | {
      type: "corrupted-record";
      participantId: string;
      taskId: string;
      reason: string;
    };

export type ParticipantExclusionDecision = {
  participantId: string;
  excluded: boolean;
  reasons: string[];
  ruleIds: string[];
};

export type ItemReview = {
  taskId: string;
  psychometricSignal: number | null;
  completionQuality: number | null;
  redundancy: number | null;
  fairnessRisk: number | null;
  languageRisk: number | null;
  usabilityRisk: number | null;
  constructCoverage: number | null;
  disposition: CandidateDispositionStatus;
  manualReviewRequired: true;
  notes: string[];
};

export type FairnessGroupKey =
  | "assessmentLanguage"
  | "ageBand"
  | "educationBand"
  | "primaryLanguage"
  | "digitalUseFrequency"
  | "aiUseFrequency"
  | "deviceClass";

export type FairnessGroupSummary = {
  group: string;
  nParticipants: number;
  nRecords: number;
  completionRate: number | null;
  objectiveMean: number | null;
  confidenceMean: number | null;
  medianDurationMs: number | null;
};

export type ExternalValidityTarget = {
  construct:
    | "reasoning"
    | "metacognitive-calibration"
    | "adaptive-learning"
    | "evidence-evaluation"
    | "incremental-validity";
  comparator: string;
  expectedDirection: "positive" | "negative" | "weaker-than-related";
  status: "planned";
};

export type ResearchRecordInput = {
  participant: ResearchParticipantContext;
  taskResponse: ExperimentalTaskResponse;
};

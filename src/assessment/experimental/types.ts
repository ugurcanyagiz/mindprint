export type ExperimentalResponseKind =
  | "single-choice"
  | "multi-select"
  | "numeric";

export type ExperimentalOption = {
  id: string;
  label: string;
  detail?: string;
};

export type ExperimentalEvidenceItem = {
  id: string;
  label: string;
  detail: string;
  value?: string;
};

export type ExperimentalRuleExample = {
  expression: string;
  result: string;
};

export type ExperimentalPhase = {
  id: string;
  heading?: string;
  context?: string[];
  analysis?: {
    label: string;
    text: string;
  };
  principle?: string;
  evidence?: ExperimentalEvidenceItem[];
  examples?: ExperimentalRuleExample[];
  prompt: string;
  response:
    | {
        kind: "single-choice";
        options: ExperimentalOption[];
      }
    | {
        kind: "multi-select";
        items: ExperimentalEvidenceItem[];
        selectionLimit: number;
      }
    | {
        kind: "numeric";
      };
  answerKey: string | string[];
  confidenceRequired: boolean;
};

export type ExperimentalTask = {
  id: string;
  title: string;
  description?: string;
  diagnosticMode:
    | "standard"
    | "belief-revision"
    | "adaptation"
    | "evidence-selection"
    | "transfer";
  phases: ExperimentalPhase[];
};

export type ExperimentalDraftAnswer = string | string[] | null;

export type ExperimentalPhaseResponse = {
  phaseId: string;
  answer: string | string[];
  confidence?: number;
  revisions: number;
  startedAt: string;
  completedAt: string;
};

export type ExperimentalTaskResponse = {
  taskId: string;
  phases: ExperimentalPhaseResponse[];
  startedAt: string;
  completedAt: string;
  phaseHistory: Array<{
    phaseId: string;
    enteredAt: string;
  }>;
  beliefChanged?: boolean;
  confidenceDelta?: number;
};

export type ExperimentalTaskState = {
  taskId: string;
  phaseIndex: number;
  draftAnswer: ExperimentalDraftAnswer;
  confidence: number;
  revisions: number;
  completedPhases: ExperimentalPhaseResponse[];
  phaseStartedAt: string;
  taskStartedAt: string;
  phaseHistory: Array<{
    phaseId: string;
    enteredAt: string;
  }>;
};

export type ExperimentalSession = {
  version: 1;
  status: "not_started" | "in_progress" | "completed";
  currentTaskIndex: number;
  currentTaskState: ExperimentalTaskState | null;
  responses: ExperimentalTaskResponse[];
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
};

export type ExperimentalDiagnostic = {
  taskId: string;
  objectiveQuality: number;
  calibrationQuality: number | null;
  revisionQuality: number | null;
  evidenceSelectionQuality: number | null;
};

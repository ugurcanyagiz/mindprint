import {
  readLocalValue,
  removeLocalValue,
  writeLocalValue,
} from "../../lib/storage";
import { assignedFormLabel } from "./validation/randomization";
import {
  attentionForms,
  evidenceForms,
  formById,
  hiddenSystemForms,
} from "./validation/forms";
import {
  createLocalResearchSessionId,
  defaultDeviceContext,
  withInputMode,
} from "./validation/instrumentation";
import type {
  InputMode,
  InstrumentationEvent,
  SimulationCompletionStatus,
  SimulationDeviceContext,
} from "./validation/types";
import { appendTrace } from "./traces";
import type {
  AttentionPrototype,
  CognitiveTrace,
  EvidencePrototype,
  HiddenSystemPrototype,
  SimulationMode,
} from "./types";

export const SIMULATION_SESSION_KEY = "dynamic-simulation-research-session";
export const SIMULATION_SESSION_VERSION = 2;
export const SIMULATION_STUDY_VERSION = "dynamic-pilot-0.1";

export type AttentionState = {
  frameIndex: number;
  selectedSignalIds: string[];
  selectionSequence: string[];
  confidence: number;
  completed: boolean;
};

export type HiddenPrediction = {
  trialId: string;
  answer: string;
  correct: boolean;
  expected: number;
  phase: "stable-a" | "anomaly" | "changed-b" | "transfer";
  hypothesis: string | null;
};

export type HiddenHypothesisCheckpoint = {
  trialId: string;
  hypothesis: string;
};

export type HiddenSystemState = {
  trialIndex: number;
  draftAnswer: string;
  hypothesisDraft: string;
  predictions: HiddenPrediction[];
  hypothesisCheckpoints: HiddenHypothesisCheckpoint[];
  lastFeedback: string | null;
  changeDetectedAtTrial: number | null;
  confidence: number;
  completed: boolean;
};

export type EvidenceCheckpoint = {
  evidenceId: string;
  decision: string;
  confidence: number;
};

export type EvidenceState = {
  eventIndex: number;
  decision: string | null;
  confidence: number;
  checkpoints: EvidenceCheckpoint[];
  completed: boolean;
};

export type AssignedSimulationForms = {
  attention: string;
  hiddenSystem: string;
  evidence: string;
};

export type SimulationResearchSession = {
  version: 2;
  researchSessionId: string;
  studyVersion: string;
  mode: SimulationMode;
  status: SimulationCompletionStatus;
  currentPrototypeIndex: number;
  assignedFormIds: AssignedSimulationForms;
  traces: CognitiveTrace[];
  instrumentationEvents: InstrumentationEvent[];
  deviceContext: SimulationDeviceContext;
  attention: AttentionState;
  hiddenSystem: HiddenSystemState;
  evidence: EvidenceState;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
};

function isoNow() {
  return new Date().toISOString();
}

function clampConfidence(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function traceId(
  session: SimulationResearchSession,
  formId: string,
  type: CognitiveTrace["type"],
  trialId: string,
  suffix = "",
) {
  return [
    session.researchSessionId,
    formId,
    type,
    trialId,
    suffix,
  ]
    .filter(Boolean)
    .join(":");
}

function selectFormId(
  environmentId: "dynamic-attention" | "hidden-system-learning" | "dynamic-evidence-stream",
  researchSessionId: string,
  studyVersion: string,
) {
  const label = assignedFormLabel(
    environmentId,
    researchSessionId,
    studyVersion,
  );
  const forms =
    environmentId === "dynamic-attention"
      ? attentionForms
      : environmentId === "hidden-system-learning"
        ? hiddenSystemForms
        : evidenceForms;

  return forms.find((form) => form.formLabel === label)?.id ?? forms[0].id;
}

export function createSimulationSession(
  mode: SimulationMode = "step",
  researchSessionId = createLocalResearchSessionId(),
): SimulationResearchSession {
  const studyVersion = SIMULATION_STUDY_VERSION;

  return {
    version: SIMULATION_SESSION_VERSION,
    researchSessionId,
    studyVersion,
    mode,
    status: "not_started",
    currentPrototypeIndex: 0,
    assignedFormIds: {
      attention: selectFormId(
        "dynamic-attention",
        researchSessionId,
        studyVersion,
      ),
      hiddenSystem: selectFormId(
        "hidden-system-learning",
        researchSessionId,
        studyVersion,
      ),
      evidence: selectFormId(
        "dynamic-evidence-stream",
        researchSessionId,
        studyVersion,
      ),
    },
    traces: [],
    instrumentationEvents: [],
    deviceContext: defaultDeviceContext(),
    attention: {
      frameIndex: 0,
      selectedSignalIds: [],
      selectionSequence: [],
      confidence: 50,
      completed: false,
    },
    hiddenSystem: {
      trialIndex: 0,
      draftAnswer: "",
      hypothesisDraft: "",
      predictions: [],
      hypothesisCheckpoints: [],
      lastFeedback: null,
      changeDetectedAtTrial: null,
      confidence: 50,
      completed: false,
    },
    evidence: {
      eventIndex: 0,
      decision: null,
      confidence: 50,
      checkpoints: [],
      completed: false,
    },
    startedAt: null,
    completedAt: null,
    updatedAt: isoNow(),
  };
}

export function attentionForm(session: SimulationResearchSession) {
  return formById(session.assignedFormIds.attention);
}

export function hiddenSystemForm(session: SimulationResearchSession) {
  return formById(session.assignedFormIds.hiddenSystem);
}

export function evidenceForm(session: SimulationResearchSession) {
  return formById(session.assignedFormIds.evidence);
}

export function attentionPrototype(
  session: SimulationResearchSession,
): AttentionPrototype {
  const prototype = attentionForm(session).prototype;
  if (prototype.kind !== "attention") {
    throw new Error("Assigned attention form has wrong prototype kind.");
  }
  return prototype;
}

export function hiddenPrototype(
  session: SimulationResearchSession,
): HiddenSystemPrototype {
  const prototype = hiddenSystemForm(session).prototype;
  if (prototype.kind !== "hidden-system") {
    throw new Error("Assigned hidden-system form has wrong prototype kind.");
  }
  return prototype;
}

export function evidencePrototype(
  session: SimulationResearchSession,
): EvidencePrototype {
  const prototype = evidenceForm(session).prototype;
  if (prototype.kind !== "evidence-stream") {
    throw new Error("Assigned evidence form has wrong prototype kind.");
  }
  return prototype;
}

export function assignedForms(session: SimulationResearchSession) {
  return [
    attentionForm(session),
    hiddenSystemForm(session),
    evidenceForm(session),
  ];
}

export function beginSimulationSession(
  session: SimulationResearchSession,
): SimulationResearchSession {
  if (session.status === "in_progress") return session;
  const now = isoNow();

  return {
    ...session,
    status: "in_progress",
    currentPrototypeIndex: 0,
    startedAt: session.startedAt ?? now,
    completedAt: null,
    updatedAt: now,
  };
}

function advancePrototype(
  session: SimulationResearchSession,
): SimulationResearchSession {
  const nextIndex = session.currentPrototypeIndex + 1;
  const completed = nextIndex >= 3;
  const now = isoNow();

  return {
    ...session,
    status: completed ? "completed" : "in_progress",
    currentPrototypeIndex: completed ? 2 : nextIndex,
    completedAt: completed ? now : null,
    updatedAt: now,
  };
}

export function updateSimulationDeviceContext(
  session: SimulationResearchSession,
  context: SimulationDeviceContext,
): SimulationResearchSession {
  return {
    ...session,
    deviceContext: {
      ...context,
      inputMode: session.deviceContext.inputMode,
    },
  };
}

export function recordInputMode(
  session: SimulationResearchSession,
  inputMode: InputMode,
  timestampMs = Date.now(),
): SimulationResearchSession {
  if (session.deviceContext.inputMode === inputMode) return session;

  return {
    ...session,
    deviceContext: withInputMode(session.deviceContext, inputMode),
    instrumentationEvents: [
      ...session.instrumentationEvents,
      {
        id: `${session.researchSessionId}:input-mode:${timestampMs}:${inputMode}`,
        type: "input-mode",
        timestampMs,
        value: inputMode,
      },
    ],
    updatedAt: isoNow(),
  };
}

export function recordVisibilityEvent(
  session: SimulationResearchSession,
  hidden: boolean,
  timestampMs = Date.now(),
): SimulationResearchSession {
  const type = hidden ? "tab-hidden" : "tab-visible";
  const event: InstrumentationEvent = {
    id: `${session.researchSessionId}:${type}:${timestampMs}`,
    type,
    timestampMs,
  };

  if (session.instrumentationEvents.some((item) => item.id === event.id)) {
    return session;
  }

  return {
    ...session,
    status:
      hidden && session.status === "in_progress"
        ? "interrupted"
        : !hidden && session.status === "interrupted"
          ? "in_progress"
          : session.status,
    instrumentationEvents: [...session.instrumentationEvents, event],
    updatedAt: isoNow(),
  };
}

export function toggleAttentionSignal(
  session: SimulationResearchSession,
  signalId: string,
  timestampMs = Date.now(),
): SimulationResearchSession {
  const prototype = attentionPrototype(session);
  const form = attentionForm(session);
  const selected = session.attention.selectedSignalIds;
  const exists = selected.includes(signalId);

  if (!exists && selected.length >= prototype.selectionLimit) return session;

  const nextSelected = exists
    ? selected.filter((id) => id !== signalId)
    : [...selected, signalId];
  const frame = prototype.frames[session.attention.frameIndex];
  const sequenceIndex = session.attention.selectionSequence.length;
  const trace: CognitiveTrace = {
    id: traceId(
      session,
      form.id,
      "signal-selection",
      frame.event.id,
      String(sequenceIndex),
    ),
    type: "signal-selection",
    category: "process",
    timestampMs,
    environmentId: prototype.family,
    prototypeId: prototype.id,
    trialId: frame.event.id,
    eventId: frame.event.id,
    payload: {
      formId: form.id,
      signalId,
      selected: !exists,
      selectedSignals: nextSelected,
      frameIndex: session.attention.frameIndex,
    },
  };

  return {
    ...session,
    traces: appendTrace(session.traces, trace),
    attention: {
      ...session.attention,
      selectedSignalIds: nextSelected,
      selectionSequence: [
        ...session.attention.selectionSequence,
        `${exists ? "deselect" : "select"}:${signalId}`,
      ],
    },
    updatedAt: isoNow(),
  };
}

export function advanceAttentionFrame(
  session: SimulationResearchSession,
  timestampMs = Date.now(),
): SimulationResearchSession {
  const prototype = attentionPrototype(session);
  const form = attentionForm(session);
  const current = prototype.frames[session.attention.frameIndex];
  const nextIndex = Math.min(
    session.attention.frameIndex + 1,
    prototype.frames.length - 1,
  );
  let traces = session.traces;

  if (current.event.type === "interruption") {
    traces = appendTrace(traces, {
      id: traceId(
        session,
        form.id,
        "interruption",
        current.event.id,
      ),
      type: "interruption",
      category: "process",
      timestampMs,
      environmentId: prototype.family,
      prototypeId: prototype.id,
      trialId: current.event.id,
      eventId: current.event.id,
      payload: {
        formId: form.id,
        recoveredToNextFrame: true,
        selectedSignals: session.attention.selectedSignalIds,
      },
    });
  }

  return {
    ...session,
    traces,
    attention: {
      ...session.attention,
      frameIndex: nextIndex,
    },
    updatedAt: isoNow(),
  };
}

export function setAttentionConfidence(
  session: SimulationResearchSession,
  value: number,
): SimulationResearchSession {
  return {
    ...session,
    attention: {
      ...session.attention,
      confidence: clampConfidence(value),
    },
    updatedAt: isoNow(),
  };
}

export function completeAttentionPrototype(
  session: SimulationResearchSession,
  timestampMs = Date.now(),
): SimulationResearchSession {
  const prototype = attentionPrototype(session);
  const form = attentionForm(session);

  if (session.attention.selectedSignalIds.length !== prototype.selectionLimit) {
    return session;
  }

  const selected = session.attention.selectedSignalIds;
  const correct =
    selected.length === prototype.diagnosticSignalIds.length &&
    prototype.diagnosticSignalIds.every((id) => selected.includes(id));
  let traces = appendTrace(session.traces, {
    id: traceId(session, form.id, "decision", "final-selection"),
    type: "decision",
    category: "outcome",
    timestampMs,
    environmentId: prototype.family,
    prototypeId: prototype.id,
    trialId: "final-selection",
    payload: {
      formId: form.id,
      selectedSignals: selected,
      correct,
    },
  });
  traces = appendTrace(traces, {
    id: traceId(session, form.id, "confidence", "final-selection"),
    type: "confidence",
    category: "process",
    timestampMs: timestampMs + 1,
    environmentId: prototype.family,
    prototypeId: prototype.id,
    trialId: "final-selection",
    payload: {
      formId: form.id,
      value: session.attention.confidence,
      correct,
    },
  });

  return advancePrototype({
    ...session,
    traces,
    attention: {
      ...session.attention,
      completed: true,
    },
  });
}

export function setHiddenDraft(
  session: SimulationResearchSession,
  value: string,
): SimulationResearchSession {
  return {
    ...session,
    hiddenSystem: {
      ...session.hiddenSystem,
      draftAnswer: value,
    },
    updatedAt: isoNow(),
  };
}

export function setHiddenHypothesisDraft(
  session: SimulationResearchSession,
  value: string,
): SimulationResearchSession {
  return {
    ...session,
    hiddenSystem: {
      ...session.hiddenSystem,
      hypothesisDraft: value,
    },
    updatedAt: isoNow(),
  };
}

export function setHiddenConfidence(
  session: SimulationResearchSession,
  value: number,
): SimulationResearchSession {
  return {
    ...session,
    hiddenSystem: {
      ...session.hiddenSystem,
      confidence: clampConfidence(value),
    },
    updatedAt: isoNow(),
  };
}

export function submitHiddenPrediction(
  session: SimulationResearchSession,
  timestampMs = Date.now(),
): SimulationResearchSession {
  const prototype = hiddenPrototype(session);
  const form = hiddenSystemForm(session);
  const state = session.hiddenSystem;
  const trial = prototype.trials[state.trialIndex];

  if (!trial || state.draftAnswer.trim() === "") return session;
  if (trial.hypothesisCheckpoint && !state.hypothesisDraft.trim()) return session;

  const numericAnswer = Number(state.draftAnswer);
  const correct =
    Number.isFinite(numericAnswer) && numericAnswer === trial.expected;
  const hypothesis = trial.hypothesisCheckpoint
    ? state.hypothesisDraft.trim()
    : null;
  const prediction: HiddenPrediction = {
    trialId: trial.id,
    answer: state.draftAnswer,
    correct,
    expected: trial.expected,
    phase: trial.phase,
    hypothesis,
  };

  let traces = appendTrace(session.traces, {
    id: traceId(session, form.id, "rule-prediction", trial.id),
    type: "rule-prediction",
    category: "outcome",
    timestampMs,
    environmentId: prototype.family,
    prototypeId: prototype.id,
    trialId: trial.id,
    eventId: trial.id,
    payload: {
      formId: form.id,
      input: trial.input,
      answer: state.draftAnswer,
      correct,
      phase: trial.phase,
      hypothesis,
    },
  });

  if (hypothesis !== null) {
    traces = appendTrace(traces, {
      id: traceId(session, form.id, "revision", trial.id, "hypothesis"),
      type: "revision",
      category: "process",
      timestampMs: timestampMs + 1,
      environmentId: prototype.family,
      prototypeId: prototype.id,
      trialId: trial.id,
      eventId: trial.id,
      payload: {
        formId: form.id,
        ruleHypothesis: hypothesis,
        checkpoint: state.hypothesisCheckpoints.length + 1,
      },
    });
  }

  let changeDetectedAtTrial = state.changeDetectedAtTrial;
  if (
    state.trialIndex >= prototype.changeTrialIndex &&
    trial.phase === "changed-b" &&
    correct &&
    changeDetectedAtTrial === null
  ) {
    changeDetectedAtTrial = state.trialIndex;
    traces = appendTrace(traces, {
      id: traceId(session, form.id, "rule-change-detection", trial.id),
      type: "rule-change-detection",
      category: "process",
      timestampMs: timestampMs + 2,
      environmentId: prototype.family,
      prototypeId: prototype.id,
      trialId: trial.id,
      eventId: trial.id,
      payload: {
        formId: form.id,
        detectedAtTrial: state.trialIndex,
      },
    });
  }

  const isLast = state.trialIndex >= prototype.trials.length - 1;
  const nextState: HiddenSystemState = {
    ...state,
    trialIndex: isLast ? state.trialIndex : state.trialIndex + 1,
    draftAnswer: "",
    hypothesisDraft: "",
    predictions: [...state.predictions, prediction],
    hypothesisCheckpoints:
      hypothesis === null
        ? state.hypothesisCheckpoints
        : [
            ...state.hypothesisCheckpoints,
            { trialId: trial.id, hypothesis },
          ],
    lastFeedback: trial.feedbackAfterSubmission
      ? correct
        ? `Prediction matched the observed output: ${trial.expected}.`
        : `Observed output: ${trial.expected}.`
      : null,
    changeDetectedAtTrial,
    completed: isLast,
  };

  let nextSession: SimulationResearchSession = {
    ...session,
    traces,
    hiddenSystem: nextState,
    updatedAt: isoNow(),
  };

  if (isLast) nextSession = advancePrototype(nextSession);

  return nextSession;
}

export function setEvidenceDecision(
  session: SimulationResearchSession,
  decision: string,
): SimulationResearchSession {
  return {
    ...session,
    evidence: {
      ...session.evidence,
      decision,
    },
    updatedAt: isoNow(),
  };
}

export function setEvidenceConfidence(
  session: SimulationResearchSession,
  value: number,
): SimulationResearchSession {
  return {
    ...session,
    evidence: {
      ...session.evidence,
      confidence: clampConfidence(value),
    },
    updatedAt: isoNow(),
  };
}

export function submitEvidenceCheckpoint(
  session: SimulationResearchSession,
  timestampMs = Date.now(),
): SimulationResearchSession {
  const prototype = evidencePrototype(session);
  const form = evidenceForm(session);
  const state = session.evidence;
  const evidence = prototype.evidence[state.eventIndex];

  if (!evidence || !state.decision) return session;

  const checkpoint: EvidenceCheckpoint = {
    evidenceId: evidence.id,
    decision: state.decision,
    confidence: state.confidence,
  };
  const previous = state.checkpoints.at(-1);
  let traces = appendTrace(session.traces, {
    id: traceId(session, form.id, "evidence-update", evidence.id),
    type: "evidence-update",
    category: "process",
    timestampMs,
    environmentId: prototype.family,
    prototypeId: prototype.id,
    trialId: evidence.id,
    eventId: evidence.event.id,
    payload: {
      formId: form.id,
      decision: state.decision,
      confidence: state.confidence,
      evidenceDirection: evidence.evidentialDirection,
      evidenceWeight: evidence.evidentialWeight,
      diagnosticWeight: evidence.diagnosticWeight,
      previousDecision: previous?.decision ?? null,
      previousConfidence: previous?.confidence ?? null,
    },
  });
  traces = appendTrace(traces, {
    id: traceId(session, form.id, "decision", evidence.id),
    type: "decision",
    category: "outcome",
    timestampMs: timestampMs + 1,
    environmentId: prototype.family,
    prototypeId: prototype.id,
    trialId: evidence.id,
    eventId: evidence.event.id,
    payload: {
      formId: form.id,
      decision: state.decision,
    },
  });
  traces = appendTrace(traces, {
    id: traceId(session, form.id, "confidence", evidence.id),
    type: "confidence",
    category: "process",
    timestampMs: timestampMs + 2,
    environmentId: prototype.family,
    prototypeId: prototype.id,
    trialId: evidence.id,
    eventId: evidence.event.id,
    payload: {
      formId: form.id,
      value: state.confidence,
    },
  });

  const isLast = state.eventIndex >= prototype.evidence.length - 1;
  let nextSession: SimulationResearchSession = {
    ...session,
    traces,
    evidence: {
      ...state,
      eventIndex: isLast ? state.eventIndex : state.eventIndex + 1,
      decision: null,
      confidence: 50,
      checkpoints: [...state.checkpoints, checkpoint],
      completed: isLast,
    },
    updatedAt: isoNow(),
  };

  if (isLast) {
    nextSession = {
      ...nextSession,
      status: "completed",
      completedAt: isoNow(),
      updatedAt: isoNow(),
    };
  }

  return nextSession;
}

export function readSimulationSession(): SimulationResearchSession {
  const stored =
    readLocalValue<SimulationResearchSession>(SIMULATION_SESSION_KEY);

  if (!stored || stored.version !== SIMULATION_SESSION_VERSION) {
    return createSimulationSession();
  }

  return stored;
}

export function persistSimulationSession(session: SimulationResearchSession) {
  writeLocalValue(SIMULATION_SESSION_KEY, session);
}

export function clearSimulationSession() {
  removeLocalValue(SIMULATION_SESSION_KEY);
}

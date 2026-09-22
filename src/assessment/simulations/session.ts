import {
  readLocalValue,
  removeLocalValue,
  writeLocalValue,
} from "../../lib/storage";
import {
  dynamicAttentionPrototype,
  evidenceStreamPrototype,
  hiddenSystemPrototype,
  simulationPrototypes,
} from "./prototypes";
import { appendTrace } from "./traces";
import type { CognitiveTrace, SimulationMode } from "./types";

export const SIMULATION_SESSION_KEY = "dynamic-simulation-research-session";
export const SIMULATION_SESSION_VERSION = 1;

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
};

export type HiddenSystemState = {
  trialIndex: number;
  draftAnswer: string;
  predictions: HiddenPrediction[];
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

export type SimulationResearchSession = {
  version: 1;
  mode: SimulationMode;
  status: "not_started" | "in_progress" | "completed";
  currentPrototypeIndex: number;
  traces: CognitiveTrace[];
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
  prototypeId: string,
  type: CognitiveTrace["type"],
  timestampMs: number,
  suffix = "",
) {
  return `${prototypeId}:${type}:${timestampMs}${suffix ? `:${suffix}` : ""}`;
}

export function createSimulationSession(
  mode: SimulationMode = "step",
): SimulationResearchSession {
  return {
    version: SIMULATION_SESSION_VERSION,
    mode,
    status: "not_started",
    currentPrototypeIndex: 0,
    traces: [],
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
      predictions: [],
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

export function beginSimulationSession(
  session: SimulationResearchSession,
): SimulationResearchSession {
  if (session.status === "in_progress") return session;
  const now = isoNow();
  return {
    ...session,
    status: "in_progress",
    currentPrototypeIndex: 0,
    startedAt: now,
    completedAt: null,
    updatedAt: now,
  };
}

function advancePrototype(
  session: SimulationResearchSession,
): SimulationResearchSession {
  const nextIndex = session.currentPrototypeIndex + 1;
  const completed = nextIndex >= simulationPrototypes.length;
  const now = isoNow();

  return {
    ...session,
    status: completed ? "completed" : "in_progress",
    currentPrototypeIndex: completed
      ? simulationPrototypes.length - 1
      : nextIndex,
    completedAt: completed ? now : null,
    updatedAt: now,
  };
}

export function toggleAttentionSignal(
  session: SimulationResearchSession,
  signalId: string,
  timestampMs = Date.now(),
): SimulationResearchSession {
  const selected = session.attention.selectedSignalIds;
  const exists = selected.includes(signalId);
  if (!exists && selected.length >= dynamicAttentionPrototype.selectionLimit) {
    return session;
  }

  const nextSelected = exists
    ? selected.filter((id) => id !== signalId)
    : [...selected, signalId];
  const frame = dynamicAttentionPrototype.frames[session.attention.frameIndex];
  const trace: CognitiveTrace = {
    id: traceId(
      dynamicAttentionPrototype.id,
      "signal-selection",
      timestampMs,
      signalId,
    ),
    type: "signal-selection",
    category: "process",
    timestampMs,
    environmentId: dynamicAttentionPrototype.family,
    prototypeId: dynamicAttentionPrototype.id,
    trialId: frame.event.id,
    eventId: frame.event.id,
    payload: {
      signalId,
      selected: !exists,
      selectedSignals: nextSelected,
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
  const current = dynamicAttentionPrototype.frames[session.attention.frameIndex];
  const nextIndex = Math.min(
    session.attention.frameIndex + 1,
    dynamicAttentionPrototype.frames.length - 1,
  );
  let traces = session.traces;

  if (current.event.type === "interruption") {
    traces = appendTrace(traces, {
      id: traceId(
        dynamicAttentionPrototype.id,
        "interruption",
        timestampMs,
        current.event.id,
      ),
      type: "interruption",
      category: "process",
      timestampMs,
      environmentId: dynamicAttentionPrototype.family,
      prototypeId: dynamicAttentionPrototype.id,
      trialId: current.event.id,
      eventId: current.event.id,
      payload: {
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
  if (
    session.attention.selectedSignalIds.length !==
    dynamicAttentionPrototype.selectionLimit
  ) {
    return session;
  }

  const selected = session.attention.selectedSignalIds;
  const correct =
    selected.length === dynamicAttentionPrototype.diagnosticSignalIds.length &&
    dynamicAttentionPrototype.diagnosticSignalIds.every((id) =>
      selected.includes(id),
    );
  let traces = appendTrace(session.traces, {
    id: traceId(dynamicAttentionPrototype.id, "decision", timestampMs),
    type: "decision",
    category: "outcome",
    timestampMs,
    environmentId: dynamicAttentionPrototype.family,
    prototypeId: dynamicAttentionPrototype.id,
    trialId: "final-selection",
    payload: {
      selectedSignals: selected,
      correct,
    },
  });
  traces = appendTrace(traces, {
    id: traceId(
      dynamicAttentionPrototype.id,
      "confidence",
      timestampMs + 1,
    ),
    type: "confidence",
    category: "process",
    timestampMs: timestampMs + 1,
    environmentId: dynamicAttentionPrototype.family,
    prototypeId: dynamicAttentionPrototype.id,
    trialId: "final-selection",
    payload: {
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
  const state = session.hiddenSystem;
  const trial = hiddenSystemPrototype.trials[state.trialIndex];
  if (!trial || state.draftAnswer.trim() === "") return session;

  const numericAnswer = Number(state.draftAnswer);
  const correct = Number.isFinite(numericAnswer) && numericAnswer === trial.expected;
  const prediction: HiddenPrediction = {
    trialId: trial.id,
    answer: state.draftAnswer,
    correct,
    expected: trial.expected,
  };

  let traces = appendTrace(session.traces, {
    id: traceId(
      hiddenSystemPrototype.id,
      "rule-prediction",
      timestampMs,
      trial.id,
    ),
    type: "rule-prediction",
    category: "outcome",
    timestampMs,
    environmentId: hiddenSystemPrototype.family,
    prototypeId: hiddenSystemPrototype.id,
    trialId: trial.id,
    eventId: trial.id,
    payload: {
      input: trial.input,
      answer: state.draftAnswer,
      correct,
      phase: trial.phase,
    },
  });

  let changeDetectedAtTrial = state.changeDetectedAtTrial;
  if (
    state.trialIndex >= hiddenSystemPrototype.changeTrialIndex &&
    trial.phase === "changed-b" &&
    correct &&
    changeDetectedAtTrial === null
  ) {
    changeDetectedAtTrial = state.trialIndex;
    traces = appendTrace(traces, {
      id: traceId(
        hiddenSystemPrototype.id,
        "rule-change-detection",
        timestampMs + 1,
        trial.id,
      ),
      type: "rule-change-detection",
      category: "process",
      timestampMs: timestampMs + 1,
      environmentId: hiddenSystemPrototype.family,
      prototypeId: hiddenSystemPrototype.id,
      trialId: trial.id,
      eventId: trial.id,
      payload: {
        detectedAtTrial: state.trialIndex,
      },
    });
  }

  const isLast =
    state.trialIndex >= hiddenSystemPrototype.trials.length - 1;
  const nextState: HiddenSystemState = {
    ...state,
    trialIndex: isLast ? state.trialIndex : state.trialIndex + 1,
    draftAnswer: "",
    predictions: [...state.predictions, prediction],
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

  if (isLast) {
    nextSession = advancePrototype(nextSession);
  }

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
  const state = session.evidence;
  const evidence = evidenceStreamPrototype.evidence[state.eventIndex];
  if (!evidence || !state.decision) return session;

  const checkpoint: EvidenceCheckpoint = {
    evidenceId: evidence.id,
    decision: state.decision,
    confidence: state.confidence,
  };
  const previous = state.checkpoints.at(-1);
  let traces = appendTrace(session.traces, {
    id: traceId(
      evidenceStreamPrototype.id,
      "evidence-update",
      timestampMs,
      evidence.id,
    ),
    type: "evidence-update",
    category: "process",
    timestampMs,
    environmentId: evidenceStreamPrototype.family,
    prototypeId: evidenceStreamPrototype.id,
    trialId: evidence.id,
    eventId: evidence.event.id,
    payload: {
      decision: state.decision,
      confidence: state.confidence,
      evidenceDirection: evidence.evidentialDirection,
      evidenceWeight: evidence.evidentialWeight,
      previousDecision: previous?.decision ?? null,
      previousConfidence: previous?.confidence ?? null,
    },
  });
  traces = appendTrace(traces, {
    id: traceId(
      evidenceStreamPrototype.id,
      "decision",
      timestampMs + 1,
      evidence.id,
    ),
    type: "decision",
    category: "outcome",
    timestampMs: timestampMs + 1,
    environmentId: evidenceStreamPrototype.family,
    prototypeId: evidenceStreamPrototype.id,
    trialId: evidence.id,
    eventId: evidence.event.id,
    payload: {
      decision: state.decision,
    },
  });
  traces = appendTrace(traces, {
    id: traceId(
      evidenceStreamPrototype.id,
      "confidence",
      timestampMs + 2,
      evidence.id,
    ),
    type: "confidence",
    category: "process",
    timestampMs: timestampMs + 2,
    environmentId: evidenceStreamPrototype.family,
    prototypeId: evidenceStreamPrototype.id,
    trialId: evidence.id,
    eventId: evidence.event.id,
    payload: {
      value: state.confidence,
    },
  });

  const isLast =
    state.eventIndex >= evidenceStreamPrototype.evidence.length - 1;
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

export function persistSimulationSession(
  session: SimulationResearchSession,
) {
  writeLocalValue(SIMULATION_SESSION_KEY, session);
}

export function clearSimulationSession() {
  removeLocalValue(SIMULATION_SESSION_KEY);
}

import {
  readLocalValue,
  removeLocalValue,
  writeLocalValue,
} from "../../lib/storage";
import type {
  ExperimentalDraftAnswer,
  ExperimentalPhaseResponse,
  ExperimentalSession,
  ExperimentalTask,
  ExperimentalTaskResponse,
  ExperimentalTaskState,
} from "./types";

export const EXPERIMENTAL_SESSION_KEY = "experimental-assessment-session";
export const EXPERIMENTAL_SESSION_VERSION = 1;

function now() {
  return new Date().toISOString();
}

export function clampConfidence(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function createExperimentalSession(): ExperimentalSession {
  return {
    version: EXPERIMENTAL_SESSION_VERSION,
    status: "not_started",
    currentTaskIndex: 0,
    currentTaskState: null,
    responses: [],
    startedAt: null,
    completedAt: null,
    updatedAt: now(),
  };
}

export function createTaskState(task: ExperimentalTask): ExperimentalTaskState {
  const enteredAt = now();

  return {
    taskId: task.id,
    phaseIndex: 0,
    draftAnswer: null,
    confidence: 50,
    revisions: 0,
    completedPhases: [],
    phaseStartedAt: enteredAt,
    taskStartedAt: enteredAt,
    phaseHistory: [{ phaseId: task.phases[0].id, enteredAt }],
  };
}

export function beginExperimentalSession(
  session: ExperimentalSession,
  tasks: ExperimentalTask[],
): ExperimentalSession {
  if (session.status === "in_progress" && session.currentTaskState) {
    return session;
  }

  const startedAt = now();

  return {
    ...session,
    status: "in_progress",
    currentTaskIndex: 0,
    currentTaskState: createTaskState(tasks[0]),
    responses: [],
    startedAt,
    completedAt: null,
    updatedAt: startedAt,
  };
}

function answersEqual(
  left: ExperimentalDraftAnswer,
  right: ExperimentalDraftAnswer,
) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function updateExperimentalDraft(
  session: ExperimentalSession,
  answer: ExperimentalDraftAnswer,
): ExperimentalSession {
  const state = session.currentTaskState;

  if (!state) {
    return session;
  }

  const shouldCountRevision =
    state.draftAnswer !== null && !answersEqual(state.draftAnswer, answer);

  return {
    ...session,
    currentTaskState: {
      ...state,
      draftAnswer: answer,
      revisions: state.revisions + (shouldCountRevision ? 1 : 0),
    },
    updatedAt: now(),
  };
}

export function updateExperimentalConfidence(
  session: ExperimentalSession,
  confidence: number,
): ExperimentalSession {
  if (!session.currentTaskState) {
    return session;
  }

  return {
    ...session,
    currentTaskState: {
      ...session.currentTaskState,
      confidence: clampConfidence(confidence),
    },
    updatedAt: now(),
  };
}

export function toggleExperimentalSelection(
  selected: string[],
  id: string,
  limit: number,
) {
  if (selected.includes(id)) {
    return selected.filter((item) => item !== id);
  }

  if (selected.length >= limit) {
    return selected;
  }

  return [...selected, id];
}

export function submitExperimentalPhase(
  session: ExperimentalSession,
  tasks: ExperimentalTask[],
): ExperimentalSession {
  const task = tasks[session.currentTaskIndex];
  const state = session.currentTaskState;

  if (!task || !state) {
    return session;
  }

  const phase = task.phases[state.phaseIndex];
  const answer = state.draftAnswer;

  if (
    answer === null ||
    (Array.isArray(answer) && answer.length === 0)
  ) {
    return session;
  }

  const completedAt = now();
  const phaseResponse: ExperimentalPhaseResponse = {
    phaseId: phase.id,
    answer,
    confidence: phase.confidenceRequired ? state.confidence : undefined,
    revisions: state.revisions,
    startedAt: state.phaseStartedAt,
    completedAt,
  };

  const completedPhases = [...state.completedPhases, phaseResponse];
  const hasNextPhase = state.phaseIndex < task.phases.length - 1;

  if (hasNextPhase) {
    const nextPhaseIndex = state.phaseIndex + 1;
    const nextPhase = task.phases[nextPhaseIndex];

    return {
      ...session,
      currentTaskState: {
        ...state,
        phaseIndex: nextPhaseIndex,
        draftAnswer: null,
        confidence: 50,
        revisions: 0,
        completedPhases,
        phaseStartedAt: completedAt,
        phaseHistory: [
          ...state.phaseHistory,
          { phaseId: nextPhase.id, enteredAt: completedAt },
        ],
      },
      updatedAt: completedAt,
    };
  }

  const first = completedPhases[0];
  const last = completedPhases[completedPhases.length - 1];
  const taskResponse: ExperimentalTaskResponse = {
    taskId: task.id,
    phases: completedPhases,
    startedAt: state.taskStartedAt,
    completedAt,
    phaseHistory: state.phaseHistory,
    beliefChanged:
      typeof first?.answer === "string" && typeof last?.answer === "string"
        ? first.answer !== last.answer
        : undefined,
    confidenceDelta:
      first?.confidence !== undefined && last?.confidence !== undefined
        ? last.confidence - first.confidence
        : undefined,
  };

  const responses = [
    ...session.responses.filter((item) => item.taskId !== task.id),
    taskResponse,
  ];
  const isLastTask = session.currentTaskIndex >= tasks.length - 1;

  if (isLastTask) {
    return {
      ...session,
      status: "completed",
      responses,
      currentTaskState: null,
      completedAt,
      updatedAt: completedAt,
    };
  }

  const nextTaskIndex = session.currentTaskIndex + 1;

  return {
    ...session,
    currentTaskIndex: nextTaskIndex,
    currentTaskState: createTaskState(tasks[nextTaskIndex]),
    responses,
    updatedAt: completedAt,
  };
}

export function readExperimentalSession(): ExperimentalSession {
  const stored = readLocalValue<ExperimentalSession>(EXPERIMENTAL_SESSION_KEY);

  if (!stored || stored.version !== EXPERIMENTAL_SESSION_VERSION) {
    return createExperimentalSession();
  }

  return stored;
}

export function persistExperimentalSession(session: ExperimentalSession) {
  writeLocalValue(EXPERIMENTAL_SESSION_KEY, session);
}

export function clearExperimentalSession() {
  removeLocalValue(EXPERIMENTAL_SESSION_KEY);
}

import type { AssessmentSession } from "./types";

export const ASSESSMENT_SESSION_KEY = "assessment-session";
export const ASSESSMENT_SESSION_VERSION = 2;

export function createInitialSession(): AssessmentSession {
  return {
    version: ASSESSMENT_SESSION_VERSION,
    status: "not_started",
    currentTaskIndex: 0,
    confidence: 50,
    draftAnswer: null,
    adaptivePhase: "phase-a",
    adaptivePhaseAAnswer: null,
    responses: [],
    startedAt: null,
    taskStartedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

export function startSession(
  previousSession: AssessmentSession,
): AssessmentSession {
  const now = new Date().toISOString();

  return {
    ...previousSession,
    status: "in_progress",
    startedAt: previousSession.startedAt ?? now,
    taskStartedAt: previousSession.taskStartedAt ?? now,
    updatedAt: now,
  };
}

export function updateSession(
  session: AssessmentSession,
  updates: Partial<AssessmentSession>,
): AssessmentSession {
  return {
    ...session,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

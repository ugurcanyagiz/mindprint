import type { AssessmentSession } from "./types";

export const ASSESSMENT_SESSION_KEY = "assessment-session";

export function createInitialSession(): AssessmentSession {
  return {
    status: "not_started",
    currentTaskIndex: 0,
    confidence: 50,
    startedAt: null,
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

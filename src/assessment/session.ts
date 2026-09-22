import type { Locale } from "../i18n/config";
import type { AssessmentSession } from "./types";

export const ASSESSMENT_SESSION_KEY = "assessment-session";
export const ASSESSMENT_SESSION_VERSION = 4;

export function createInitialSession(): AssessmentSession {
  return {
    version: ASSESSMENT_SESSION_VERSION,
    status: "not_started",
    assessmentLanguage: null,
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
  locale: Locale,
): AssessmentSession {
  const now = new Date().toISOString();

  return {
    ...previousSession,
    status: "in_progress",
    assessmentLanguage: previousSession.assessmentLanguage ?? locale,
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

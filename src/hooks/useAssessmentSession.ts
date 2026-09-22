import { useEffect, useState } from "react";

import type { Locale } from "../i18n/config";
import {
  ASSESSMENT_SESSION_KEY,
  ASSESSMENT_SESSION_VERSION,
  createInitialSession,
  startSession,
  updateSession,
} from "../assessment/session";
import type {
  AssessmentDraftAnswer,
  AssessmentResponse,
  AssessmentSession,
  Confidence,
} from "../assessment/types";
import {
  readLocalValue,
  removeLocalValue,
  writeLocalValue,
} from "../lib/storage";

function readStoredSession(): AssessmentSession {
  const stored = readLocalValue<AssessmentSession>(ASSESSMENT_SESSION_KEY);

  if (!stored || stored.version !== ASSESSMENT_SESSION_VERSION) {
    return createInitialSession();
  }

  return stored;
}

export function useAssessmentSession(totalTasks: number) {
  const [session, setSession] = useState<AssessmentSession>(readStoredSession);

  useEffect(() => {
    writeLocalValue(ASSESSMENT_SESSION_KEY, session);
  }, [session]);

  const begin = (locale: Locale) => {
    setSession((current) => startSession(current, locale));
  };

  const setConfidence = (confidence: Confidence) => {
    setSession((current) => updateSession(current, { confidence }));
  };

  const setDraftAnswer = (draftAnswer: AssessmentDraftAnswer) => {
    setSession((current) => updateSession(current, { draftAnswer }));
  };

  const saveAdaptivePhaseA = (answer: string) => {
    setSession((current) =>
      updateSession(current, {
        adaptivePhaseAAnswer: answer,
        adaptivePhase: "transition",
        draftAnswer: null,
      }),
    );
  };

  const moveToAdaptivePhaseB = () => {
    setSession((current) =>
      updateSession(current, {
        adaptivePhase: "phase-b",
        draftAnswer: null,
      }),
    );
  };

  const submitResponse = (
    response: Omit<AssessmentResponse, "startedAt" | "completedAt">,
  ) => {
    setSession((current) => {
      const now = new Date().toISOString();
      const nextResponses = [
        ...current.responses.filter((item) => item.taskId !== response.taskId),
        {
          ...response,
          startedAt: current.taskStartedAt ?? now,
          completedAt: now,
        },
      ];

      const isLastTask = current.currentTaskIndex >= totalTasks - 1;

      return updateSession(current, {
        status: isLastTask ? "completed" : "in_progress",
        currentTaskIndex: isLastTask
          ? current.currentTaskIndex
          : current.currentTaskIndex + 1,
        confidence: 50,
        draftAnswer: null,
        adaptivePhase: "phase-a",
        adaptivePhaseAAnswer: null,
        responses: nextResponses,
        taskStartedAt: isLastTask ? null : now,
      });
    });
  };

  const reset = () => {
    const nextSession = createInitialSession();
    removeLocalValue(ASSESSMENT_SESSION_KEY);
    setSession(nextSession);
  };

  return {
    session,
    begin,
    setConfidence,
    setDraftAnswer,
    saveAdaptivePhaseA,
    moveToAdaptivePhaseB,
    submitResponse,
    reset,
  };
}

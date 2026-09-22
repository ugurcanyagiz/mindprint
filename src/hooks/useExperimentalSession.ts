import { useEffect, useState } from "react";

import {
  beginExperimentalSession,
  clearExperimentalSession,
  createExperimentalSession,
  persistExperimentalSession,
  readExperimentalSession,
  submitExperimentalPhase,
  updateExperimentalConfidence,
  updateExperimentalDraft,
} from "../assessment/experimental/session";
import { experimentalTasks } from "../assessment/experimental/tasks";
import type { ExperimentalDraftAnswer } from "../assessment/experimental/types";

export function useExperimentalSession() {
  const [session, setSession] = useState(readExperimentalSession);

  useEffect(() => {
    persistExperimentalSession(session);
  }, [session]);

  const begin = () => {
    setSession((current) =>
      beginExperimentalSession(current, experimentalTasks),
    );
  };

  const setDraftAnswer = (answer: ExperimentalDraftAnswer) => {
    setSession((current) => updateExperimentalDraft(current, answer));
  };

  const setConfidence = (confidence: number) => {
    setSession((current) =>
      updateExperimentalConfidence(current, confidence),
    );
  };

  const submitPhase = () => {
    setSession((current) =>
      submitExperimentalPhase(current, experimentalTasks),
    );
  };

  const reset = () => {
    clearExperimentalSession();
    setSession(createExperimentalSession());
  };

  return {
    session,
    begin,
    setDraftAnswer,
    setConfidence,
    submitPhase,
    reset,
  };
}

import { useEffect, useState } from "react";

import {
  ASSESSMENT_SESSION_KEY,
  createInitialSession,
  startSession,
  updateSession,
} from "../assessment/session";
import type { AssessmentSession, Confidence } from "../assessment/types";
import {
  readLocalValue,
  removeLocalValue,
  writeLocalValue,
} from "../lib/storage";

function readStoredSession(): AssessmentSession {
  return (
    readLocalValue<AssessmentSession>(ASSESSMENT_SESSION_KEY) ??
    createInitialSession()
  );
}

export function useAssessmentSession() {
  const [session, setSession] = useState<AssessmentSession>(readStoredSession);

  useEffect(() => {
    writeLocalValue(ASSESSMENT_SESSION_KEY, session);
  }, [session]);

  const begin = () => {
    setSession((current) => startSession(current));
  };

  const setConfidence = (confidence: Confidence) => {
    setSession((current) => updateSession(current, { confidence }));
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
    reset,
  };
}

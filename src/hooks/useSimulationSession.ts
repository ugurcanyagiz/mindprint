import { useEffect, useState } from "react";

import {
  advanceAttentionFrame,
  beginSimulationSession,
  clearSimulationSession,
  completeAttentionPrototype,
  createSimulationSession,
  persistSimulationSession,
  readSimulationSession,
  setAttentionConfidence,
  setEvidenceConfidence,
  setEvidenceDecision,
  setHiddenConfidence,
  setHiddenDraft,
  submitEvidenceCheckpoint,
  submitHiddenPrediction,
  toggleAttentionSignal,
} from "../assessment/simulations/session";

export function useSimulationSession() {
  const [session, setSession] = useState(readSimulationSession);

  useEffect(() => {
    persistSimulationSession(session);
  }, [session]);

  return {
    session,
    begin: () => setSession((current) => beginSimulationSession(current)),
    reset: () => {
      clearSimulationSession();
      setSession(createSimulationSession());
    },
    toggleAttentionSignal: (signalId: string) =>
      setSession((current) => toggleAttentionSignal(current, signalId)),
    advanceAttention: () =>
      setSession((current) => advanceAttentionFrame(current)),
    setAttentionConfidence: (value: number) =>
      setSession((current) => setAttentionConfidence(current, value)),
    completeAttention: () =>
      setSession((current) => completeAttentionPrototype(current)),
    setHiddenDraft: (value: string) =>
      setSession((current) => setHiddenDraft(current, value)),
    setHiddenConfidence: (value: number) =>
      setSession((current) => setHiddenConfidence(current, value)),
    submitHidden: () =>
      setSession((current) => submitHiddenPrediction(current)),
    setEvidenceDecision: (value: string) =>
      setSession((current) => setEvidenceDecision(current, value)),
    setEvidenceConfidence: (value: number) =>
      setSession((current) => setEvidenceConfidence(current, value)),
    submitEvidence: () =>
      setSession((current) => submitEvidenceCheckpoint(current)),
  };
}

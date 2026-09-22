import { useEffect, useState } from "react";

import {
  advanceAttentionFrame,
  beginSimulationSession,
  clearSimulationSession,
  completeAttentionPrototype,
  createSimulationSession,
  persistSimulationSession,
  readSimulationSession,
  recordInputMode,
  recordVisibilityEvent,
  setAttentionConfidence,
  setEvidenceConfidence,
  setEvidenceDecision,
  setHiddenConfidence,
  setHiddenDraft,
  setHiddenHypothesisDraft,
  submitEvidenceCheckpoint,
  submitHiddenPrediction,
  toggleAttentionSignal,
  updateSimulationDeviceContext,
} from "../assessment/simulations/session";
import { captureDeviceContext } from "../assessment/simulations/validation/instrumentation";

export function useSimulationSession() {
  const [session, setSession] = useState(readSimulationSession);

  useEffect(() => {
    persistSimulationSession(session);
  }, [session]);

  useEffect(() => {
    setSession((current) =>
      updateSimulationDeviceContext(current, captureDeviceContext()),
    );

    const handleVisibility = () => {
      setSession((current) =>
        recordVisibilityEvent(current, document.hidden),
      );
    };
    const handlePointer = (event: PointerEvent) => {
      const mode = event.pointerType === "touch" ? "touch" : "mouse";
      setSession((current) => recordInputMode(current, mode));
    };
    const handleKeyboard = () => {
      setSession((current) => recordInputMode(current, "keyboard"));
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointerdown", handlePointer, { passive: true });
    window.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

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
    setHiddenHypothesis: (value: string) =>
      setSession((current) => setHiddenHypothesisDraft(current, value)),
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

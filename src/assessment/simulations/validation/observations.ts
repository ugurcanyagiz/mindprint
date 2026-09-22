import {
  attentionForm,
  evidenceForm,
  hiddenSystemForm,
  type SimulationResearchSession,
} from "../session";
import type { CognitiveTrace } from "../types";
import type {
  CognitiveObservation,
  ObservationType,
} from "./types";

function observationId(
  sessionId: string,
  formId: string,
  type: ObservationType,
) {
  return `${sessionId}:${formId}:observation:${type}`;
}

function tracesForForm(
  session: SimulationResearchSession,
  formId: string,
) {
  return session.traces.filter((trace) => trace.payload.formId === formId);
}

function makeObservation(
  session: SimulationResearchSession,
  formId: string,
  environmentId: CognitiveObservation["environmentId"],
  constructHypotheses: CognitiveObservation["constructHypotheses"],
  observationType: ObservationType,
  value: CognitiveObservation["value"],
  sourceTraces: CognitiveTrace[],
): CognitiveObservation {
  return {
    id: observationId(
      session.researchSessionId,
      formId,
      observationType,
    ),
    participantSessionId: session.researchSessionId,
    environmentId,
    formId,
    constructHypotheses,
    observationType,
    value,
    sourceTraceIds: sourceTraces.map((trace) => trace.id).sort(),
    interpretationStatus: "hypothesized",
    qualityFlags: [],
  };
}

function mean(values: number[]) {
  return values.length === 0
    ? null
    : values.reduce((sum, value) => sum + value, 0) / values.length;
}

const decisionRank: Record<string, number> = {
  reject: 0,
  "low-support": 1,
  uncertain: 2,
  "tentative-support": 3,
  "strong-support": 4,
};

export function deriveObservations(
  session: SimulationResearchSession,
): CognitiveObservation[] {
  const observations: CognitiveObservation[] = [];

  const attnForm = attentionForm(session);
  if (attnForm.prototype.kind === "attention") {
    const traces = tracesForForm(session, attnForm.id);
    const decision = traces.find((trace) => trace.type === "decision");
    const confidence = traces.find((trace) => trace.type === "confidence");
    const selectionTraces = traces.filter(
      (trace) => trace.type === "signal-selection",
    );
    const interruption = traces.find(
      (trace) => trace.type === "interruption",
    );

    if (decision && Array.isArray(decision.payload.selectedSignals)) {
      const selected = decision.payload.selectedSignals;
      const correctCount = attnForm.prototype.diagnosticSignalIds.filter(
        (id) => selected.includes(id),
      ).length;
      observations.push(
        makeObservation(
          session,
          attnForm.id,
          "dynamic-attention",
          ["attentionControl"],
          "diagnostic-selection-quality",
          correctCount / attnForm.prototype.diagnosticSignalIds.length,
          [decision],
        ),
      );
    }

    if (attnForm.manipulation.kind === "attention") {
      const distractorSelections = selectionTraces.filter(
        (trace) =>
          trace.payload.signalId ===
            attnForm.manipulation.salientDistractorId &&
          trace.payload.selected === true,
      );
      observations.push(
        makeObservation(
          session,
          attnForm.id,
          "dynamic-attention",
          ["attentionControl"],
          "distractor-capture",
          distractorSelections.length > 0,
          distractorSelections,
        ),
      );
    }

    if (
      interruption &&
      Array.isArray(interruption.payload.selectedSignals)
    ) {
      const selected = interruption.payload.selectedSignals;
      const retained =
        attnForm.prototype.diagnosticSignalIds.filter((id) =>
          selected.includes(id),
        ).length / attnForm.prototype.diagnosticSignalIds.length;
      observations.push(
        makeObservation(
          session,
          attnForm.id,
          "dynamic-attention",
          ["attentionControl"],
          "post-interruption-priority-retention",
          retained,
          [interruption],
        ),
      );
    }

    if (confidence && typeof confidence.payload.value === "number") {
      observations.push(
        makeObservation(
          session,
          attnForm.id,
          "dynamic-attention",
          ["metacognitiveRegulation"],
          "final-confidence",
          confidence.payload.value,
          [confidence],
        ),
      );
    }
  }

  const hiddenForm = hiddenSystemForm(session);
  if (hiddenForm.prototype.kind === "hidden-system") {
    const traces = tracesForForm(session, hiddenForm.id).filter(
      (trace) => trace.type === "rule-prediction",
    );

    const phaseAccuracy = (
      phase: "stable-a" | "changed-b" | "transfer",
    ) => {
      const relevant = traces.filter(
        (trace) => trace.payload.phase === phase,
      );
      return mean(
        relevant.map((trace) => (trace.payload.correct === true ? 1 : 0)),
      );
    };

    const stable = traces.filter(
      (trace) => trace.payload.phase === "stable-a",
    );
    const changed = traces.filter(
      (trace) => trace.payload.phase === "changed-b",
    );
    const transfer = traces.filter(
      (trace) => trace.payload.phase === "transfer",
    );
    const anomalyIndex = hiddenForm.prototype.trials.findIndex(
      (trial) => trial.phase === "anomaly",
    );
    const nextStable = hiddenForm.prototype.trials
      .slice(anomalyIndex + 1)
      .find((trial) => trial.phase === "stable-a");
    const nextStableTrace = nextStable
      ? traces.find((trace) => trace.trialId === nextStable.id)
      : undefined;

    if (stable.length > 0) {
      observations.push(
        makeObservation(
          session,
          hiddenForm.id,
          "hidden-system-learning",
          ["learningDynamics", "modelFormation"],
          "pre-change-accuracy",
          phaseAccuracy("stable-a"),
          stable,
        ),
      );
    }

    if (nextStableTrace) {
      observations.push(
        makeObservation(
          session,
          hiddenForm.id,
          "hidden-system-learning",
          ["learningDynamics"],
          "anomaly-overreaction",
          nextStableTrace.payload.correct !== true,
          [nextStableTrace],
        ),
      );
    }

    if (changed.length > 0) {
      observations.push(
        makeObservation(
          session,
          hiddenForm.id,
          "hidden-system-learning",
          ["learningDynamics"],
          "post-change-accuracy",
          phaseAccuracy("changed-b"),
          changed,
        ),
      );
    }

    if (transfer.length > 0) {
      observations.push(
        makeObservation(
          session,
          hiddenForm.id,
          "hidden-system-learning",
          ["knowledgeTransfer", "learningDynamics"],
          "transfer-success",
          phaseAccuracy("transfer"),
          transfer,
        ),
      );
    }

    const changeTrace = session.traces.find(
      (trace) =>
        trace.payload.formId === hiddenForm.id &&
        trace.type === "rule-change-detection",
    );
    if (
      changeTrace &&
      typeof changeTrace.payload.detectedAtTrial === "number"
    ) {
      observations.push(
        makeObservation(
          session,
          hiddenForm.id,
          "hidden-system-learning",
          ["learningDynamics"],
          "change-detection-trial",
          changeTrace.payload.detectedAtTrial,
          [changeTrace],
        ),
      );
    }
  }

  const evForm = evidenceForm(session);
  if (evForm.prototype.kind === "evidence-stream") {
    const updates = tracesForForm(session, evForm.id).filter(
      (trace) => trace.type === "evidence-update",
    );
    if (updates.length > 0) {
      let changes = 0;
      for (const trace of updates) {
        if (
          typeof trace.payload.decision === "string" &&
          typeof trace.payload.previousDecision === "string" &&
          trace.payload.decision !== trace.payload.previousDecision
        ) {
          changes += 1;
        }
      }
      observations.push(
        makeObservation(
          session,
          evForm.id,
          "dynamic-evidence-stream",
          ["epistemicJudgment", "metacognitiveRegulation"],
          "belief-update-count",
          changes,
          updates,
        ),
      );

      const strongContradiction = updates.find(
        (trace) =>
          trace.payload.evidenceDirection === "contradicts" &&
          trace.payload.evidenceWeight === "strong",
      );
      if (
        strongContradiction &&
        typeof strongContradiction.payload.decision === "string" &&
        typeof strongContradiction.payload.previousDecision === "string"
      ) {
        const previous =
          decisionRank[strongContradiction.payload.previousDecision];
        const current = decisionRank[strongContradiction.payload.decision];
        observations.push(
          makeObservation(
            session,
            evForm.id,
            "dynamic-evidence-stream",
            ["epistemicJudgment"],
            "strong-contradiction-sensitivity",
            Number.isFinite(previous) && Number.isFinite(current)
              ? current < previous
              : null,
            [strongContradiction],
          ),
        );
        observations.push(
          makeObservation(
            session,
            evForm.id,
            "dynamic-evidence-stream",
            ["metacognitiveRegulation"],
            "confidence-after-strong-evidence",
            typeof strongContradiction.payload.confidence === "number"
              ? strongContradiction.payload.confidence
              : null,
            [strongContradiction],
          ),
        );
      }

      const final = updates.at(-1);
      if (final && typeof final.payload.decision === "string") {
        observations.push(
          makeObservation(
            session,
            evForm.id,
            "dynamic-evidence-stream",
            ["epistemicJudgment"],
            "final-judgment",
            final.payload.decision,
            [final],
          ),
        );
      }
    }
  }

  return observations.sort((a, b) => a.id.localeCompare(b.id));
}

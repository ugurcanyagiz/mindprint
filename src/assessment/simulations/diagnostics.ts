import {
  attentionForm,
  evidenceForm,
  hiddenSystemForm,
  type SimulationResearchSession,
} from "./session";
import type { SimulationDiagnostic, TraceSummary } from "./types";

function ratio(numerator: number, denominator: number) {
  return denominator > 0 ? numerator / denominator : null;
}

export function summarizeSimulationTraces(
  session: SimulationResearchSession,
): TraceSummary {
  const outcomeTraces = session.traces.filter(
    (trace) => trace.category === "outcome",
  );
  const decisions = outcomeTraces.filter((trace) => trace.type === "decision");
  const correctDecisions = decisions.filter(
    (trace) => trace.payload.correct === true,
  ).length;
  const confidenceTraces = session.traces.filter(
    (trace) => trace.type === "confidence",
  );
  const confidenceValues = confidenceTraces.flatMap((trace) =>
    typeof trace.payload.value === "number" ? [trace.payload.value] : [],
  );
  const highConfidenceErrors = confidenceTraces.filter(
    (trace) =>
      typeof trace.payload.value === "number" &&
      trace.payload.value >= 80 &&
      trace.payload.correct === false,
  ).length;

  const hiddenId = hiddenSystemForm(session).id;
  const hiddenPredictions = session.traces.filter(
    (trace) =>
      trace.payload.formId === hiddenId && trace.type === "rule-prediction",
  );
  const postChange = hiddenPredictions.filter(
    (trace) => trace.payload.phase === "changed-b",
  );
  const postChangeErrors = postChange.filter(
    (trace) => trace.payload.correct === false,
  ).length;

  const attn = attentionForm(session);
  const selected = session.attention.selectedSignalIds;
  const diagnosticIds =
    attn.prototype.kind === "attention"
      ? attn.prototype.diagnosticSignalIds
      : [];
  const correctSelections = diagnosticIds.filter((id) =>
    selected.includes(id),
  ).length;

  return {
    correctOutcomeRate: ratio(correctDecisions, decisions.length),
    selectionQuality: ratio(correctSelections, diagnosticIds.length),
    meanConfidence:
      confidenceValues.length > 0
        ? confidenceValues.reduce((sum, value) => sum + value, 0) /
          confidenceValues.length /
          100
        : null,
    highConfidenceErrorRate: ratio(
      highConfidenceErrors,
      confidenceTraces.length,
    ),
    ruleUpdateErrorRate: ratio(postChangeErrors, postChange.length),
    unnecessaryInformationRate: null,
    postInterruptionRecovery: session.attention.completed ? 1 : null,
  };
}

export function buildPrototypeDiagnostics(
  session: SimulationResearchSession,
): SimulationDiagnostic[] {
  const attn = attentionForm(session);
  const hidden = hiddenSystemForm(session);
  const evidence = evidenceForm(session);

  return [attn, hidden, evidence].map((form) => {
    const relevant = session.traces.filter(
      (trace) => trace.payload.formId === form.id,
    );
    return {
      prototypeId: form.prototype.id,
      traceSummary: {
        formId: form.id,
        traceCount: relevant.length,
      },
      outcomeSignals: {
        completed:
          form.environmentId === "dynamic-attention"
            ? session.attention.completed
            : form.environmentId === "hidden-system-learning"
              ? session.hiddenSystem.completed
              : session.evidence.completed,
      },
      processSignals: {
        formLabel: form.formLabel,
      },
    };
  });
}

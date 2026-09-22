import {
  dynamicAttentionPrototype,
  evidenceStreamPrototype,
  hiddenSystemPrototype,
} from "./prototypes";
import type { SimulationResearchSession } from "./session";
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
  const decisions = outcomeTraces.filter(
    (trace) => trace.type === "decision",
  );
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
  const hiddenPredictions = session.traces.filter(
    (trace) =>
      trace.prototypeId === hiddenSystemPrototype.id &&
      trace.type === "rule-prediction",
  );
  const postChange = hiddenPredictions.filter(
    (trace) => trace.payload.phase === "changed-b",
  );
  const postChangeErrors = postChange.filter(
    (trace) => trace.payload.correct === false,
  ).length;

  const selected = session.attention.selectedSignalIds;
  const correctSelections =
    dynamicAttentionPrototype.diagnosticSignalIds.filter((id) =>
      selected.includes(id),
    ).length;

  return {
    correctOutcomeRate: ratio(correctDecisions, decisions.length),
    selectionQuality: ratio(
      correctSelections,
      dynamicAttentionPrototype.diagnosticSignalIds.length,
    ),
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
  const attentionCorrect =
    dynamicAttentionPrototype.diagnosticSignalIds.every((id) =>
      session.attention.selectedSignalIds.includes(id),
    ) &&
    session.attention.selectedSignalIds.length ===
      dynamicAttentionPrototype.diagnosticSignalIds.length;

  const hiddenCorrect = session.hiddenSystem.predictions.filter(
    (prediction) => prediction.correct,
  ).length;
  const evidenceChanges = session.evidence.checkpoints.filter(
    (checkpoint, index, all) =>
      index > 0 && checkpoint.decision !== all[index - 1].decision,
  ).length;

  return [
    {
      prototypeId: dynamicAttentionPrototype.id,
      traceSummary: {
        traceCount: session.traces.filter(
          (trace) => trace.prototypeId === dynamicAttentionPrototype.id,
        ).length,
      },
      outcomeSignals: {
        diagnosticSelectionCorrect: session.attention.completed
          ? attentionCorrect
          : null,
      },
      processSignals: {
        selectionChanges: session.attention.selectionSequence.length,
        confidence: session.attention.completed
          ? session.attention.confidence
          : null,
      },
    },
    {
      prototypeId: hiddenSystemPrototype.id,
      traceSummary: {
        traceCount: session.traces.filter(
          (trace) => trace.prototypeId === hiddenSystemPrototype.id,
        ).length,
      },
      outcomeSignals: {
        correctPredictions: hiddenCorrect,
        totalPredictions: session.hiddenSystem.predictions.length,
      },
      processSignals: {
        changeDetectedAtTrial: session.hiddenSystem.changeDetectedAtTrial,
      },
    },
    {
      prototypeId: evidenceStreamPrototype.id,
      traceSummary: {
        traceCount: session.traces.filter(
          (trace) => trace.prototypeId === evidenceStreamPrototype.id,
        ).length,
      },
      outcomeSignals: {
        finalJudgment:
          session.evidence.checkpoints.at(-1)?.decision ?? null,
      },
      processSignals: {
        judgmentChanges: evidenceChanges,
        checkpointCount: session.evidence.checkpoints.length,
      },
    },
  ];
}

import type {
  CognitiveTrace,
  EnvironmentDifficulty,
  SimulationDiagnostic,
  SimulationPrototype,
  TraceSummary,
} from "./types";
import {
  applyDifficultyAdjustments,
  chooseDifficultyAdjustments,
} from "./adaptive";

export function validateDifficulty(
  difficulty: EnvironmentDifficulty,
): string[] {
  return Object.entries(difficulty).flatMap(([key, value]) =>
    Number.isFinite(value) && value >= 0 && value <= 1
      ? []
      : [`${key} must be between 0 and 1`],
  );
}

export function nextDifficulty(
  current: EnvironmentDifficulty,
  summary: TraceSummary,
): EnvironmentDifficulty {
  return applyDifficultyAdjustments(
    current,
    chooseDifficultyAdjustments(summary),
  );
}

export function createInternalDiagnostic(
  prototype: SimulationPrototype,
  traces: CognitiveTrace[],
): SimulationDiagnostic {
  const relevant = traces.filter(
    (trace) => trace.prototypeId === prototype.id,
  );
  const outcomeCount = relevant.filter(
    (trace) => trace.category === "outcome",
  ).length;
  const processCount = relevant.filter(
    (trace) => trace.category === "process",
  ).length;

  return {
    prototypeId: prototype.id,
    traceSummary: {
      traceCount: relevant.length,
      outcomeTraceCount: outcomeCount,
      processTraceCount: processCount,
    },
    outcomeSignals: {
      recorded: outcomeCount > 0,
    },
    processSignals: {
      recorded: processCount > 0,
    },
  };
}

export const simulationEngineGuardrails = {
  producesIntelligenceScore: false,
  producesPercentile: false,
  producesIqEquivalent: false,
  timingInterpretation:
    "Duration is contextual process data. Faster responding is not interpreted as greater intelligence.",
} as const;

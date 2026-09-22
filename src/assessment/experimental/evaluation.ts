import type {
  ExperimentalDiagnostic,
  ExperimentalPhase,
  ExperimentalPhaseResponse,
  ExperimentalTask,
  ExperimentalTaskResponse,
} from "./types";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function arraysEqualAsSets(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    new Set(left).size === left.length &&
    new Set(right).size === right.length &&
    left.every((item) => right.includes(item))
  );
}

export function scoreExperimentalPhase(
  phase: ExperimentalPhase,
  response: ExperimentalPhaseResponse | undefined,
) {
  if (!response) {
    return 0;
  }

  if (Array.isArray(phase.answerKey)) {
    if (!Array.isArray(response.answer)) {
      return 0;
    }

    if (arraysEqualAsSets(response.answer, phase.answerKey)) {
      return 1;
    }

    const selected = new Set(response.answer);
    const correct = phase.answerKey.filter((id) => selected.has(id)).length;
    const incorrect = response.answer.filter(
      (id) => !phase.answerKey.includes(id),
    ).length;

    return clamp01((correct - incorrect) / phase.answerKey.length);
  }

  return typeof response.answer === "string" &&
    response.answer.trim() === phase.answerKey
    ? 1
    : 0;
}

export function experimentalCalibrationQuality(
  objectiveQuality: number,
  confidence: number | undefined,
) {
  if (confidence === undefined) {
    return null;
  }

  return clamp01(
    1 - Math.abs(clamp01(confidence / 100) - clamp01(objectiveQuality)),
  );
}

function mean(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function evaluateExperimentalTask(
  task: ExperimentalTask,
  response: ExperimentalTaskResponse | undefined,
): ExperimentalDiagnostic {
  const phaseScores = task.phases.map((phase, index) =>
    scoreExperimentalPhase(phase, response?.phases[index]),
  );
  const objectiveQuality = clamp01(mean(phaseScores));

  const calibrationValues = task.phases.flatMap((phase, index) => {
    if (!phase.confidenceRequired) {
      return [];
    }

    const value = experimentalCalibrationQuality(
      phaseScores[index],
      response?.phases[index]?.confidence,
    );

    return value === null ? [] : [value];
  });

  const selectionScores = task.phases.flatMap((phase, index) =>
    phase.response.kind === "multi-select" ? [phaseScores[index]] : [],
  );

  const revisionQuality =
    task.diagnosticMode === "belief-revision" ||
    task.diagnosticMode === "adaptation"
      ? clamp01(phaseScores.at(-1) ?? 0)
      : null;

  return {
    taskId: task.id,
    objectiveQuality,
    calibrationQuality:
      calibrationValues.length > 0
        ? clamp01(mean(calibrationValues))
        : null,
    revisionQuality,
    evidenceSelectionQuality:
      selectionScores.length > 0
        ? clamp01(mean(selectionScores))
        : null,
  };
}

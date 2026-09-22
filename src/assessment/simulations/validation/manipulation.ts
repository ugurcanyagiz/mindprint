import { validateTimeline } from "../timeline";
import type { SimulationForm } from "./types";

export function validateSimulationForm(
  form: SimulationForm,
): { formId: string; valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (form.prototype.family !== form.environmentId) {
    errors.push("Prototype family does not match form environment.");
  }

  if (form.manipulation.kind === "attention" && form.prototype.kind === "attention") {
    const prototype = form.prototype;
    const signalIds = new Set(prototype.signals.map((signal) => signal.id));
    const manipulation = form.manipulation;

    if (prototype.signals.length !== manipulation.relevantSignalCount + manipulation.irrelevantSignalCount) {
      errors.push("Signal count does not match manipulation metadata.");
    }
    if (prototype.diagnosticSignalIds.length !== manipulation.relevantSignalCount) {
      errors.push("Diagnostic signal count does not match manipulation metadata.");
    }
    if (!signalIds.has(manipulation.salientDistractorId)) {
      errors.push("Salient distractor is missing from the signal set.");
    }
    if (prototype.diagnosticSignalIds.includes(manipulation.salientDistractorId)) {
      errors.push("Salient distractor cannot also be diagnostic.");
    }

    const interruptionFrames = prototype.frames.filter(
      (frame) => frame.event.type === "interruption",
    );
    if (manipulation.interruptionPresent && interruptionFrames.length !== 1) {
      errors.push("Attention form must contain exactly one interruption.");
    }

    const peak = Math.max(
      ...prototype.frames.map(
        (frame) => frame.values[manipulation.salientDistractorId] ?? 0,
      ),
    ) / 100;
    if (Math.abs(peak - manipulation.distractorPeakMagnitude) > 0.03) {
      errors.push("Distractor peak does not match manipulation metadata.");
    }

    errors.push(...validateTimeline(prototype.frames.map((frame) => frame.event)));
  } else if (
    form.manipulation.kind === "hidden-system" &&
    form.prototype.kind === "hidden-system"
  ) {
    const prototype = form.prototype;
    const manipulation = form.manipulation;
    const anomalyIds = prototype.trials
      .filter((trial) => trial.phase === "anomaly")
      .map((trial) => trial.id);
    const firstChange = prototype.trials.findIndex(
      (trial) => trial.phase === "changed-b",
    );

    if (anomalyIds.length !== manipulation.anomalyTrials) {
      errors.push("Anomaly trial count does not match manipulation metadata.");
    }
    if (
      manipulation.anomalyTrialIds.some((id) => !anomalyIds.includes(id))
    ) {
      errors.push("Anomaly IDs do not match trial structure.");
    }
    if (firstChange !== manipulation.trueChangeTrial) {
      errors.push("True change point does not match manipulation metadata.");
    }
    if (prototype.changeTrialIndex !== manipulation.trueChangeTrial) {
      errors.push("Prototype changeTrialIndex does not match manipulation metadata.");
    }
    if (manipulation.oldRule.id === manipulation.newRule.id) {
      errors.push("Old and new rule must differ.");
    }
    if (!prototype.trials.some((trial) => trial.phase === "transfer")) {
      errors.push("Hidden-system form must contain a transfer probe.");
    }
  } else if (
    form.manipulation.kind === "evidence-stream" &&
    form.prototype.kind === "evidence-stream"
  ) {
    const prototype = form.prototype;
    const manipulation = form.manipulation;
    const directions = new Set(
      prototype.evidence.map((event) => event.evidentialDirection),
    );
    const strengths = new Set(
      prototype.evidence.map((event) => event.evidentialWeight),
    );

    if (prototype.evidence.length !== manipulation.evidenceCount) {
      errors.push("Evidence count does not match manipulation metadata.");
    }
    if (prototype.evidence.length < 4 || prototype.evidence.length > 6) {
      errors.push("Evidence stream should contain 4–6 events.");
    }
    if (manipulation.requiresDirectionVariation && directions.size < 2) {
      errors.push("Evidence direction does not vary.");
    }
    if (manipulation.requiresStrengthVariation && strengths.size < 2) {
      errors.push("Evidence strength does not vary.");
    }
    if (
      manipulation.requiresStrongContradiction &&
      !prototype.evidence.some(
        (event) =>
          event.evidentialDirection === "contradicts" &&
          event.evidentialWeight === "strong",
      )
    ) {
      errors.push("Strong contradictory evidence is missing.");
    }

    errors.push(
      ...validateTimeline(prototype.evidence.map((event) => event.event)),
    );
  } else {
    errors.push("Form manipulation kind and prototype kind do not match.");
  }

  if (form.mobileRisk === "high") {
    warnings.push("High mobile measurement risk requires empirical device review.");
  }

  return {
    formId: form.id,
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

import { constructsForTrace } from "../traces";
import {
  assignedForms,
  attentionPrototype,
  evidencePrototype,
  hiddenPrototype,
  type SimulationResearchSession,
} from "../session";
import { validateSimulationForm } from "./manipulation";
import type { SimulationQualityFlag } from "./types";

function flag(
  sessionId: string,
  type: SimulationQualityFlag["type"],
  scope: SimulationQualityFlag["scope"],
  detail: string,
  formId?: string,
  traceId?: string,
): SimulationQualityFlag {
  return {
    id: [sessionId, type, scope, formId ?? "", traceId ?? "", detail]
      .filter(Boolean)
      .join(":"),
    type,
    scope,
    formId,
    traceId,
    detail,
    automaticExclusion: false,
  };
}

export function deriveQualityFlags(
  session: SimulationResearchSession,
): SimulationQualityFlag[] {
  const flags: SimulationQualityFlag[] = [];
  const seenTraceIds = new Set<string>();

  for (const trace of session.traces) {
    if (seenTraceIds.has(trace.id)) {
      flags.push(
        flag(
          session.researchSessionId,
          "duplicate-trace",
          "trace",
          "Duplicate trace identifier detected.",
          undefined,
          trace.id,
        ),
      );
    }
    seenTraceIds.add(trace.id);

    try {
      constructsForTrace(trace.type);
    } catch {
      flags.push(
        flag(
          session.researchSessionId,
          "unsupported-trace",
          "trace",
          "Trace type has no registered construct hypothesis.",
          undefined,
          trace.id,
        ),
      );
    }
  }

  if (
    session.instrumentationEvents.some((event) => event.type === "tab-hidden")
  ) {
    flags.push(
      flag(
        session.researchSessionId,
        "background-tab",
        "session",
        "Browser tab was hidden during the research session.",
      ),
    );
  }

  for (const form of assignedForms(session)) {
    const validation = validateSimulationForm(form);
    if (!validation.valid || validation.warnings.length > 0) {
      flags.push(
        flag(
          session.researchSessionId,
          "form-validation-warning",
          "form",
          [...validation.errors, ...validation.warnings].join(" "),
          form.id,
        ),
      );
    }
  }

  const attentionFormId = session.assignedFormIds.attention;
  if (session.attention.completed) {
    const required = ["signal-selection", "interruption", "decision", "confidence"];
    for (const type of required) {
      if (
        !session.traces.some(
          (trace) =>
            trace.payload.formId === attentionFormId && trace.type === type,
        )
      ) {
        flags.push(
          flag(
            session.researchSessionId,
            type === "confidence" ? "missing-confidence" : "incomplete-form",
            "form",
            `Attention form is missing required ${type} trace.`,
            attentionFormId,
          ),
        );
      }
    }
  }

  const hiddenFormId = session.assignedFormIds.hiddenSystem;
  const hidden = hiddenPrototype(session);
  const hiddenPredictions = session.traces.filter(
    (trace) =>
      trace.payload.formId === hiddenFormId &&
      trace.type === "rule-prediction",
  );
  if (
    session.hiddenSystem.completed &&
    hiddenPredictions.length < hidden.trials.length
  ) {
    flags.push(
      flag(
        session.researchSessionId,
        "incomplete-form",
        "form",
        "Hidden-system form is missing one or more prediction traces.",
        hiddenFormId,
      ),
    );
  }

  const evidenceFormId = session.assignedFormIds.evidence;
  const evidence = evidencePrototype(session);
  if (session.evidence.completed) {
    for (const type of ["evidence-update", "decision", "confidence"] as const) {
      const count = session.traces.filter(
        (trace) =>
          trace.payload.formId === evidenceFormId && trace.type === type,
      ).length;
      if (count < evidence.evidence.length) {
        flags.push(
          flag(
            session.researchSessionId,
            type === "confidence" ? "missing-confidence" : "incomplete-form",
            "form",
            `Evidence form has ${count}/${evidence.evidence.length} ${type} traces.`,
            evidenceFormId,
          ),
        );
      }
    }
  }

  if (
    session.traces.some(
      (trace) => !Number.isFinite(trace.timestampMs) || trace.timestampMs < 0,
    )
  ) {
    flags.push(
      flag(
        session.researchSessionId,
        "timing-anomaly",
        "session",
        "One or more trace timestamps are invalid.",
      ),
    );
  }

  void attentionPrototype(session);
  return flags;
}

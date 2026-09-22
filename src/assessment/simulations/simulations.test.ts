import { describe, expect, it } from "vitest";

import { experimentalTasks } from "../experimental/tasks";
import { EXPERIMENTAL_SESSION_KEY } from "../experimental/session";
import { PILOT_PROTOCOL_VERSION } from "../research/protocol";
import { assessmentTasks } from "../tasks";
import { ASSESSMENT_SESSION_KEY } from "../session";
import { calculateAssessmentScore } from "../scoring";
import type { AssessmentResponse } from "../types";
import {
  adaptationRules,
  chooseDifficultyAdjustments,
} from "./adaptive";
import {
  simulationEngineGuardrails,
  validateDifficulty,
} from "./engine";
import { simulationEnvironmentCatalog } from "./environments";
import {
  dynamicAttentionPrototype,
  evidenceStreamPrototype,
  hiddenSystemPrototype,
  simulationPrototypes,
} from "./prototypes";
import {
  SIMULATION_SESSION_KEY,
  attentionForm,
  attentionPrototype,
  beginSimulationSession,
  completeAttentionPrototype,
  createSimulationSession,
  evidenceForm,
  evidencePrototype,
  hiddenPrototype,
  hiddenSystemForm,
  recordVisibilityEvent,
  setAttentionConfidence,
  setEvidenceConfidence,
  setEvidenceDecision,
  setHiddenDraft,
  setHiddenHypothesisDraft,
  submitEvidenceCheckpoint,
  submitHiddenPrediction,
  toggleAttentionSignal,
} from "./session";
import { constructsForTrace, traceConstructMap } from "./traces";
import {
  eventAtStep,
  supportsSimulationMode,
  validateTimeline,
} from "./timeline";
import type {
  CognitiveTrace,
  TraceSummary,
  TraceType,
} from "./types";
import {
  attentionForms,
  evidenceForms,
  hiddenSystemForms,
  simulationForms,
} from "./validation/forms";
import { validateSimulationForm } from "./validation/manipulation";
import { deriveObservations } from "./validation/observations";
import { deriveQualityFlags } from "./validation/quality";
import {
  assignFormOrder,
  seededShuffle,
} from "./validation/randomization";
import {
  buildSimulationResearchExport,
  SIMULATION_EXPORT_SCHEMA_VERSION,
} from "./validation/export";

function productionResponse(
  taskId: string,
  answer: unknown,
  confidence?: number,
): AssessmentResponse {
  return {
    taskId,
    answer,
    confidence,
    startedAt: "2026-09-22T00:00:00.000Z",
    completedAt: "2026-09-22T00:01:00.000Z",
  };
}

const perfectProductionResponses: AssessmentResponse[] = [
  productionResponse(
    "task-01-information-filtering",
    ["operating-margin", "churn"],
    100,
  ),
  productionResponse("task-02-reasoning", "insufficient", 100),
  productionResponse(
    "task-03-evidence-evaluation",
    ["rct", "observational-study", "manufacturer-study", "viral-video"],
    100,
  ),
  productionResponse(
    "task-04-adaptive-rule",
    { phaseA: "14", phaseB: "15" },
  ),
  productionResponse("task-05-missing-information", "insufficient", 100),
  productionResponse("task-06-knowledge-transfer", "shift-load"),
];

function completeSimulationSession() {
  let session = beginSimulationSession(
    createSimulationSession("step", "sim_test-complete"),
  );

  const attention = attentionPrototype(session);
  for (const signalId of attention.diagnosticSignalIds) {
    session = toggleAttentionSignal(session, signalId, 100 + session.traces.length);
  }
  session = setAttentionConfidence(session, 80);
  while (session.attention.frameIndex < attention.frames.length - 1) {
    session = {
      ...session,
      attention: {
        ...session.attention,
        frameIndex: session.attention.frameIndex + 1,
      },
    };
  }
  session = completeAttentionPrototype(session, 150);

  const hidden = hiddenPrototype(session);
  for (let index = 0; index < hidden.trials.length; index += 1) {
    const trial = hidden.trials[index];
    session = setHiddenDraft(session, String(trial.expected));
    if (trial.hypothesisCheckpoint) {
      session = setHiddenHypothesisDraft(
        session,
        index < hidden.changeTrialIndex ? "initial rule" : "revised rule",
      );
    }
    session = submitHiddenPrediction(session, 200 + index * 10);
  }

  const evidence = evidencePrototype(session);
  for (let index = 0; index < evidence.evidence.length; index += 1) {
    const event = evidence.evidence[index];
    const decision =
      event.evidentialDirection === "contradicts" &&
      event.evidentialWeight === "strong"
        ? "low-support"
        : index === 0
          ? "tentative-support"
          : "uncertain";
    session = setEvidenceDecision(session, decision);
    session = setEvidenceConfidence(session, 60 + index * 5);
    session = submitEvidenceCheckpoint(session, 400 + index * 10);
  }

  return session;
}

describe("parallel-form architecture", () => {
  it("provides at least two candidate forms for every implemented environment", () => {
    expect(attentionForms.length).toBeGreaterThanOrEqual(2);
    expect(hiddenSystemForms.length).toBeGreaterThanOrEqual(2);
    expect(evidenceForms.length).toBeGreaterThanOrEqual(2);
  });

  it("uses unique form IDs and shared structural templates within families", () => {
    expect(new Set(simulationForms.map((form) => form.id)).size).toBe(
      simulationForms.length,
    );

    for (const forms of [attentionForms, hiddenSystemForms, evidenceForms]) {
      expect(new Set(forms.map((form) => form.structuralTemplateId)).size).toBe(
        1,
      );
      for (const form of forms) {
        expect(form.parallelFormOf).not.toBe(form.id);
      }
    }
  });

  it("keeps all manipulation difficulty vectors bounded", () => {
    for (const form of simulationForms) {
      expect(validateDifficulty(form.manipulationProfile)).toEqual([]);
    }
  });

  it("passes manipulation validation for every implemented candidate form", () => {
    for (const form of simulationForms) {
      const validation = validateSimulationForm(form);
      expect(validation.errors).toEqual([]);
      expect(validation.valid).toBe(true);
    }
  });

  it("fails a deliberately invalid manipulation fixture", () => {
    const invalid = structuredClone(attentionForms[0]);
    if (invalid.manipulation.kind !== "attention") {
      throw new Error("Unexpected fixture type");
    }
    invalid.manipulation.salientDistractorId =
      invalid.prototype.diagnosticSignalIds[0];

    expect(validateSimulationForm(invalid).valid).toBe(false);
  });
});

describe("deterministic research assignment", () => {
  it("returns the same counterbalanced order for the same seed", () => {
    expect(assignFormOrder("participant-a", "study-1")).toEqual(
      assignFormOrder("participant-a", "study-1"),
    );
  });

  it("uses deterministic seeded shuffling and allows different seeds to diverge", () => {
    const first = seededShuffle([1, 2, 3, 4, 5, 6], "seed-alpha");
    const repeat = seededShuffle([1, 2, 3, 4, 5, 6], "seed-alpha");
    const second = seededShuffle([1, 2, 3, 4, 5, 6], "seed-beta");

    expect(first).toEqual(repeat);
    expect(second).not.toEqual(first);
  });
});

describe("dynamic intelligence model", () => {
  it("preserves eight reusable environment families and three active prototypes", () => {
    expect(simulationEnvironmentCatalog).toHaveLength(8);
    expect(simulationPrototypes).toHaveLength(3);
    expect(dynamicAttentionPrototype.kind).toBe("attention");
    expect(hiddenSystemPrototype.kind).toBe("hidden-system");
    expect(evidenceStreamPrototype.kind).toBe("evidence-stream");
  });

  it("maps every declared trace type to hypothesized constructs", () => {
    const declared = new Set<TraceType>(
      simulationEnvironmentCatalog.flatMap((environment) =>
        environment.traceTypes,
      ),
    );

    for (const traceType of declared) {
      expect(constructsForTrace(traceType).length).toBeGreaterThan(0);
    }
    expect(
      traceConstructMap.every(
        (item) => item.interpretationStatus === "hypothesized",
      ),
    ).toBe(true);
  });

  it("rejects an unknown trace instead of silently interpreting it", () => {
    expect(() => constructsForTrace("unknown" as TraceType)).toThrow();
  });
});

describe("timeline and accessibility structure", () => {
  it("uses unique ordered event IDs in every attention/evidence form", () => {
    for (const form of attentionForms) {
      if (form.prototype.kind !== "attention") continue;
      const events = form.prototype.frames.map((frame) => frame.event);
      expect(validateTimeline(events)).toEqual([]);
      expect(new Set(events.map((event) => event.id)).size).toBe(events.length);
      expect(eventAtStep(events, 0)).not.toBeNull();
    }

    for (const form of evidenceForms) {
      if (form.prototype.kind !== "evidence-stream") continue;
      const events = form.prototype.evidence.map((item) => item.event);
      expect(validateTimeline(events)).toEqual([]);
      expect(new Set(events.map((event) => event.id)).size).toBe(events.length);
    }
  });

  it("continues to support step and future real-time modes", () => {
    expect(supportsSimulationMode("step")).toBe(true);
    expect(supportsSimulationMode("real-time")).toBe(true);
  });
});

describe("adaptive difficulty guardrails", () => {
  const summary: TraceSummary = {
    correctOutcomeRate: 0.9,
    selectionQuality: 0.4,
    meanConfidence: 0.8,
    highConfidenceErrorRate: 0.5,
    ruleUpdateErrorRate: 0.5,
    unnecessaryInformationRate: null,
    postInterruptionRecovery: 1,
  };

  it("is deterministic and never emits an intelligence score", () => {
    expect(chooseDifficultyAdjustments(summary)).toEqual(
      chooseDifficultyAdjustments(summary),
    );
    expect(
      adaptationRules.every((rule) => rule.researchRationale.length > 0),
    ).toBe(true);
    expect(simulationEngineGuardrails.producesIntelligenceScore).toBe(false);
    expect(simulationEngineGuardrails.producesPercentile).toBe(false);
    expect(simulationEngineGuardrails.producesIqEquivalent).toBe(false);
  });
});

describe("derived observations and provenance", () => {
  it("is idempotent for an identical trace set", () => {
    const session = completeSimulationSession();
    expect(deriveObservations(session)).toEqual(deriveObservations(session));
  });

  it("uses deterministic unique observation IDs and raw trace provenance", () => {
    const observations = deriveObservations(completeSimulationSession());

    expect(new Set(observations.map((item) => item.id)).size).toBe(
      observations.length,
    );
    expect(observations.length).toBeGreaterThan(5);
    for (const observation of observations) {
      expect(observation.interpretationStatus).toBe("hypothesized");
      if (observation.value !== null) {
        expect(observation.sourceTraceIds.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("quality flags and instrumentation", () => {
  it("flags missing required traces rather than converting them to zero performance", () => {
    let session = createSimulationSession("step", "sim_missing");
    session = {
      ...session,
      status: "in_progress",
      attention: { ...session.attention, completed: true },
    };

    const flags = deriveQualityFlags(session);
    expect(
      flags.some(
        (flag) =>
          flag.type === "incomplete-form" ||
          flag.type === "missing-confidence",
      ),
    ).toBe(true);
    expect(flags.every((flag) => flag.automaticExclusion === false)).toBe(true);
  });

  it("records background-tab behavior as a quality flag, not an exclusion", () => {
    let session = beginSimulationSession(
      createSimulationSession("step", "sim_visibility"),
    );
    session = recordVisibilityEvent(session, true, 1000);
    session = recordVisibilityEvent(session, false, 2000);

    const flags = deriveQualityFlags(session);
    const background = flags.find((flag) => flag.type === "background-tab");
    expect(background).toBeTruthy();
    expect(background?.automaticExclusion).toBe(false);
  });

  it("protects trace IDs from conceptual duplicates", () => {
    let session = beginSimulationSession(
      createSimulationSession("step", "sim_duplicate"),
    );
    const diagnostic = attentionPrototype(session).diagnosticSignalIds[0];
    session = toggleAttentionSignal(session, diagnostic, 100);
    const firstCount = session.traces.length;

    const duplicateTrace: CognitiveTrace = session.traces[0];
    session = { ...session, traces: [...session.traces, duplicateTrace] };
    expect(deriveQualityFlags(session).some(
      (flag) => flag.type === "duplicate-trace",
    )).toBe(true);
    expect(firstCount).toBe(1);
  });
});

describe("pilot-ready export", () => {
  it("is versioned, local-only, machine-readable and contains no final intelligence outputs", () => {
    const session = completeSimulationSession();
    const researchExport = buildSimulationResearchExport(session);

    expect(researchExport.schemaVersion).toBe(
      SIMULATION_EXPORT_SCHEMA_VERSION,
    );
    expect(researchExport.source).toBe("local-pilot-export");
    expect(researchExport.forms).toHaveLength(3);
    expect(researchExport.observations.length).toBeGreaterThan(0);
    expect(researchExport.session.researchSessionId).toBe(
      session.researchSessionId,
    );
    expect("iq" in researchExport).toBe(false);
    expect("percentile" in researchExport).toBe(false);
    expect("score" in researchExport).toBe(false);
  });

  it("keeps simulation storage isolated", () => {
    expect(SIMULATION_SESSION_KEY).not.toBe(ASSESSMENT_SESSION_KEY);
    expect(SIMULATION_SESSION_KEY).not.toBe(EXPERIMENTAL_SESSION_KEY);
  });
});

describe("existing architecture protection", () => {
  it("preserves the six-task production assessment and known perfect scoring", () => {
    expect(assessmentTasks).toHaveLength(6);
    expect(calculateAssessmentScore(perfectProductionResponses).scores).toEqual({
      reasoning: 100,
      adaptiveLearning: 100,
      evidenceEvaluation: 100,
      informationFiltering: 100,
      metacognitiveCalibration: 100,
      knowledgeTransfer: 100,
    });
  });

  it("preserves the 12-task experimental battery and Milestone 13 framework", () => {
    expect(experimentalTasks).toHaveLength(12);
    expect(PILOT_PROTOCOL_VERSION).toBe("pilot-framework-0.1");
  });

  it("keeps active session form assignments valid", () => {
    const session = createSimulationSession("step", "sim_assignments");
    expect(attentionForm(session).environmentId).toBe("dynamic-attention");
    expect(hiddenSystemForm(session).environmentId).toBe(
      "hidden-system-learning",
    );
    expect(evidenceForm(session).environmentId).toBe(
      "dynamic-evidence-stream",
    );
  });
});

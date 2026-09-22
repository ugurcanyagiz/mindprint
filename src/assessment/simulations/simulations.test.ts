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
  createInternalDiagnostic,
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
  beginSimulationSession,
  completeAttentionPrototype,
  createSimulationSession,
  setAttentionConfidence,
  submitEvidenceCheckpoint,
  submitHiddenPrediction,
  toggleAttentionSignal,
  setEvidenceDecision,
  setEvidenceConfidence,
  setHiddenDraft,
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

describe("dynamic intelligence model", () => {
  it("defines eight reusable environment families with unique IDs", () => {
    expect(simulationEnvironmentCatalog).toHaveLength(8);
    expect(
      new Set(simulationEnvironmentCatalog.map((item) => item.id)).size,
    ).toBe(8);
  });

  it("implements at least three representative prototype simulations", () => {
    expect(simulationPrototypes.length).toBeGreaterThanOrEqual(3);
    expect(simulationPrototypes.map((prototype) => prototype.id)).toEqual([
      "sim-attention-01",
      "sim-hidden-system-01",
      "sim-evidence-stream-01",
    ]);
  });

  it("keeps every difficulty manipulation bounded", () => {
    for (const prototype of simulationPrototypes) {
      expect(validateDifficulty(prototype.difficulty)).toEqual([]);
    }
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

    expect(traceConstructMap.every(
      (item) => item.interpretationStatus === "hypothesized",
    )).toBe(true);
  });

  it("rejects an unknown trace instead of silently interpreting it", () => {
    expect(() => constructsForTrace("unknown" as TraceType)).toThrow();
  });
});

describe("simulation timeline and accessibility structure", () => {
  it("uses unique ordered events inside each dynamic prototype timeline", () => {
    const attentionEvents = dynamicAttentionPrototype.frames.map(
      (frame) => frame.event,
    );
    const evidenceEvents = evidenceStreamPrototype.evidence.map(
      (item) => item.event,
    );

    expect(validateTimeline(attentionEvents)).toEqual([]);
    expect(validateTimeline(evidenceEvents)).toEqual([]);
    expect(new Set(attentionEvents.map((event) => event.id)).size).toBe(
      attentionEvents.length,
    );
    expect(new Set(evidenceEvents.map((event) => event.id)).size).toBe(
      evidenceEvents.length,
    );
    expect(eventAtStep(attentionEvents, 0)?.id).toBe("attn-e1");
  });

  it("supports step mode independently of real-time animation", () => {
    expect(supportsSimulationMode("step")).toBe(true);
    expect(supportsSimulationMode("real-time")).toBe(true);
    expect(
      simulationEnvironmentCatalog.every(
        (environment) =>
          environment.accessibilityConsiderations.length > 0,
      ),
    ).toBe(true);
  });
});

describe("adaptive difficulty", () => {
  const summary: TraceSummary = {
    correctOutcomeRate: 0.9,
    selectionQuality: 0.4,
    meanConfidence: 0.8,
    highConfidenceErrorRate: 0.5,
    ruleUpdateErrorRate: 0.5,
    unnecessaryInformationRate: null,
    postInterruptionRecovery: 1,
  };

  it("is deterministic and auditable for the same input summary", () => {
    expect(chooseDifficultyAdjustments(summary)).toEqual(
      chooseDifficultyAdjustments(summary),
    );
    expect(adaptationRules.every((rule) => rule.researchRationale.length > 0)).toBe(
      true,
    );
  });

  it("never exposes a rule that outputs an intelligence score", () => {
    expect(simulationEngineGuardrails.producesIntelligenceScore).toBe(false);
    expect(simulationEngineGuardrails.producesPercentile).toBe(false);
    expect(simulationEngineGuardrails.producesIqEquivalent).toBe(false);
  });
});

describe("simulation session isolation and traces", () => {
  it("isolates simulation storage from production and experimental sessions", () => {
    expect(SIMULATION_SESSION_KEY).not.toBe(ASSESSMENT_SESSION_KEY);
    expect(SIMULATION_SESSION_KEY).not.toBe(EXPERIMENTAL_SESSION_KEY);
  });

  it("captures attention selection and completion without producing a score", () => {
    let session = beginSimulationSession(createSimulationSession());
    session = toggleAttentionSignal(session, "queue", 100);
    session = toggleAttentionSignal(session, "service", 101);
    session = setAttentionConfidence(session, 80);
    session = completeAttentionPrototype(session, 102);

    expect(session.attention.completed).toBe(true);
    expect(session.currentPrototypeIndex).toBe(1);
    expect(
      session.traces.some((trace) => trace.type === "signal-selection"),
    ).toBe(true);

    const diagnostic = createInternalDiagnostic(
      dynamicAttentionPrototype,
      session.traces,
    );
    expect("score" in diagnostic).toBe(false);
    expect("percentile" in diagnostic).toBe(false);
    expect("iq" in diagnostic).toBe(false);
  });

  it("captures hidden-system predictions and detects the changed rule trajectory", () => {
    let session = beginSimulationSession(createSimulationSession());
    session = {
      ...session,
      currentPrototypeIndex: 1,
    };

    const answers = ["7", "11", "13", "8", "14", "16", "20"];
    answers.forEach((answer, index) => {
      session = setHiddenDraft(session, answer);
      session = submitHiddenPrediction(session, 200 + index * 10);
    });

    expect(session.hiddenSystem.completed).toBe(true);
    expect(session.hiddenSystem.predictions).toHaveLength(
      hiddenSystemPrototype.trials.length,
    );
    expect(session.hiddenSystem.changeDetectedAtTrial).toBe(3);
    expect(
      session.traces.some(
        (trace) => trace.type === "rule-change-detection",
      ),
    ).toBe(true);
  });

  it("captures four evidence judgments without correctness feedback", () => {
    let session = beginSimulationSession(createSimulationSession());
    session = {
      ...session,
      currentPrototypeIndex: 2,
    };

    const decisions = [
      "tentative-support",
      "tentative-support",
      "low-support",
      "low-support",
    ];

    decisions.forEach((decision, index) => {
      session = setEvidenceDecision(session, decision);
      session = setEvidenceConfidence(session, 55 + index * 10);
      session = submitEvidenceCheckpoint(session, 400 + index * 10);
    });

    expect(session.status).toBe("completed");
    expect(session.evidence.checkpoints).toHaveLength(4);
    expect(
      session.traces.filter((trace) => trace.type === "evidence-update"),
    ).toHaveLength(4);
  });

  it("uses only registered trace types in prototype output", () => {
    const trace: CognitiveTrace = {
      id: "trace-test",
      type: "decision",
      category: "outcome",
      timestampMs: 1,
      environmentId: "dynamic-attention",
      prototypeId: "sim-attention-01",
      trialId: "trial",
      payload: {},
    };

    expect(constructsForTrace(trace.type)).toContain("modelFormation");
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

  it("preserves the 12-task experimental battery and research framework", () => {
    expect(experimentalTasks).toHaveLength(12);
    expect(PILOT_PROTOCOL_VERSION).toBe("pilot-framework-0.1");
  });
});

import type {
  CognitiveTrace,
  DynamicConstructId,
  TraceConstructHypothesis,
  TraceType,
} from "./types";

export const traceConstructMap: TraceConstructHypothesis[] = [
  {
    trace: "signal-selection",
    hypothesizedConstructs: ["attentionControl"],
    interpretationStatus: "hypothesized",
    limitation:
      "Selection behavior is an interaction-based proxy and is not equivalent to gaze or covert attention.",
  },
  {
    trace: "decision",
    hypothesizedConstructs: ["modelFormation", "epistemicJudgment"],
    interpretationStatus: "hypothesized",
    limitation:
      "A decision can reflect multiple processes and should be interpreted with task context.",
  },
  {
    trace: "confidence",
    hypothesizedConstructs: ["metacognitiveRegulation"],
    interpretationStatus: "hypothesized",
    limitation:
      "Confidence has individual response-style effects and is meaningful relative to evidence and outcome quality.",
  },
  {
    trace: "information-request",
    hypothesizedConstructs: [
      "attentionControl",
      "metacognitiveRegulation",
      "epistemicJudgment",
    ],
    interpretationStatus: "hypothesized",
    limitation:
      "More information requests are not inherently better; diagnostic value and stopping context matter.",
  },
  {
    trace: "revision",
    hypothesizedConstructs: [
      "learningDynamics",
      "metacognitiveRegulation",
      "epistemicJudgment",
    ],
    interpretationStatus: "hypothesized",
    limitation:
      "Changing an answer is not inherently adaptive; the direction and evidence context matter.",
  },
  {
    trace: "rule-prediction",
    hypothesizedConstructs: ["modelFormation", "learningDynamics"],
    interpretationStatus: "hypothesized",
    limitation:
      "Prediction quality may also depend on numeracy or working-memory demand.",
  },
  {
    trace: "rule-change-detection",
    hypothesizedConstructs: ["learningDynamics"],
    interpretationStatus: "hypothesized",
    limitation:
      "Detection latency is contextual and should not be treated as a standalone speed/intelligence measure.",
  },
  {
    trace: "transfer-choice",
    hypothesizedConstructs: ["knowledgeTransfer", "modelFormation"],
    interpretationStatus: "hypothesized",
    limitation:
      "Surface cues and domain familiarity can contaminate transfer inference.",
  },
  {
    trace: "ai-reliance",
    hypothesizedConstructs: ["augmentedCognition", "epistemicJudgment"],
    interpretationStatus: "hypothesized",
    limitation:
      "Reliance is appropriate only relative to advice quality and available independent evidence.",
  },
  {
    trace: "interruption",
    hypothesizedConstructs: ["attentionControl"],
    interpretationStatus: "hypothesized",
    limitation:
      "Recovery from an interruption is not equivalent to a general attention trait without validation.",
  },
  {
    trace: "evidence-update",
    hypothesizedConstructs: ["epistemicJudgment", "metacognitiveRegulation"],
    interpretationStatus: "hypothesized",
    limitation:
      "Belief movement must be evaluated relative to evidential strength and direction.",
  },
];

export function constructsForTrace(type: TraceType): DynamicConstructId[] {
  const mapping = traceConstructMap.find((item) => item.trace === type);
  if (!mapping) {
    throw new Error(`No construct hypothesis registered for trace type: ${type}`);
  }
  return [...mapping.hypothesizedConstructs];
}

export function appendTrace(
  traces: CognitiveTrace[],
  trace: CognitiveTrace,
): CognitiveTrace[] {
  if (traces.some((item) => item.id === trace.id)) {
    return traces;
  }

  constructsForTrace(trace.type);
  return [...traces, trace];
}

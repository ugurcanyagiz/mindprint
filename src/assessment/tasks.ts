import type { AssessmentTask } from "./types";

/**
 * Assessment content, answer keys, and task metadata live in the assessment
 * domain rather than presentation components.
 */
export const assessmentTasks: AssessmentTask[] = [
  {
    id: "task-04-adaptive-rule",
    kind: "adaptive-rule",
    dimension: "adaptiveLearning",
    version: 1,
    order: 4,
    eyebrow: "Adaptive learning",
    title: "Infer the transformation rule.",
    phaseA: {
      examples: [
        { expression: "RIN + 2", result: "8" },
        { expression: "RIN + 4", result: "12" },
        { expression: "RIN + 6", result: "16" },
      ],
      prompt: "RIN + 5 → ?",
      answerKey: "14",
    },
    phaseB: {
      examples: [
        { expression: "RIN + 2", result: "7" },
        { expression: "RIN + 4", result: "11" },
      ],
      prompt: "Under the updated rule, RIN + 6 → ?",
      answerKey: "15",
    },
    scoringMeta: {
      phaseAWeight: 0.35,
      phaseBWeight: 0.65,
    },
  },
  {
    id: "task-05-missing-information",
    kind: "single-choice",
    dimension: "metacognitiveCalibration",
    version: 1,
    order: 5,
    eyebrow: "Metacognitive judgment",
    title: "Reason only from what is known.",
    context: [
      "Alex is taller than Jordan.",
      "Jordan is taller than Sam.",
    ],
    prompt: "Who is taller: Sam or Taylor?",
    options: [
      { id: "sam", label: "Sam" },
      { id: "taylor", label: "Taylor" },
      { id: "same", label: "They are the same height" },
      { id: "insufficient", label: "There is not enough information" },
    ],
    answerKey: "insufficient",
    confidenceRequired: true,
  },
  {
    id: "task-06-knowledge-transfer",
    kind: "single-choice",
    dimension: "knowledgeTransfer",
    version: 1,
    order: 6,
    eyebrow: "Knowledge transfer",
    title: "Apply the principle to a new system.",
    principle:
      "When capacity is fixed, redistributing demand can sometimes outperform adding capacity.",
    context: [
      "A digital service becomes overloaded every weekday at 8 PM.",
      "New servers cannot be purchased this quarter.",
    ],
    prompt: "Which response best applies the principle above?",
    options: [
      {
        id: "visuals",
        label: "Increase the site's visual complexity during peak time",
      },
      {
        id: "shift-load",
        label:
          "Move non-urgent jobs, updates, and scheduled processing away from peak time",
      },
      {
        id: "refresh",
        label: "Ask users to refresh repeatedly until the service responds",
      },
      {
        id: "hide-metrics",
        label: "Hide performance metrics during peak periods",
      },
    ],
    answerKey: "shift-load",
    confidenceRequired: false,
  },
];

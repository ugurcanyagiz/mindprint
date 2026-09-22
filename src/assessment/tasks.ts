import type { AssessmentTask } from "./types";

/**
 * Assessment content, answer keys, and task metadata live in the assessment
 * domain rather than presentation components.
 */
export const assessmentTasks: AssessmentTask[] = [
  {
    id: "task-01-information-filtering",
    kind: "multi-select",
    dimension: "informationFiltering",
    version: 1,
    order: 1,
    eyebrow: "Information filtering",
    title: "Identify the signals that matter most.",
    context:
      "A subscription software company reports the following quarterly changes.",
    prompt:
      "Which TWO metrics deserve the most attention before concluding that growth is healthy?",
    metrics: [
      { id: "revenue", label: "Revenue", value: "+14%" },
      { id: "customers", label: "Customers", value: "+28%" },
      { id: "operating-margin", label: "Operating margin", value: "-6 pts" },
      { id: "marketing-expense", label: "Marketing expense", value: "+41%" },
      { id: "churn", label: "Churn", value: "+3 pts" },
      { id: "headcount", label: "Headcount", value: "+18%" },
    ],
    selectionLimit: 2,
    answerKey: ["operating-margin", "churn"],
    confidenceRequired: true,
  },
  {
    id: "task-02-reasoning",
    kind: "single-choice",
    dimension: "reasoning",
    version: 1,
    order: 2,
    eyebrow: "Reasoning",
    title: "Evaluate the conclusion, not the wording.",
    analysis:
      "Sales increased 20% and costs increased 10%, therefore profitability necessarily improved.",
    prompt: "How should this conclusion be evaluated?",
    options: [
      { id: "supported", label: "Supported" },
      { id: "probably-supported", label: "Probably supported" },
      { id: "insufficient", label: "Insufficient information" },
      { id: "probably-unsupported", label: "Probably unsupported" },
      { id: "unsupported", label: "Unsupported" },
    ],
    answerKey: "insufficient",
    confidenceRequired: true,
  },
  {
    id: "task-03-evidence-evaluation",
    kind: "ranking",
    dimension: "evidenceEvaluation",
    version: 1,
    order: 3,
    eyebrow: "Evidence evaluation",
    title: "Weight evidence by its decision value.",
    claim: "A new supplement improves memory by 40%.",
    prompt: "Rank the sources from most to least influential for your decision.",
    items: [
      {
        id: "viral-video",
        label: "Viral video",
        detail: "2.1M views · no methods shown",
      },
      {
        id: "manufacturer-study",
        label: "Manufacturer-funded study",
        detail: "n=48 · positive result",
      },
      {
        id: "observational-study",
        label: "Independent observational study",
        detail: "n=1,200 · small association",
      },
      {
        id: "rct",
        label: "Independent randomized controlled trial",
        detail: "n=8,400 · no meaningful effect",
      },
    ],
    answerKey: [
      "rct",
      "observational-study",
      "manufacturer-study",
      "viral-video",
    ],
    confidenceRequired: true,
  },
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

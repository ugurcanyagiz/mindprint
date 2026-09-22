import type { AssessmentLocaleContent } from "./types";

export const enAssessment: AssessmentLocaleContent = {
  "task-01-information-filtering": {
    eyebrow: "Information filtering",
    title: "Identify the signals that matter most.",
    context:
      "A subscription software company reports the following quarterly changes.",
    prompt:
      "Which TWO metrics deserve the most attention before concluding that growth is healthy?",
    metrics: {
      revenue: "Revenue",
      customers: "Customers",
      "operating-margin": "Operating margin",
      "marketing-expense": "Marketing expense",
      churn: "Churn",
      headcount: "Headcount",
    },
  },
  "task-02-reasoning": {
    eyebrow: "Reasoning",
    title: "Evaluate the conclusion, not the wording.",
    analysis:
      "Sales increased 20% and costs increased 10%, therefore profitability necessarily improved.",
    prompt: "How should this conclusion be evaluated?",
    options: {
      supported: "Supported",
      "probably-supported": "Probably supported",
      insufficient: "Insufficient information",
      "probably-unsupported": "Probably unsupported",
      unsupported: "Unsupported",
    },
  },
  "task-03-evidence-evaluation": {
    eyebrow: "Evidence evaluation",
    title: "Weight evidence by its decision value.",
    context: "A new supplement improves memory by 40%.",
    prompt:
      "Rank the sources from most to least influential for your decision.",
    items: {
      "viral-video": {
        label: "Viral video",
        detail: "2.1M views · no methods shown",
      },
      "manufacturer-study": {
        label: "Manufacturer-funded study",
        detail: "n=48 · positive result",
      },
      "observational-study": {
        label: "Independent observational study",
        detail: "n=1,200 · small association",
      },
      rct: {
        label: "Independent randomized controlled trial",
        detail: "n=8,400 · no meaningful effect",
      },
    },
  },
  "task-04-adaptive-rule": {
    eyebrow: "Adaptive learning",
    title: "Infer the transformation rule.",
    phaseA: { prompt: "RIN + 5 → ?" },
    phaseB: { prompt: "Under the updated rule, RIN + 6 → ?" },
  },
  "task-05-missing-information": {
    eyebrow: "Metacognitive judgment",
    title: "Reason only from what is known.",
    context: [
      "Alex is taller than Jordan.",
      "Jordan is taller than Sam.",
    ],
    prompt: "Who is taller: Sam or Taylor?",
    options: {
      sam: "Sam",
      taylor: "Taylor",
      same: "They are the same height",
      insufficient: "There is not enough information",
    },
  },
  "task-06-knowledge-transfer": {
    eyebrow: "Knowledge transfer",
    title: "Apply the principle to a new system.",
    principle:
      "When capacity is fixed, redistributing demand can sometimes outperform adding capacity.",
    context: [
      "A digital service becomes overloaded every weekday at 8 PM.",
      "New servers cannot be purchased this quarter.",
    ],
    prompt: "Which response best applies the principle above?",
    options: {
      visuals: "Increase the site's visual complexity during peak time",
      "shift-load":
        "Move non-urgent jobs, updates, and scheduled processing away from peak time",
      refresh: "Ask users to refresh repeatedly until the service responds",
      "hide-metrics": "Hide performance metrics during peak periods",
    },
  },
};

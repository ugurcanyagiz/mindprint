export const PILOT_PROTOCOL_VERSION = "pilot-framework-0.1";

export const pilotPhases = {
  cognitiveInterview: {
    label: "Cognitive interview / usability pilot",
    planningTarget: "10–20 participants",
    purpose: [
      "Check task wording and unintended clues",
      "Identify interaction confusion and mobile usability problems",
      "Compare intended reasoning path with participant interpretation",
    ],
    psychometricValidation: false,
  },
  initialQuantitative: {
    label: "Initial quantitative pilot",
    planningTarget: "150–300 completed participants",
    purpose: [
      "Describe completion, missingness, response distributions, confidence, and item behavior",
      "Inspect preliminary floor/ceiling patterns and item relationships",
      "Explore dimensional patterns without treating them as confirmed",
    ],
    psychometricValidation: false,
  },
  largerValidation: {
    label: "Larger validation sample",
    planningTarget: "500+ as a planning reference, not a fixed minimum",
    purpose: [
      "Support model-dependent reliability, factor, IRT, DIF, fairness, and language analyses",
      "Determine actual sample requirements with power or simulation appropriate to the selected model",
    ],
    psychometricValidation: false,
  },
} as const;

export const consentRequirements = [
  "The study is experimental and not a clinical or standardized test.",
  "Participation is voluntary.",
  "Describe exactly which behavioral and device data are collected.",
  "Disclose response timing, confidence, revisions, language, and optional demographics.",
  "State approximate duration, retention period, deletion process, research purpose, and contact route.",
  "Minimize sensitive personal data and prefer bands over exact values where practical.",
] as const;

export const plannedTestRetestInterval = {
  lowerDays: 7,
  upperDays: 21,
  note:
    "A planning range only. The appropriate interval depends on construct stability, practice effects, and parallel-form availability.",
} as const;

export const scientificLanguage = {
  observed: "Calculated from collected data.",
  hypothesized:
    "An intended construct target or expected relationship that has not yet been established empirically.",
  exploratory:
    "An analysis not designated as a primary confirmatory test before reviewing outcomes.",
  validated:
    "A term reserved for claims supported by an adequate body of empirical evidence for the intended use.",
} as const;

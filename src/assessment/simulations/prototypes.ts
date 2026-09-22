import type {
  AttentionPrototype,
  EvidencePrototype,
  HiddenSystemPrototype,
  SimulationPrototype,
} from "./types";

const neutralDifficulty = {
  informationDensity: 0.5,
  distractorSimilarity: 0.5,
  volatility: 0.5,
  uncertainty: 0.5,
  transferDistance: 0.5,
  interruptionLoad: 0.5,
  ruleComplexity: 0.5,
} as const;

export const dynamicAttentionPrototype: AttentionPrototype = {
  id: "sim-attention-01",
  kind: "attention",
  family: "dynamic-attention",
  title: "Signal field",
  description:
    "Track a changing service environment and identify the two signals most diagnostic of the developing bottleneck.",
  signals: [
    { id: "traffic", label: "Traffic" },
    { id: "queue", label: "Queue depth" },
    { id: "service", label: "Service time" },
    { id: "mentions", label: "Social mentions" },
    { id: "signups", label: "Signups" },
    { id: "errors", label: "Error rate" },
    { id: "email", label: "Email opens" },
    { id: "cpu", label: "CPU utilization" },
  ],
  frames: [
    {
      event: { id: "attn-e1", at: 0, type: "signal-update", label: "Baseline" },
      values: {
        traffic: 42,
        queue: 18,
        service: 24,
        mentions: 21,
        signups: 25,
        errors: 16,
        email: 31,
        cpu: 45,
      },
    },
    {
      event: {
        id: "attn-e2",
        at: 1,
        type: "signal-update",
        label: "Load building",
      },
      values: {
        traffic: 51,
        queue: 38,
        service: 35,
        mentions: 24,
        signups: 27,
        errors: 17,
        email: 33,
        cpu: 56,
      },
    },
    {
      event: {
        id: "attn-e3",
        at: 2,
        type: "interruption",
        label: "Interruption",
      },
      values: {
        traffic: 53,
        queue: 59,
        service: 49,
        mentions: 82,
        signups: 28,
        errors: 18,
        email: 35,
        cpu: 61,
      },
      note:
        "A viral post causes a sudden surge in social mentions. Continue tracking the service problem.",
    },
    {
      event: {
        id: "attn-e4",
        at: 3,
        type: "signal-update",
        label: "Peak",
      },
      values: {
        traffic: 55,
        queue: 84,
        service: 77,
        mentions: 66,
        signups: 29,
        errors: 19,
        email: 36,
        cpu: 64,
      },
    },
  ],
  diagnosticSignalIds: ["queue", "service"],
  selectionLimit: 2,
  difficulty: {
    ...neutralDifficulty,
    informationDensity: 0.7,
    distractorSimilarity: 0.6,
    interruptionLoad: 0.6,
  },
};

export const hiddenSystemPrototype: HiddenSystemPrototype = {
  id: "sim-hidden-system-01",
  kind: "hidden-system",
  family: "hidden-system-learning",
  title: "Hidden system",
  description:
    "Infer a transformation from feedback. The system may change without an explicit announcement.",
  trials: [
    { id: "hs-t1", input: 2, expected: 7, phase: "stable-a", feedbackAfterSubmission: true },
    { id: "hs-t2", input: 4, expected: 11, phase: "stable-a", feedbackAfterSubmission: true },
    { id: "hs-t3", input: 5, expected: 13, phase: "stable-a", feedbackAfterSubmission: true },
    { id: "hs-t4", input: 3, expected: 8, phase: "changed-b", feedbackAfterSubmission: true },
    { id: "hs-t5", input: 6, expected: 14, phase: "changed-b", feedbackAfterSubmission: true },
    { id: "hs-t6", input: 7, expected: 16, phase: "changed-b", feedbackAfterSubmission: true },
    { id: "hs-transfer", input: 9, expected: 20, phase: "transfer", feedbackAfterSubmission: false },
  ],
  changeTrialIndex: 3,
  difficulty: {
    ...neutralDifficulty,
    volatility: 0.65,
    ruleComplexity: 0.55,
    uncertainty: 0.55,
  },
};

export const evidenceStreamPrototype: EvidencePrototype = {
  id: "sim-evidence-stream-01",
  kind: "evidence-stream",
  family: "dynamic-evidence-stream",
  title: "Evidence stream",
  description:
    "Update your judgment as evidence arrives. No correctness feedback is shown during the stream.",
  hypothesis: "A new study technique meaningfully improves delayed recall.",
  evidence: [
    {
      id: "ev-1",
      event: { id: "ev-e1", at: 0, type: "new-evidence", label: "Evidence 1" },
      source: "Small preregistered randomized pilot",
      evidence: "n=90; reports a moderate positive effect with a wide confidence interval.",
      evidentialDirection: "supports",
      evidentialWeight: "moderate",
    },
    {
      id: "ev-2",
      event: { id: "ev-e2", at: 1, type: "new-evidence", label: "Evidence 2" },
      source: "Large observational cohort",
      evidence: "n=4,500; users of the technique have slightly higher recall, but self-selection is substantial.",
      evidentialDirection: "supports",
      evidentialWeight: "weak",
    },
    {
      id: "ev-3",
      event: { id: "ev-e3", at: 2, type: "new-evidence", label: "Evidence 3" },
      source: "Independent multicenter randomized trial",
      evidence: "n=3,800; finds no meaningful effect with a narrow interval around zero.",
      evidentialDirection: "contradicts",
      evidentialWeight: "strong",
    },
    {
      id: "ev-4",
      event: { id: "ev-e4", at: 3, type: "new-evidence", label: "Evidence 4" },
      source: "Popular expert interview",
      evidence: "Strongly endorses the technique but provides no additional controlled data.",
      evidentialDirection: "supports",
      evidentialWeight: "weak",
    },
  ],
  responseOptions: [
    { id: "strong-support", label: "Strongly support" },
    { id: "tentative-support", label: "Tentatively support" },
    { id: "uncertain", label: "Uncertain / mixed" },
    { id: "low-support", label: "Low support" },
    { id: "reject", label: "Strongly reject" },
  ],
  difficulty: {
    ...neutralDifficulty,
    uncertainty: 0.7,
    distractorSimilarity: 0.6,
    informationDensity: 0.55,
  },
};

export const simulationPrototypes: SimulationPrototype[] = [
  dynamicAttentionPrototype,
  hiddenSystemPrototype,
  evidenceStreamPrototype,
];

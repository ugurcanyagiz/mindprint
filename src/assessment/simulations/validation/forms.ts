import type {
  AttentionPrototype,
  EvidencePrototype,
  HiddenSystemPrototype,
} from "../types";
import type {
  AttentionSimulationForm,
  EvidenceSimulationForm,
  HiddenSystemSimulationForm,
  SimulationForm,
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

const attentionA: AttentionPrototype = {
  id: "sim-attention-a",
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
      event: { id: "attn-a-e1", at: 0, type: "signal-update", label: "Baseline" },
      values: { traffic: 42, queue: 18, service: 24, mentions: 21, signups: 25, errors: 16, email: 31, cpu: 45 },
    },
    {
      event: { id: "attn-a-e2", at: 1, type: "signal-update", label: "Load building" },
      values: { traffic: 51, queue: 38, service: 35, mentions: 24, signups: 27, errors: 17, email: 33, cpu: 56 },
    },
    {
      event: { id: "attn-a-e3", at: 2, type: "interruption", label: "Interruption" },
      values: { traffic: 53, queue: 59, service: 49, mentions: 82, signups: 28, errors: 18, email: 35, cpu: 61 },
      note:
        "A viral post causes a sudden surge in social mentions. Continue tracking the service problem.",
    },
    {
      event: { id: "attn-a-e4", at: 3, type: "signal-update", label: "Peak" },
      values: { traffic: 55, queue: 84, service: 77, mentions: 66, signups: 29, errors: 19, email: 36, cpu: 64 },
    },
  ],
  diagnosticSignalIds: ["queue", "service"],
  selectionLimit: 2,
  difficulty: { ...neutralDifficulty, informationDensity: 0.7, distractorSimilarity: 0.6, interruptionLoad: 0.6 },
};

const attentionB: AttentionPrototype = {
  id: "sim-attention-b",
  kind: "attention",
  family: "dynamic-attention",
  title: "Fulfillment field",
  description:
    "Track a changing fulfillment environment and identify the two signals most diagnostic of a developing processing bottleneck.",
  signals: [
    { id: "orders", label: "Incoming orders" },
    { id: "pick-queue", label: "Pick queue" },
    { id: "pick-time", label: "Median pick time" },
    { id: "mentions", label: "Social mentions" },
    { id: "returns", label: "Return requests" },
    { id: "carrier", label: "Carrier delay" },
    { id: "promo", label: "Promo clicks" },
    { id: "staff", label: "Staff utilization" },
  ],
  frames: [
    {
      event: { id: "attn-b-e1", at: 0, type: "signal-update", label: "Baseline" },
      values: { orders: 43, "pick-queue": 17, "pick-time": 23, mentions: 20, returns: 18, carrier: 27, promo: 30, staff: 46 },
    },
    {
      event: { id: "attn-b-e2", at: 1, type: "signal-update", label: "Load building" },
      values: { orders: 52, "pick-queue": 36, "pick-time": 34, mentions: 23, returns: 19, carrier: 29, promo: 34, staff: 57 },
    },
    {
      event: { id: "attn-b-e3", at: 2, type: "interruption", label: "Interruption" },
      values: { orders: 54, "pick-queue": 58, "pick-time": 50, mentions: 81, returns: 20, carrier: 30, promo: 36, staff: 62 },
      note:
        "A creator mentions the brand and social activity spikes. Continue tracking the fulfillment problem.",
    },
    {
      event: { id: "attn-b-e4", at: 3, type: "signal-update", label: "Peak" },
      values: { orders: 56, "pick-queue": 83, "pick-time": 76, mentions: 65, returns: 21, carrier: 31, promo: 37, staff: 65 },
    },
  ],
  diagnosticSignalIds: ["pick-queue", "pick-time"],
  selectionLimit: 2,
  difficulty: { ...neutralDifficulty, informationDensity: 0.7, distractorSimilarity: 0.6, interruptionLoad: 0.6 },
};

const hiddenA: HiddenSystemPrototype = {
  id: "sim-hidden-system-a",
  kind: "hidden-system",
  family: "hidden-system-learning",
  title: "Hidden system",
  description:
    "Infer a transformation from feedback. Occasional anomalies and a later rule change may occur without an announcement.",
  trials: [
    { id: "hs-a-t1", input: 2, expected: 7, phase: "stable-a", feedbackAfterSubmission: true },
    { id: "hs-a-t2", input: 4, expected: 11, phase: "stable-a", feedbackAfterSubmission: true },
    { id: "hs-a-t3", input: 5, expected: 13, phase: "stable-a", feedbackAfterSubmission: true, hypothesisCheckpoint: true },
    { id: "hs-a-anomaly", input: 6, expected: 18, phase: "anomaly", feedbackAfterSubmission: true },
    { id: "hs-a-t5", input: 3, expected: 9, phase: "stable-a", feedbackAfterSubmission: true },
    { id: "hs-a-t6", input: 4, expected: 10, phase: "changed-b", feedbackAfterSubmission: true },
    { id: "hs-a-t7", input: 6, expected: 14, phase: "changed-b", feedbackAfterSubmission: true, hypothesisCheckpoint: true },
    { id: "hs-a-t8", input: 7, expected: 16, phase: "changed-b", feedbackAfterSubmission: true },
    { id: "hs-a-transfer", input: 9, expected: 20, phase: "transfer", feedbackAfterSubmission: false },
  ],
  changeTrialIndex: 5,
  difficulty: { ...neutralDifficulty, volatility: 0.65, ruleComplexity: 0.55, uncertainty: 0.6 },
};

const hiddenB: HiddenSystemPrototype = {
  id: "sim-hidden-system-b",
  kind: "hidden-system",
  family: "hidden-system-learning",
  title: "Hidden system",
  description:
    "Infer a transformation from feedback. Occasional anomalies and a later rule change may occur without an announcement.",
  trials: [
    { id: "hs-b-t1", input: 2, expected: 7, phase: "stable-a", feedbackAfterSubmission: true },
    { id: "hs-b-t2", input: 4, expected: 13, phase: "stable-a", feedbackAfterSubmission: true },
    { id: "hs-b-t3", input: 5, expected: 16, phase: "stable-a", feedbackAfterSubmission: true, hypothesisCheckpoint: true },
    { id: "hs-b-anomaly", input: 3, expected: 14, phase: "anomaly", feedbackAfterSubmission: true },
    { id: "hs-b-t5", input: 6, expected: 19, phase: "stable-a", feedbackAfterSubmission: true },
    { id: "hs-b-t6", input: 4, expected: 11, phase: "changed-b", feedbackAfterSubmission: true },
    { id: "hs-b-t7", input: 6, expected: 17, phase: "changed-b", feedbackAfterSubmission: true, hypothesisCheckpoint: true },
    { id: "hs-b-t8", input: 7, expected: 20, phase: "changed-b", feedbackAfterSubmission: true },
    { id: "hs-b-transfer", input: 9, expected: 26, phase: "transfer", feedbackAfterSubmission: false },
  ],
  changeTrialIndex: 5,
  difficulty: { ...neutralDifficulty, volatility: 0.65, ruleComplexity: 0.55, uncertainty: 0.6 },
};

const evidenceOptions = [
  { id: "strong-support", label: "Strongly support" },
  { id: "tentative-support", label: "Tentatively support" },
  { id: "uncertain", label: "Uncertain / mixed" },
  { id: "low-support", label: "Low support" },
  { id: "reject", label: "Strongly reject" },
];

const evidenceA: EvidencePrototype = {
  id: "sim-evidence-stream-a",
  kind: "evidence-stream",
  family: "dynamic-evidence-stream",
  title: "Evidence stream",
  description:
    "Update your judgment as evidence arrives. No correctness feedback is shown during the stream.",
  hypothesis: "A new study technique meaningfully improves delayed recall.",
  evidence: [
    {
      id: "ev-a-1",
      event: { id: "ev-a-e1", at: 0, type: "new-evidence", label: "Evidence 1" },
      source: "Small preregistered randomized pilot",
      evidence: "n=90; reports a moderate positive effect with a wide confidence interval.",
      evidentialDirection: "supports",
      evidentialWeight: "moderate",
      independence: "independent",
      studyQuality: "moderate",
      sampleInformation: "n=90",
      conflictOfInterest: "none reported",
      diagnosticWeight: 0.55,
    },
    {
      id: "ev-a-2",
      event: { id: "ev-a-e2", at: 1, type: "new-evidence", label: "Evidence 2" },
      source: "Large observational cohort",
      evidence: "n=4,500; users of the technique have slightly higher recall, but self-selection is substantial.",
      evidentialDirection: "supports",
      evidentialWeight: "weak",
      independence: "independent",
      studyQuality: "observational",
      sampleInformation: "n=4,500",
      conflictOfInterest: "none reported",
      diagnosticWeight: 0.25,
    },
    {
      id: "ev-a-3",
      event: { id: "ev-a-e3", at: 2, type: "new-evidence", label: "Evidence 3" },
      source: "Independent multicenter randomized trial",
      evidence: "n=3,800; finds no meaningful effect with a narrow interval around zero.",
      evidentialDirection: "contradicts",
      evidentialWeight: "strong",
      independence: "independent",
      studyQuality: "high",
      sampleInformation: "n=3,800",
      conflictOfInterest: "none reported",
      diagnosticWeight: 0.95,
    },
    {
      id: "ev-a-4",
      event: { id: "ev-a-e4", at: 3, type: "new-evidence", label: "Evidence 4" },
      source: "Popular expert interview",
      evidence: "Strongly endorses the technique but provides no additional controlled data.",
      evidentialDirection: "supports",
      evidentialWeight: "weak",
      independence: "unclear",
      studyQuality: "anecdotal",
      sampleInformation: "not applicable",
      conflictOfInterest: "not disclosed",
      diagnosticWeight: 0.1,
    },
  ],
  responseOptions: evidenceOptions,
  difficulty: { ...neutralDifficulty, uncertainty: 0.7, distractorSimilarity: 0.6, informationDensity: 0.55 },
};

const evidenceB: EvidencePrototype = {
  id: "sim-evidence-stream-b",
  kind: "evidence-stream",
  family: "dynamic-evidence-stream",
  title: "Evidence stream",
  description:
    "Update your judgment as evidence arrives. No correctness feedback is shown during the stream.",
  hypothesis: "A routing change meaningfully reduces late deliveries.",
  evidence: [
    {
      id: "ev-b-1",
      event: { id: "ev-b-e1", at: 0, type: "new-evidence", label: "Evidence 1" },
      source: "Internal controlled regional pilot",
      evidence: "Six matched regions show a moderate reduction in late deliveries, but uncertainty remains wide.",
      evidentialDirection: "supports",
      evidentialWeight: "moderate",
      independence: "internal",
      studyQuality: "moderate",
      sampleInformation: "6 matched regions",
      conflictOfInterest: "operational owner involved",
      diagnosticWeight: 0.55,
    },
    {
      id: "ev-b-2",
      event: { id: "ev-b-e2", at: 1, type: "new-evidence", label: "Evidence 2" },
      source: "Partner network comparison",
      evidence: "Sites choosing the routing change report slightly fewer delays, but adoption was voluntary.",
      evidentialDirection: "supports",
      evidentialWeight: "weak",
      independence: "partially independent",
      studyQuality: "observational",
      sampleInformation: "network comparison",
      conflictOfInterest: "commercial partner",
      diagnosticWeight: 0.25,
    },
    {
      id: "ev-b-3",
      event: { id: "ev-b-e3", at: 2, type: "new-evidence", label: "Evidence 3" },
      source: "Independent randomized rollout",
      evidence: "A larger randomized rollout finds no meaningful reduction in late deliveries with narrow uncertainty.",
      evidentialDirection: "contradicts",
      evidentialWeight: "strong",
      independence: "independent",
      studyQuality: "high",
      sampleInformation: "large randomized rollout",
      conflictOfInterest: "none reported",
      diagnosticWeight: 0.95,
    },
    {
      id: "ev-b-4",
      event: { id: "ev-b-e4", at: 3, type: "new-evidence", label: "Evidence 4" },
      source: "Executive interview",
      evidence: "A senior operator strongly endorses the routing change but provides no new controlled comparison.",
      evidentialDirection: "supports",
      evidentialWeight: "weak",
      independence: "internal",
      studyQuality: "anecdotal",
      sampleInformation: "not applicable",
      conflictOfInterest: "operational owner",
      diagnosticWeight: 0.1,
    },
  ],
  responseOptions: evidenceOptions,
  difficulty: { ...neutralDifficulty, uncertainty: 0.7, distractorSimilarity: 0.6, informationDensity: 0.55 },
};

export const attentionForms: AttentionSimulationForm[] = [
  {
    id: "attention-form-a",
    environmentId: "dynamic-attention",
    version: 1,
    formLabel: "A",
    structuralTemplateId: "attention-template-v1",
    manipulationProfile: attentionA.difficulty,
    language: "en",
    intendedDifficulty: "development-medium",
    validationStatus: "experimental",
    parallelFormOf: "attention-form-b",
    mobileRisk: "high",
    prototype: attentionA,
    manipulation: {
      kind: "attention",
      relevantSignalCount: 2,
      irrelevantSignalCount: 6,
      salientDistractorId: "mentions",
      salientDistractorPresent: true,
      interruptionPresent: true,
      distractorPeakMagnitude: 0.82,
    },
  },
  {
    id: "attention-form-b",
    environmentId: "dynamic-attention",
    version: 1,
    formLabel: "B",
    structuralTemplateId: "attention-template-v1",
    manipulationProfile: attentionB.difficulty,
    language: "en",
    intendedDifficulty: "development-medium",
    validationStatus: "experimental",
    parallelFormOf: "attention-form-a",
    mobileRisk: "high",
    prototype: attentionB,
    manipulation: {
      kind: "attention",
      relevantSignalCount: 2,
      irrelevantSignalCount: 6,
      salientDistractorId: "mentions",
      salientDistractorPresent: true,
      interruptionPresent: true,
      distractorPeakMagnitude: 0.81,
    },
  },
];

export const hiddenSystemForms: HiddenSystemSimulationForm[] = [
  {
    id: "hidden-system-form-a",
    environmentId: "hidden-system-learning",
    version: 1,
    formLabel: "A",
    structuralTemplateId: "hidden-system-template-v1",
    manipulationProfile: hiddenA.difficulty,
    language: "en",
    intendedDifficulty: "development-medium",
    validationStatus: "experimental",
    parallelFormOf: "hidden-system-form-b",
    mobileRisk: "low",
    prototype: hiddenA,
    manipulation: {
      kind: "hidden-system",
      stableTrials: 4,
      anomalyTrials: 1,
      anomalyTrialIds: ["hs-a-anomaly"],
      trueChangeTrial: 5,
      postChangeTrials: 3,
      transferTrials: 1,
      oldRule: { id: "rule-a-2x-plus-3", description: "2x + 3" },
      newRule: { id: "rule-a-2x-plus-2", description: "2x + 2" },
    },
  },
  {
    id: "hidden-system-form-b",
    environmentId: "hidden-system-learning",
    version: 1,
    formLabel: "B",
    structuralTemplateId: "hidden-system-template-v1",
    manipulationProfile: hiddenB.difficulty,
    language: "en",
    intendedDifficulty: "development-medium",
    validationStatus: "experimental",
    parallelFormOf: "hidden-system-form-a",
    mobileRisk: "low",
    prototype: hiddenB,
    manipulation: {
      kind: "hidden-system",
      stableTrials: 4,
      anomalyTrials: 1,
      anomalyTrialIds: ["hs-b-anomaly"],
      trueChangeTrial: 5,
      postChangeTrials: 3,
      transferTrials: 1,
      oldRule: { id: "rule-b-3x-plus-1", description: "3x + 1" },
      newRule: { id: "rule-b-3x-minus-1", description: "3x - 1" },
    },
  },
];

export const evidenceForms: EvidenceSimulationForm[] = [
  {
    id: "evidence-form-a",
    environmentId: "dynamic-evidence-stream",
    version: 1,
    formLabel: "A",
    structuralTemplateId: "evidence-template-v1",
    manipulationProfile: evidenceA.difficulty,
    language: "en",
    intendedDifficulty: "development-medium",
    validationStatus: "experimental",
    parallelFormOf: "evidence-form-b",
    mobileRisk: "medium",
    prototype: evidenceA,
    manipulation: {
      kind: "evidence-stream",
      evidenceCount: 4,
      requiresDirectionVariation: true,
      requiresStrengthVariation: true,
      requiresStrongContradiction: true,
    },
  },
  {
    id: "evidence-form-b",
    environmentId: "dynamic-evidence-stream",
    version: 1,
    formLabel: "B",
    structuralTemplateId: "evidence-template-v1",
    manipulationProfile: evidenceB.difficulty,
    language: "en",
    intendedDifficulty: "development-medium",
    validationStatus: "experimental",
    parallelFormOf: "evidence-form-a",
    mobileRisk: "medium",
    prototype: evidenceB,
    manipulation: {
      kind: "evidence-stream",
      evidenceCount: 4,
      requiresDirectionVariation: true,
      requiresStrengthVariation: true,
      requiresStrongContradiction: true,
    },
  },
];

export const simulationForms: SimulationForm[] = [
  ...attentionForms,
  ...hiddenSystemForms,
  ...evidenceForms,
];

export function formById(id: string): SimulationForm {
  const form = simulationForms.find((item) => item.id === id);
  if (!form) throw new Error(`Unknown simulation form: ${id}`);
  return form;
}

export function formsForEnvironment(environmentId: string): SimulationForm[] {
  return simulationForms.filter((form) => form.environmentId === environmentId);
}

import type {
  ResearchTaskDefinition,
  TelemetryPlan,
} from "./types";

function telemetry(
  overrides: Partial<TelemetryPlan> = {},
): TelemetryPlan {
  return {
    answer: true,
    confidence: false,
    responseTime: true,
    revisions: false,
    rankingMovements: false,
    selectedEvidence: false,
    informationViews: false,
    beliefChange: false,
    confidenceChange: false,
    phaseChanges: false,
    ruleUpdateErrors: false,
    ...overrides,
  };
}

/**
 * Development bank only.
 *
 * The six entries marked "production" correspond to the current short-form
 * assessment. Candidate entries are research blueprints and are not rendered
 * by the production assessment until separately implemented and validated.
 */
export const researchTaskBank: ResearchTaskDefinition[] = [
  {
    id: "task-02-reasoning",
    dimension: "reasoning",
    subfacet: "logicalSufficiency",
    version: 1,
    status: "production",
    difficulty: "medium",
    taskFamily: "ai-judgment",
    cognitiveTarget:
      "Detect when a confident quantitative conclusion is not logically determined by the information provided.",
    scenarioBlueprint:
      "Automated business analysis infers necessary profitability improvement from percentage changes without sufficient baseline values.",
    expectedResponseType: "single-choice",
    scoringStrategy: "objective-with-calibration",
    languageSensitivity: "medium",
    confounds: ["numeracy", "language-proficiency"],
    telemetry: telemetry({ confidence: true }),
    canonicalAnswerIds: ["insufficient"],
    difficultyDrivers: [
      "confident automated wording",
      "missing baseline values",
      "plausible directional distractors",
    ],
  },
  {
    id: "reasoning-causal-01",
    dimension: "reasoning",
    subfacet: "causalReasoning",
    version: 1,
    status: "candidate",
    difficulty: "hard",
    taskFamily: "causal-reasoning",
    cognitiveTarget:
      "Separate correlation from causal attribution when multiple plausible mechanisms changed at the same time.",
    scenarioBlueprint:
      "A product team attributes a conversion increase to a recommendation model even though pricing, traffic mix, and onboarding changed simultaneously.",
    expectedResponseType: "single-choice",
    scoringStrategy: "objective-with-calibration",
    languageSensitivity: "medium",
    confounds: ["digital-literacy", "reading-speed"],
    telemetry: telemetry({ confidence: true, revisions: true }),
    canonicalAnswerIds: ["need-controlled-comparison"],
    difficultyDrivers: [
      "multiple concurrent changes",
      "credible causal narrative",
      "close alternative explanations",
    ],
  },
  {
    id: "reasoning-quantitative-01",
    dimension: "reasoning",
    subfacet: "quantitativeReasoning",
    version: 1,
    status: "candidate",
    difficulty: "medium",
    taskFamily: "quantitative-structure",
    cognitiveTarget:
      "Reason about relative changes without assuming equal starting quantities.",
    scenarioBlueprint:
      "Two operational metrics improve by different percentages; the decision depends on recognizing that percentage change alone does not reveal final absolute magnitude.",
    expectedResponseType: "single-choice",
    scoringStrategy: "objective-with-calibration",
    languageSensitivity: "low",
    confounds: ["numeracy", "education"],
    telemetry: telemetry({ confidence: true }),
    canonicalAnswerIds: ["cannot-determine-absolute"],
    difficultyDrivers: [
      "percentage framing",
      "missing starting values",
      "intuitive but invalid arithmetic shortcut",
    ],
  },
  {
    id: "reasoning-base-rate-01",
    dimension: "reasoning",
    subfacet: "baseRateReasoning",
    version: 1,
    status: "candidate",
    difficulty: "hard",
    taskFamily: "base-rate",
    cognitiveTarget:
      "Integrate a low base rate with an individually salient positive signal rather than overweighting the vivid signal.",
    scenarioBlueprint:
      "A rare system failure is screened by a moderately accurate detector; the user evaluates what a positive alert implies given prevalence.",
    expectedResponseType: "single-choice",
    scoringStrategy: "partial-credit",
    languageSensitivity: "low",
    confounds: ["numeracy", "education"],
    telemetry: telemetry({ confidence: true, revisions: true }),
    canonicalAnswerIds: ["base-rate-qualified"],
    difficultyDrivers: [
      "rare-event prevalence",
      "salient positive alert",
      "probabilistic distractors",
    ],
  },
  {
    id: "adaptive-rule-induction-01",
    dimension: "adaptiveLearning",
    subfacet: "ruleInduction",
    version: 1,
    status: "candidate",
    difficulty: "easy",
    taskFamily: "rule-change",
    cognitiveTarget:
      "Infer a stable transformation rule from a small set of unfamiliar symbolic examples.",
    scenarioBlueprint:
      "A fictional operator maps compact symbol-number pairs to outputs using a consistent hidden rule.",
    expectedResponseType: "numeric",
    scoringStrategy: "binary-correctness",
    languageSensitivity: "low",
    confounds: ["numeracy", "working-memory"],
    telemetry: telemetry({ revisions: true }),
    canonicalAnswerIds: ["rule-output-correct"],
    difficultyDrivers: [
      "number of examples",
      "rule complexity",
      "similarity of plausible alternative rules",
    ],
  },
  {
    id: "task-04-adaptive-rule",
    dimension: "adaptiveLearning",
    subfacet: "ruleRevision",
    version: 1,
    status: "production",
    difficulty: "medium",
    taskFamily: "rule-change",
    cognitiveTarget:
      "Update an inferred rule after an explicit environmental change and apply the revised mapping.",
    scenarioBlueprint:
      "RIN transformation is learned in Phase A, then replaced by a new mapping in Phase B.",
    expectedResponseType: "phased-numeric",
    scoringStrategy: "phase-weighted-adaptation",
    languageSensitivity: "low",
    confounds: ["numeracy", "working-memory"],
    telemetry: telemetry({
      phaseChanges: true,
      revisions: true,
      ruleUpdateErrors: true,
    }),
    canonicalAnswerIds: ["14", "15"],
    difficultyDrivers: [
      "rule discontinuity",
      "similarity between old and new mappings",
      "weight placed on post-update performance",
    ],
  },
  {
    id: "adaptive-interference-01",
    dimension: "adaptiveLearning",
    subfacet: "interferenceResistance",
    version: 1,
    status: "candidate",
    difficulty: "hard",
    taskFamily: "rule-change",
    cognitiveTarget:
      "Maintain a revised rule when later probes are designed to reactivate the previously learned rule.",
    scenarioBlueprint:
      "After an initial rule and an update, a third phase presents inputs where the obsolete rule produces especially tempting answers.",
    expectedResponseType: "phased-numeric",
    scoringStrategy: "phase-weighted-adaptation",
    languageSensitivity: "low",
    confounds: ["working-memory", "numeracy"],
    telemetry: telemetry({
      phaseChanges: true,
      revisions: true,
      ruleUpdateErrors: true,
    }),
    canonicalAnswerIds: ["phase-a-correct", "phase-b-correct", "phase-c-new-rule"],
    difficultyDrivers: [
      "old-rule lure strength",
      "delay between update and probe",
      "number of interference trials",
    ],
  },
  {
    id: "adaptive-feedback-01",
    dimension: "adaptiveLearning",
    subfacet: "adaptationAfterFeedback",
    version: 1,
    status: "candidate",
    difficulty: "medium",
    taskFamily: "rule-change",
    cognitiveTarget:
      "Use sparse outcome feedback to revise a working model without overreacting to a single observation.",
    scenarioBlueprint:
      "A fictional routing system gives limited success/failure feedback as the underlying criterion shifts once.",
    expectedResponseType: "phased-choice",
    scoringStrategy: "phase-weighted-adaptation",
    languageSensitivity: "medium",
    confounds: ["working-memory", "reading-speed"],
    telemetry: telemetry({
      confidence: true,
      revisions: true,
      phaseChanges: true,
      confidenceChange: true,
    }),
    canonicalAnswerIds: ["initial-policy", "revised-policy"],
    difficultyDrivers: [
      "feedback sparsity",
      "noise in outcomes",
      "timing of the rule change",
    ],
  },
  {
    id: "evidence-source-credibility-01",
    dimension: "evidenceEvaluation",
    subfacet: "sourceCredibility",
    version: 1,
    status: "candidate",
    difficulty: "medium",
    taskFamily: "source-comparison",
    cognitiveTarget:
      "Distinguish methodological transparency and relevant expertise from popularity or presentation quality.",
    scenarioBlueprint:
      "Four sources make the same technical claim but differ in methods, provenance, expertise, and popularity.",
    expectedResponseType: "ranking",
    scoringStrategy: "rank-distance",
    languageSensitivity: "medium",
    confounds: ["scientific-literacy", "digital-literacy"],
    telemetry: telemetry({
      confidence: true,
      rankingMovements: true,
    }),
    canonicalAnswerIds: ["methods-source", "expert-review", "opinion-post", "viral-clip"],
    difficultyDrivers: [
      "source prestige cues",
      "method transparency",
      "conflicting popularity signals",
    ],
  },
  {
    id: "task-03-evidence-evaluation",
    dimension: "evidenceEvaluation",
    subfacet: "studyDesignQuality",
    version: 1,
    status: "production",
    difficulty: "medium",
    taskFamily: "source-comparison",
    cognitiveTarget:
      "Weight study design, sample strength, independence, and null evidence when evaluating a strong empirical claim.",
    scenarioBlueprint:
      "Memory-supplement claim is accompanied by a viral video, manufacturer-funded small study, observational study, and large independent randomized trial.",
    expectedResponseType: "ranking",
    scoringStrategy: "rank-distance",
    languageSensitivity: "medium",
    confounds: ["scientific-literacy", "education"],
    telemetry: telemetry({
      confidence: true,
      rankingMovements: true,
    }),
    canonicalAnswerIds: [
      "rct",
      "observational-study",
      "manufacturer-study",
      "viral-video",
    ],
    difficultyDrivers: [
      "conflict between positive and null findings",
      "funding cue",
      "study-design hierarchy",
    ],
  },
  {
    id: "evidence-contradiction-01",
    dimension: "evidenceEvaluation",
    subfacet: "contradictoryEvidence",
    version: 1,
    status: "candidate",
    difficulty: "hard",
    taskFamily: "belief-revision",
    cognitiveTarget:
      "Revise an evidence judgment when a stronger independent source directly contradicts an initially plausible claim.",
    scenarioBlueprint:
      "Initial evidence moderately supports a product claim; a later preregistered replication with substantially greater power reports a null effect.",
    expectedResponseType: "phased-choice",
    scoringStrategy: "belief-revision-quality",
    languageSensitivity: "medium",
    confounds: ["scientific-literacy", "reading-speed"],
    telemetry: telemetry({
      confidence: true,
      revisions: true,
      beliefChange: true,
      confidenceChange: true,
      phaseChanges: true,
    }),
    canonicalAnswerIds: ["initial-tentative-support", "updated-low-support"],
    difficultyDrivers: [
      "initial evidence plausibility",
      "strength of contradictory evidence",
      "confidence anchoring",
    ],
  },
  {
    id: "evidence-independence-01",
    dimension: "evidenceEvaluation",
    subfacet: "independenceConflict",
    version: 1,
    status: "candidate",
    difficulty: "medium",
    taskFamily: "source-comparison",
    cognitiveTarget:
      "Recognize when apparently multiple confirming sources are not independent because they share funding, data, or origin.",
    scenarioBlueprint:
      "Five articles appear to confirm a safety claim, but several trace back to the same commissioned dataset and press release.",
    expectedResponseType: "multi-select",
    scoringStrategy: "evidence-selection-quality",
    languageSensitivity: "high",
    confounds: ["reading-speed", "scientific-literacy"],
    telemetry: telemetry({
      confidence: true,
      selectedEvidence: true,
      informationViews: true,
    }),
    canonicalAnswerIds: ["independent-audit", "independent-dataset"],
    difficultyDrivers: [
      "source duplication",
      "funding disclosure salience",
      "surface diversity of dependent sources",
    ],
  },
  {
    id: "filtering-signal-noise-01",
    dimension: "informationFiltering",
    subfacet: "signalVsNoise",
    version: 1,
    status: "candidate",
    difficulty: "medium",
    taskFamily: "signal-vs-noise",
    cognitiveTarget:
      "Extract decision-relevant indicators from a dense dashboard containing visually prominent but low-value metrics.",
    scenarioBlueprint:
      "An operations dashboard presents ten changes; only two distinguish a genuine capacity problem from normal demand variation.",
    expectedResponseType: "multi-select",
    scoringStrategy: "evidence-selection-quality",
    languageSensitivity: "low",
    confounds: ["digital-literacy", "numeracy"],
    telemetry: telemetry({
      confidence: true,
      selectedEvidence: true,
      informationViews: true,
    }),
    canonicalAnswerIds: ["queue-depth", "service-time"],
    difficultyDrivers: [
      "dashboard density",
      "visual salience of distractors",
      "number of plausible metrics",
    ],
  },
  {
    id: "filtering-relevance-01",
    dimension: "informationFiltering",
    subfacet: "relevanceSelection",
    version: 1,
    status: "candidate",
    difficulty: "easy",
    taskFamily: "signal-vs-noise",
    cognitiveTarget:
      "Select information that directly changes the decision while ignoring context that is descriptive but non-diagnostic.",
    scenarioBlueprint:
      "A service incident report mixes timeline detail, user comments, staffing facts, and two diagnostic system signals.",
    expectedResponseType: "multi-select",
    scoringStrategy: "evidence-selection-quality",
    languageSensitivity: "medium",
    confounds: ["reading-speed", "digital-literacy"],
    telemetry: telemetry({
      selectedEvidence: true,
      informationViews: true,
      revisions: true,
    }),
    canonicalAnswerIds: ["error-rate", "dependency-latency"],
    difficultyDrivers: [
      "amount of contextual detail",
      "semantic similarity between relevant and irrelevant facts",
    ],
  },
  {
    id: "filtering-salience-01",
    dimension: "informationFiltering",
    subfacet: "misleadingSalienceResistance",
    version: 1,
    status: "candidate",
    difficulty: "hard",
    taskFamily: "signal-vs-noise",
    cognitiveTarget:
      "Resist vivid, emotionally or visually salient information when quieter evidence has greater diagnostic value.",
    scenarioBlueprint:
      "A dramatic customer complaint and a striking chart spike compete with stable repeated measurements that better identify the underlying problem.",
    expectedResponseType: "single-choice",
    scoringStrategy: "objective-with-calibration",
    languageSensitivity: "high",
    confounds: ["reading-speed", "domain-familiarity"],
    telemetry: telemetry({
      confidence: true,
      informationViews: true,
      revisions: true,
    }),
    canonicalAnswerIds: ["diagnostic-pattern"],
    difficultyDrivers: [
      "vivid anecdote strength",
      "visual prominence",
      "subtlety of repeated evidence",
    ],
  },
  {
    id: "task-01-information-filtering",
    dimension: "informationFiltering",
    subfacet: "informationPrioritization",
    version: 1,
    status: "production",
    difficulty: "medium",
    taskFamily: "signal-vs-noise",
    cognitiveTarget:
      "Prioritize metrics that bear directly on the quality and sustainability of reported growth.",
    scenarioBlueprint:
      "A SaaS quarterly-metrics panel mixes attractive growth indicators with deteriorating operating margin and churn.",
    expectedResponseType: "multi-select",
    scoringStrategy: "evidence-selection-quality",
    languageSensitivity: "medium",
    confounds: ["finance-familiarity", "numeracy"],
    telemetry: telemetry({
      confidence: true,
      selectedEvidence: true,
    }),
    canonicalAnswerIds: ["operating-margin", "churn"],
    difficultyDrivers: [
      "positive headline metrics",
      "business-domain terminology",
      "requirement to prioritize exactly two signals",
    ],
  },
  {
    id: "metacog-uncertainty-01",
    dimension: "metacognitiveCalibration",
    subfacet: "uncertaintyRecognition",
    version: 1,
    status: "candidate",
    difficulty: "medium",
    taskFamily: "single-decision",
    cognitiveTarget:
      "Recognize when available evidence supports a range of possibilities rather than a single determinate conclusion.",
    scenarioBlueprint:
      "A prediction scenario contains useful evidence but omits one variable required to distinguish two plausible outcomes.",
    expectedResponseType: "single-choice",
    scoringStrategy: "objective-with-calibration",
    languageSensitivity: "medium",
    confounds: ["reading-speed", "education"],
    telemetry: telemetry({ confidence: true, revisions: true }),
    canonicalAnswerIds: ["uncertain-range"],
    difficultyDrivers: [
      "plausibility of forced-choice answers",
      "subtle missing variable",
      "confidence trap",
    ],
  },
  {
    id: "metacog-confidence-01",
    dimension: "metacognitiveCalibration",
    subfacet: "confidenceCalibration",
    version: 1,
    status: "candidate",
    difficulty: "medium",
    taskFamily: "confidence-calibration",
    cognitiveTarget:
      "Align expressed confidence with the strength of evidence across several decisions of deliberately unequal certainty.",
    scenarioBlueprint:
      "A compact sequence mixes two high-certainty, one ambiguous, and one weak-evidence judgment while collecting confidence after each.",
    expectedResponseType: "confidence-pair",
    scoringStrategy: "objective-with-calibration",
    languageSensitivity: "medium",
    confounds: ["reading-speed", "working-memory"],
    telemetry: telemetry({
      confidence: true,
      revisions: true,
      confidenceChange: true,
    }),
    canonicalAnswerIds: [
      "high-certainty-a",
      "ambiguous-b",
      "weak-evidence-c",
      "high-certainty-d",
    ],
    difficultyDrivers: [
      "variation in evidence strength",
      "temptation to use constant confidence",
      "close distractors",
    ],
  },
  {
    id: "task-05-missing-information",
    dimension: "metacognitiveCalibration",
    subfacet: "insufficientInformationDetection",
    version: 1,
    status: "production",
    difficulty: "easy",
    taskFamily: "single-decision",
    cognitiveTarget:
      "Decline to infer an ordering that cannot be established from the stated relations.",
    scenarioBlueprint:
      "Two known height relations provide no information linking Taylor to the ordered set.",
    expectedResponseType: "single-choice",
    scoringStrategy: "objective-with-calibration",
    languageSensitivity: "low",
    confounds: ["language-proficiency"],
    telemetry: telemetry({ confidence: true }),
    canonicalAnswerIds: ["insufficient"],
    difficultyDrivers: [
      "pressure to choose a named person",
      "simple surface structure masking missing relation",
    ],
  },
  {
    id: "metacog-belief-revision-01",
    dimension: "metacognitiveCalibration",
    subfacet: "beliefRevision",
    version: 1,
    status: "candidate",
    difficulty: "hard",
    taskFamily: "belief-revision",
    cognitiveTarget:
      "Update both judgment and confidence proportionally when substantially stronger evidence arrives.",
    scenarioBlueprint:
      "An initial small but credible dataset supports Option A; a later larger independent preregistered dataset favors Option B.",
    expectedResponseType: "phased-choice",
    scoringStrategy: "belief-revision-quality",
    languageSensitivity: "medium",
    confounds: ["scientific-literacy", "reading-speed"],
    telemetry: telemetry({
      confidence: true,
      revisions: true,
      beliefChange: true,
      confidenceChange: true,
      phaseChanges: true,
    }),
    canonicalAnswerIds: ["initial-a-tentative", "updated-b"],
    difficultyDrivers: [
      "initial commitment strength",
      "new evidence magnitude",
      "confidence adjustment requirement",
    ],
  },
  {
    id: "transfer-abstraction-01",
    dimension: "knowledgeTransfer",
    subfacet: "principleAbstraction",
    version: 1,
    status: "candidate",
    difficulty: "medium",
    taskFamily: "knowledge-transfer",
    cognitiveTarget:
      "Extract a general relational principle from a concrete example without retaining irrelevant surface details.",
    scenarioBlueprint:
      "A scheduling example demonstrates buffering a bottleneck; the user identifies which abstract principle best captures why it works.",
    expectedResponseType: "single-choice",
    scoringStrategy: "transfer-quality",
    languageSensitivity: "medium",
    confounds: ["reading-speed", "education"],
    telemetry: telemetry({ confidence: true }),
    canonicalAnswerIds: ["protect-bottleneck"],
    difficultyDrivers: [
      "similar surface descriptions",
      "abstraction distance",
      "plausible but overly specific principles",
    ],
  },
  {
    id: "transfer-cross-domain-01",
    dimension: "knowledgeTransfer",
    subfacet: "crossDomainTransfer",
    version: 1,
    status: "candidate",
    difficulty: "hard",
    taskFamily: "knowledge-transfer",
    cognitiveTarget:
      "Apply an acquired structural principle in a domain with different vocabulary, objects, and goals.",
    scenarioBlueprint:
      "A principle learned through network traffic must be applied to patient-flow scheduling without shared surface terms.",
    expectedResponseType: "single-choice",
    scoringStrategy: "transfer-quality",
    languageSensitivity: "medium",
    confounds: ["domain-familiarity", "reading-speed"],
    telemetry: telemetry({ confidence: true, revisions: true }),
    canonicalAnswerIds: ["redistribute-nonurgent-demand"],
    difficultyDrivers: [
      "surface-domain distance",
      "absence of keyword overlap",
      "strong domain-specific distractor",
    ],
  },
  {
    id: "transfer-structural-analogy-01",
    dimension: "knowledgeTransfer",
    subfacet: "structuralAnalogy",
    version: 1,
    status: "candidate",
    difficulty: "hard",
    taskFamily: "knowledge-transfer",
    cognitiveTarget:
      "Match systems by relational structure rather than by superficial category similarity.",
    scenarioBlueprint:
      "Four candidate systems are compared with a source system; only one shares the same dependency and constraint relationships.",
    expectedResponseType: "single-choice",
    scoringStrategy: "transfer-quality",
    languageSensitivity: "medium",
    confounds: ["working-memory", "education"],
    telemetry: telemetry({ confidence: true }),
    canonicalAnswerIds: ["structural-match"],
    difficultyDrivers: [
      "surface similarity lure",
      "number of relational elements",
      "working-memory load",
    ],
  },
  {
    id: "task-06-knowledge-transfer",
    dimension: "knowledgeTransfer",
    subfacet: "applicationUnderConstraints",
    version: 1,
    status: "production",
    difficulty: "medium",
    taskFamily: "knowledge-transfer",
    cognitiveTarget:
      "Apply a demand-redistribution principle to a new constrained system where adding capacity is unavailable.",
    scenarioBlueprint:
      "A digital service overloaded at a predictable peak must improve performance without purchasing new servers.",
    expectedResponseType: "single-choice",
    scoringStrategy: "transfer-quality",
    languageSensitivity: "medium",
    confounds: ["digital-literacy", "reading-speed"],
    telemetry: telemetry(),
    canonicalAnswerIds: ["shift-load"],
    difficultyDrivers: [
      "constraint preservation",
      "surface plausibility of non-solutions",
      "transfer from principle to action",
    ],
  },
];

export const productionTaskBankEntries = researchTaskBank.filter(
  (task) => task.status === "production",
);

export const candidateTaskBankEntries = researchTaskBank.filter(
  (task) => task.status === "candidate",
);

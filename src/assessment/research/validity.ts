import type { ExternalValidityTarget, ResearchTaskRecord } from "./types";

export const plannedFactorModels = [
  "one-general-factor",
  "six-correlated-factors",
  "higher-order-general-plus-six",
  "bifactor",
] as const;

export const externalValidityTargets: ExternalValidityTarget[] = [
  {
    construct: "reasoning",
    comparator: "Established reasoning measures",
    expectedDirection: "positive",
    status: "planned",
  },
  {
    construct: "metacognitive-calibration",
    comparator: "Confidence–accuracy calibration measures",
    expectedDirection: "positive",
    status: "planned",
  },
  {
    construct: "adaptive-learning",
    comparator: "Probabilistic learning or rule-switching paradigms",
    expectedDirection: "positive",
    status: "planned",
  },
  {
    construct: "evidence-evaluation",
    comparator: "Scientific reasoning or actively open-minded thinking measures",
    expectedDirection: "positive",
    status: "planned",
  },
  {
    construct: "incremental-validity",
    comparator:
      "Traditional cognitive measures when predicting evidence judgment, misinformation detection, complex decisions, or adaptive performance",
    expectedDirection: "positive",
    status: "planned",
  },
];

export type IrtReadiness = {
  readyForModelSelection: boolean;
  reasons: string[];
  candidateModels: Array<
    "Rasch/1PL" | "2PL" | "graded-response" | "partial-credit"
  >;
};

export function assessIrtReadiness(
  records: ResearchTaskRecord[],
  minimumCompletedParticipants = 300,
): IrtReadiness {
  const completedParticipants = new Set(
    records
      .filter((record) => record.completionStatus === "completed")
      .map((record) => record.participantId),
  ).size;
  const reasons: string[] = [];

  if (completedParticipants < minimumCompletedParticipants) {
    reasons.push("Insufficient completed-participant count for the planning threshold.");
  }

  if (new Set(records.map((record) => record.taskId)).size < 10) {
    reasons.push("Too few represented items for a useful item-bank model.");
  }

  reasons.push(
    "Dimensionality, local independence, item count, and model fit still require statistical assessment outside this TypeScript layer.",
  );

  return {
    readyForModelSelection: false,
    reasons,
    candidateModels: [
      "Rasch/1PL",
      "2PL",
      "graded-response",
      "partial-credit",
    ],
  };
}

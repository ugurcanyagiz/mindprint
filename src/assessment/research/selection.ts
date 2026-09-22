import type {
  CandidateDispositionStatus,
  ItemReview,
} from "./types";

export function initialDispositionForTask(
  implementedInExperimentalBattery: boolean,
): CandidateDispositionStatus {
  return implementedInExperimentalBattery ? "pilot" : "draft";
}

export function createItemReview(
  taskId: string,
  disposition: CandidateDispositionStatus = "pilot",
): ItemReview {
  if (disposition === "retain" || disposition === "retire") {
    throw new Error(
      "Retain/retire dispositions require empirical and human review and cannot be initialized automatically.",
    );
  }

  return {
    taskId,
    psychometricSignal: null,
    completionQuality: null,
    redundancy: null,
    fairnessRisk: null,
    languageRisk: null,
    usabilityRisk: null,
    constructCoverage: null,
    disposition,
    manualReviewRequired: true,
    notes: [],
  };
}

export function hasAutomaticFinalDecision(_review: ItemReview): false {
  return false;
}

import {
  researchCompletionStatuses,
  type ResearchTaskRecord,
} from "./types";

export type ResearchRecordValidation = {
  valid: boolean;
  errors: string[];
};

export function validateResearchTaskRecord(
  record: ResearchTaskRecord,
): ResearchRecordValidation {
  const errors: string[] = [];

  if (!record.participantId.trim()) errors.push("participantId is required");
  if (!record.studyVersion.trim()) errors.push("studyVersion is required");
  if (!record.taskId.trim()) errors.push("taskId is required");
  if (!researchCompletionStatuses.includes(record.completionStatus)) {
    errors.push("completionStatus is invalid");
  }
  if (record.durationMs !== null && record.durationMs < 0) {
    errors.push("durationMs cannot be negative");
  }

  for (const phase of record.phaseResponses) {
    if (
      phase.confidence !== null &&
      (phase.confidence < 0 || phase.confidence > 100)
    ) {
      errors.push(`confidence out of bounds for phase ${phase.phaseId}`);
    }
    if (phase.durationMs !== null && phase.durationMs < 0) {
      errors.push(`negative duration for phase ${phase.phaseId}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

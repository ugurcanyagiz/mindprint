import { mean, median, proportion } from "./metrics";
import type {
  FairnessGroupKey,
  FairnessGroupSummary,
  ResearchParticipantContext,
  ResearchTaskRecord,
} from "./types";

function valueFor(
  participant: ResearchParticipantContext,
  key: FairnessGroupKey,
): string | undefined {
  const value = participant[key];
  return typeof value === "string" ? value : undefined;
}

export function summarizeFairnessGroups(
  records: ResearchTaskRecord[],
  participants: ResearchParticipantContext[],
  key: FairnessGroupKey,
): FairnessGroupSummary[] {
  const participantById = new Map(
    participants.map((participant) => [participant.participantId, participant]),
  );
  const groups = new Map<string, ResearchTaskRecord[]>();

  for (const record of records) {
    const participant = participantById.get(record.participantId);
    const group = participant ? valueFor(participant, key) : undefined;
    if (!group) continue;
    const bucket = groups.get(group) ?? [];
    bucket.push(record);
    groups.set(group, bucket);
  }

  return [...groups.entries()].map(([group, groupRecords]) => {
    const groupParticipants = new Set(
      groupRecords.map((record) => record.participantId),
    );
    const completed = groupRecords.filter(
      (record) => record.completionStatus === "completed",
    );
    const objectives = completed.flatMap((record) =>
      record.phaseResponses.flatMap((phase) =>
        phase.objectiveQuality === null ? [] : [phase.objectiveQuality],
      ),
    );
    const confidences = completed.flatMap((record) =>
      record.phaseResponses.flatMap((phase) =>
        phase.confidence === null ? [] : [phase.confidence],
      ),
    );
    const durations = completed.flatMap((record) =>
      record.durationMs === null || record.durationMs < 0
        ? []
        : [record.durationMs],
    );

    return {
      group,
      nParticipants: groupParticipants.size,
      nRecords: groupRecords.length,
      completionRate: proportion(completed.length, groupRecords.length),
      objectiveMean: mean(objectives),
      confidenceMean: mean(confidences),
      medianDurationMs: median(durations),
    };
  });
}

export const fairnessInterpretationGuardrails = [
  "A group mean difference is not, by itself, evidence of bias.",
  "A DIF flag is not, by itself, proof of unfairness.",
  "Language, device, education, digital literacy, and AI familiarity should be examined as potential measurement-context effects.",
] as const;

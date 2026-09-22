import type {
  ParticipantExclusionDecision,
  ResearchDataIssue,
  ResearchTaskRecord,
} from "./types";

export function detectResearchDataIssues(
  records: ResearchTaskRecord[],
): ResearchDataIssue[] {
  const issues: ResearchDataIssue[] = [];
  const seen = new Set<string>();

  for (const record of records) {
    const key = `${record.participantId}::${record.taskId}`;

    if (seen.has(key)) {
      issues.push({
        type: "duplicate-record",
        participantId: record.participantId,
        taskId: record.taskId,
      });
    }
    seen.add(key);

    if (record.durationMs !== null && record.durationMs < 0) {
      issues.push({
        type: "invalid-duration",
        participantId: record.participantId,
        taskId: record.taskId,
      });
    }

    if (!record.participantId || !record.taskId || !record.studyVersion) {
      issues.push({
        type: "corrupted-record",
        participantId: record.participantId,
        taskId: record.taskId,
        reason: "Missing required identifier.",
      });
    }
  }

  return issues;
}

export function applyExplicitExclusionRules(
  participantIds: string[],
  issues: ResearchDataIssue[],
): ParticipantExclusionDecision[] {
  return participantIds.map((participantId) => {
    const relevant = issues.filter(
      (issue) => issue.participantId === participantId,
    );
    const corrupted = relevant.filter(
      (issue) => issue.type === "corrupted-record",
    );

    return {
      participantId,
      excluded: corrupted.length > 0,
      reasons: corrupted.map((issue) =>
        issue.type === "corrupted-record" ? issue.reason : "",
      ),
      ruleIds: corrupted.map(() => "exclude-corrupted-required-identifiers"),
    };
  });
}

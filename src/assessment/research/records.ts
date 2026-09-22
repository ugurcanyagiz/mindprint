import {
  scoreExperimentalPhase,
} from "../experimental/evaluation";
import type {
  ExperimentalTask,
  ExperimentalTaskResponse,
} from "../experimental/types";
import { researchTaskBank } from "../task-bank/bank";
import type {
  ResearchParticipantContext,
  ResearchTaskRecord,
} from "./types";

function durationMs(startedAt: string | null, completedAt: string | null) {
  if (!startedAt || !completedAt) return null;
  const value =
    new Date(completedAt).getTime() - new Date(startedAt).getTime();
  return Number.isFinite(value) ? value : null;
}

export function toResearchTaskRecord(
  participant: ResearchParticipantContext,
  task: ExperimentalTask,
  response: ExperimentalTaskResponse,
  source: "synthetic" | "pilot" = "pilot",
): ResearchTaskRecord {
  const metadata = researchTaskBank.find((item) => item.id === task.id);

  if (!metadata) {
    throw new Error(`Research task metadata not found for ${task.id}`);
  }

  const phaseResponses = task.phases.map((phase, index) => {
    const phaseResponse = response.phases[index];

    return {
      phaseId: phase.id,
      answer: phaseResponse?.answer ?? null,
      confidence: phaseResponse?.confidence ?? null,
      objectiveQuality: phaseResponse
        ? scoreExperimentalPhase(phase, phaseResponse)
        : null,
      revisions: phaseResponse?.revisions ?? 0,
      startedAt: phaseResponse?.startedAt ?? null,
      completedAt: phaseResponse?.completedAt ?? null,
      durationMs: durationMs(
        phaseResponse?.startedAt ?? null,
        phaseResponse?.completedAt ?? null,
      ),
    };
  });

  const first = phaseResponses[0];
  const last = phaseResponses.at(-1);
  const selectedEvidence = phaseResponses.flatMap((phase) =>
    Array.isArray(phase.answer) ? phase.answer : [],
  );

  return {
    participantId: participant.participantId,
    studyVersion: participant.studyVersion,
    taskId: task.id,
    taskVersion: metadata.version,
    dimension: metadata.dimension,
    subfacet: metadata.subfacet,
    language: participant.assessmentLanguage,
    completionStatus:
      response.phases.length === task.phases.length
        ? "completed"
        : "incomplete-phase",
    startedAt: response.startedAt,
    completedAt: response.completedAt,
    durationMs: durationMs(response.startedAt, response.completedAt),
    phaseResponses,
    revisions: phaseResponses.reduce(
      (sum, phase) => sum + phase.revisions,
      0,
    ),
    selectedEvidence,
    rankingMovements: null,
    initialAnswer: first?.answer ?? null,
    revisedAnswer:
      phaseResponses.length > 1 ? last?.answer ?? null : null,
    initialConfidence: first?.confidence ?? null,
    revisedConfidence:
      phaseResponses.length > 1 ? last?.confidence ?? null : null,
    beliefChanged: response.beliefChanged ?? null,
    confidenceDelta: response.confidenceDelta ?? null,
    source,
  };
}

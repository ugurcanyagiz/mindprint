import {
  experimentalTasks,
} from "../../experimental/tasks";
import type {
  ExperimentalPhase,
  ExperimentalTask,
  ExperimentalTaskResponse,
} from "../../experimental/types";
import { toResearchTaskRecord } from "../records";
import type {
  ResearchDataset,
  ResearchParticipantContext,
} from "../types";

export const syntheticParticipants: ResearchParticipantContext[] = [
  {
    participantId: "synthetic-001",
    studyVersion: "synthetic-fixture-0.1",
    assessmentLanguage: "en",
    ageBand: "25-34",
    educationBand: "college",
    primaryLanguage: "en",
    digitalUseFrequency: "daily",
    aiUseFrequency: "weekly",
    deviceClass: "desktop",
    consentVersion: "synthetic-not-consent",
  },
  {
    participantId: "synthetic-002",
    studyVersion: "synthetic-fixture-0.1",
    assessmentLanguage: "tr",
    ageBand: "35-44",
    educationBand: "graduate",
    primaryLanguage: "tr",
    digitalUseFrequency: "daily",
    aiUseFrequency: "daily",
    deviceClass: "mobile",
    consentVersion: "synthetic-not-consent",
  },
  {
    participantId: "synthetic-003",
    studyVersion: "synthetic-fixture-0.1",
    assessmentLanguage: "es",
    ageBand: "25-34",
    educationBand: "college",
    primaryLanguage: "es",
    digitalUseFrequency: "weekly",
    aiUseFrequency: "rare",
    deviceClass: "tablet",
    consentVersion: "synthetic-not-consent",
  },
];

function wrongAnswer(phase: ExperimentalPhase): string | string[] {
  if (Array.isArray(phase.answerKey)) {
    if (phase.response.kind === "multi-select") {
      const wrong = phase.response.items
        .map((item) => item.id)
        .filter((id) => !phase.answerKey.includes(id))
        .slice(0, Math.max(1, phase.response.selectionLimit));
      return wrong.length > 0 ? wrong : ["synthetic-wrong"];
    }
    return ["synthetic-wrong"];
  }

  if (phase.response.kind === "single-choice") {
    return (
      phase.response.options.find((option) => option.id !== phase.answerKey)
        ?.id ?? "synthetic-wrong"
    );
  }

  const numeric = Number(phase.answerKey);
  return Number.isFinite(numeric) ? String(numeric + 1) : "synthetic-wrong";
}

function responseFor(
  task: ExperimentalTask,
  participantIndex: number,
): ExperimentalTaskResponse {
  const participantCorrect = participantIndex !== 1;
  const baseMinute = participantIndex * 10;

  const phases = task.phases.map((phase, phaseIndex) => {
    const start = new Date(
      Date.UTC(2026, 8, 22, 12, baseMinute + phaseIndex * 2, 0),
    );
    const end = new Date(start.getTime() + 45000 + phaseIndex * 5000);
    const answer = participantCorrect
      ? Array.isArray(phase.answerKey)
        ? [...phase.answerKey]
        : phase.answerKey
      : wrongAnswer(phase);

    return {
      phaseId: phase.id,
      answer,
      confidence: phase.confidenceRequired
        ? participantCorrect
          ? 90
          : 75
        : undefined,
      revisions: participantIndex === 2 ? 1 : 0,
      startedAt: start.toISOString(),
      completedAt: end.toISOString(),
    };
  });

  const first = phases[0];
  const last = phases.at(-1)!;

  return {
    taskId: task.id,
    phases,
    startedAt: first.startedAt,
    completedAt: last.completedAt,
    phaseHistory: phases.map((phase) => ({
      phaseId: phase.phaseId,
      enteredAt: phase.startedAt,
    })),
    beliefChanged:
      task.phases.length > 1 &&
      typeof first.answer === "string" &&
      typeof last.answer === "string"
        ? first.answer !== last.answer
        : undefined,
    confidenceDelta:
      first.confidence !== undefined && last.confidence !== undefined
        ? last.confidence - first.confidence
        : undefined,
  };
}

export const syntheticResearchDataset: ResearchDataset = {
  source: "synthetic",
  participants: syntheticParticipants,
  records: syntheticParticipants.flatMap((participant, participantIndex) =>
    experimentalTasks.map((task) =>
      toResearchTaskRecord(
        participant,
        task,
        responseFor(task, participantIndex),
        "synthetic",
      ),
    ),
  ),
};

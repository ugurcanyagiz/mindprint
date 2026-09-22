import { describe, expect, it } from "vitest";

import { ASSESSMENT_SESSION_KEY } from "../session";
import { assessmentTasks } from "../tasks";
import {
  candidateTaskBankEntries,
  researchTaskBank,
} from "../task-bank/bank";
import { cognitiveDimensions } from "../types";
import {
  evaluateExperimentalTask,
  scoreExperimentalPhase,
} from "./evaluation";
import {
  EXPERIMENTAL_SESSION_KEY,
  beginExperimentalSession,
  clampConfidence,
  createExperimentalSession,
  submitExperimentalPhase,
  toggleExperimentalSelection,
  updateExperimentalConfidence,
  updateExperimentalDraft,
} from "./session";
import {
  EXPERIMENTAL_TASK_COUNT,
  experimentalTaskIds,
  experimentalTasks,
} from "./tasks";
import type {
  ExperimentalPhaseResponse,
  ExperimentalTask,
  ExperimentalTaskResponse,
} from "./types";

function answerFor(task: ExperimentalTask, phaseIndex: number) {
  const key = task.phases[phaseIndex].answerKey;
  return Array.isArray(key) ? [...key] : key;
}

function perfectResponse(task: ExperimentalTask): ExperimentalTaskResponse {
  const phases: ExperimentalPhaseResponse[] = task.phases.map(
    (phase, index) => ({
      phaseId: phase.id,
      answer: answerFor(task, index),
      confidence: phase.confidenceRequired ? 100 : undefined,
      revisions: 0,
      startedAt: "2026-09-22T00:00:00.000Z",
      completedAt: "2026-09-22T00:01:00.000Z",
    }),
  );

  return {
    taskId: task.id,
    phases,
    startedAt: phases[0].startedAt,
    completedAt: phases.at(-1)!.completedAt,
    phaseHistory: task.phases.map((phase) => ({
      phaseId: phase.id,
      enteredAt: "2026-09-22T00:00:00.000Z",
    })),
  };
}

describe("experimental battery selection", () => {
  it("contains exactly 12 implemented research tasks", () => {
    expect(EXPERIMENTAL_TASK_COUNT).toBe(12);
    expect(experimentalTasks).toHaveLength(12);
    expect(new Set(experimentalTaskIds).size).toBe(12);
  });

  it("uses only candidate IDs from the authoritative research bank", () => {
    const candidateIds = new Set(
      candidateTaskBankEntries.map((task) => task.id),
    );

    for (const id of experimentalTaskIds) {
      expect(candidateIds.has(id)).toBe(true);
    }
  });

  it("selects two tasks from every cognitive dimension", () => {
    const bankById = new Map(
      researchTaskBank.map((task) => [task.id, task]),
    );

    for (const dimension of cognitiveDimensions) {
      const count = experimentalTaskIds.filter(
        (id) => bankById.get(id)?.dimension === dimension,
      ).length;
      expect(count).toBe(2);
    }
  });

  it("keeps the production assessment at six tasks", () => {
    expect(assessmentTasks).toHaveLength(6);
  });

  it("keeps response identifiers unique inside each phase", () => {
    for (const task of experimentalTasks) {
      for (const phase of task.phases) {
        const ids =
          phase.response.kind === "single-choice"
            ? phase.response.options.map((option) => option.id)
            : phase.response.kind === "multi-select"
              ? phase.response.items.map((item) => item.id)
              : [];

        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  });
});

describe("experimental session behavior", () => {
  it("uses a storage key isolated from production", () => {
    expect(EXPERIMENTAL_SESSION_KEY).not.toBe(ASSESSMENT_SESSION_KEY);
  });

  it("bounds confidence values", () => {
    expect(clampConfidence(-25)).toBe(0);
    expect(clampConfidence(55.4)).toBe(55);
    expect(clampConfidence(140)).toBe(100);

    const started = beginExperimentalSession(
      createExperimentalSession(),
      experimentalTasks,
    );
    expect(
      updateExperimentalConfidence(started, 200).currentTaskState?.confidence,
    ).toBe(100);
  });

  it("preserves completed phase state when advancing through belief revision", () => {
    const task = experimentalTasks.find(
      (candidate) => candidate.id === "evidence-contradiction-01",
    )!;

    let session = beginExperimentalSession(
      createExperimentalSession(),
      [task],
    );

    session = updateExperimentalDraft(
      session,
      task.phases[0].answerKey as string,
    );
    session = updateExperimentalConfidence(session, 70);
    session = submitExperimentalPhase(session, [task]);

    expect(session.currentTaskState?.phaseIndex).toBe(1);
    expect(session.currentTaskState?.completedPhases).toHaveLength(1);
    expect(session.currentTaskState?.completedPhases[0].answer).toBe(
      "tentative-support",
    );
    expect(session.currentTaskState?.completedPhases[0].confidence).toBe(70);
  });

  it("keeps the rule-interference phase order", () => {
    const task = experimentalTasks.find(
      (candidate) => candidate.id === "adaptive-interference-01",
    )!;

    expect(task.phases.map((phase) => phase.id)).toEqual([
      "rule-a",
      "rule-b",
      "interference",
    ]);
  });

  it("never creates duplicate evidence selections", () => {
    let selected: string[] = [];
    selected = toggleExperimentalSelection(selected, "a", 2);
    selected = toggleExperimentalSelection(selected, "a", 2);
    selected = toggleExperimentalSelection(selected, "a", 2);

    expect(selected).toEqual(["a"]);
    expect(new Set(selected).size).toBe(selected.length);
  });

  it("only completes after all 12 tasks are submitted", () => {
    let session = beginExperimentalSession(
      createExperimentalSession(),
      experimentalTasks,
    );

    for (let taskIndex = 0; taskIndex < experimentalTasks.length; taskIndex++) {
      const task = experimentalTasks[taskIndex];

      for (let phaseIndex = 0; phaseIndex < task.phases.length; phaseIndex++) {
        session = updateExperimentalDraft(
          session,
          answerFor(task, phaseIndex),
        );
        session = submitExperimentalPhase(session, experimentalTasks);

        if (
          taskIndex < experimentalTasks.length - 1 ||
          phaseIndex < task.phases.length - 1
        ) {
          expect(session.status).toBe("in_progress");
        }
      }
    }

    expect(session.status).toBe("completed");
    expect(session.responses).toHaveLength(12);
  });
});

describe("experimental diagnostics", () => {
  it("returns bounded diagnostics for every task", () => {
    for (const task of experimentalTasks) {
      const diagnostic = evaluateExperimentalTask(
        task,
        perfectResponse(task),
      );

      for (const value of [
        diagnostic.objectiveQuality,
        diagnostic.calibrationQuality,
        diagnostic.revisionQuality,
        diagnostic.evidenceSelectionQuality,
      ]) {
        if (value !== null) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        }
      }
    }
  });

  it("gives full phase quality to canonical responses", () => {
    for (const task of experimentalTasks) {
      const response = perfectResponse(task);

      task.phases.forEach((phase, index) => {
        expect(scoreExperimentalPhase(phase, response.phases[index])).toBe(1);
      });
    }
  });
});

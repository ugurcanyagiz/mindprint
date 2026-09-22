import { describe, expect, it } from "vitest";

import { supportedLocales } from "../i18n/config";
import { scoreTask } from "./scoring";
import { getLocalizedAssessmentTasks } from "./localization";
import { assessmentTasks } from "./tasks";
import type { AssessmentResponse, AssessmentTask } from "./types";

function scoringSignature(task: AssessmentTask) {
  switch (task.kind) {
    case "multi-select":
    case "ranking":
      return JSON.stringify(task.answerKey);
    case "adaptive-rule":
      return JSON.stringify({
        phaseA: task.phaseA.answerKey,
        phaseB: task.phaseB.answerKey,
        weights: task.scoringMeta,
      });
    case "single-choice":
      return task.answerKey;
  }
}

function response(
  taskId: string,
  answer: unknown,
  confidence?: number,
): AssessmentResponse {
  return {
    taskId,
    answer,
    confidence,
    startedAt: "2026-09-22T00:00:00.000Z",
    completedAt: "2026-09-22T00:01:00.000Z",
  };
}

const responses = new Map<string, AssessmentResponse>([
  [
    "task-01-information-filtering",
    response(
      "task-01-information-filtering",
      ["operating-margin", "churn"],
      90,
    ),
  ],
  [
    "task-02-reasoning",
    response("task-02-reasoning", "insufficient", 80),
  ],
  [
    "task-03-evidence-evaluation",
    response(
      "task-03-evidence-evaluation",
      [
        "rct",
        "observational-study",
        "manufacturer-study",
        "viral-video",
      ],
      85,
    ),
  ],
  [
    "task-04-adaptive-rule",
    response("task-04-adaptive-rule", { phaseA: "14", phaseB: "15" }),
  ],
  [
    "task-05-missing-information",
    response("task-05-missing-information", "insufficient", 75),
  ],
  [
    "task-06-knowledge-transfer",
    response("task-06-knowledge-transfer", "shift-load"),
  ],
]);

describe("assessment localization", () => {
  it("loads all six tasks in every supported locale", () => {
    for (const locale of supportedLocales) {
      const localized = getLocalizedAssessmentTasks(locale);
      expect(localized).toHaveLength(assessmentTasks.length);
      expect(localized.map((task) => task.id)).toEqual(
        assessmentTasks.map((task) => task.id),
      );
    }
  });

  it("never changes answer keys or scoring metadata", () => {
    const canonical = assessmentTasks.map(scoringSignature);

    for (const locale of supportedLocales) {
      expect(
        getLocalizedAssessmentTasks(locale).map(scoringSignature),
      ).toEqual(canonical);
    }
  });

  it("produces identical task scores for identical responses in every language", () => {
    const baseline = getLocalizedAssessmentTasks("en").map((task) =>
      scoreTask(task, responses.get(task.id)),
    );

    for (const locale of supportedLocales) {
      const localizedScores = getLocalizedAssessmentTasks(locale).map((task) =>
        scoreTask(task, responses.get(task.id)),
      );

      expect(localizedScores).toEqual(baseline);
    }
  });
});

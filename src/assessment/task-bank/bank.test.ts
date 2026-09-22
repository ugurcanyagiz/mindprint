import { describe, expect, it } from "vitest";

import { supportedLocales } from "../../i18n/config";
import { getAssessmentLocaleContent } from "../localization";
import { assessmentTasks } from "../tasks";
import {
  cognitiveDimensions,
  type AssessmentTask,
} from "../types";
import {
  candidateTaskBankEntries,
  productionTaskBankEntries,
  researchTaskBank,
} from "./bank";
import {
  confoundTypes,
  dimensionSubfacets,
  expectedResponseTypes,
  languageSensitivities,
  scoringStrategies,
  taskDifficulties,
  taskFamilies,
} from "./types";

function productionAnswerIds(task: AssessmentTask): string[] {
  switch (task.kind) {
    case "multi-select":
    case "ranking":
      return [...task.answerKey];
    case "adaptive-rule":
      return [task.phaseA.answerKey, task.phaseB.answerKey];
    case "single-choice":
      return [task.answerKey];
  }
}

describe("research task bank", () => {
  it("contains 24 unique definitions across the six dimensions", () => {
    expect(researchTaskBank).toHaveLength(24);
    expect(new Set(researchTaskBank.map((task) => task.id)).size).toBe(24);

    for (const dimension of cognitiveDimensions) {
      expect(
        researchTaskBank.filter((task) => task.dimension === dimension),
      ).toHaveLength(4);
    }
  });

  it("covers every declared subfacet exactly once in the initial bank", () => {
    for (const dimension of cognitiveDimensions) {
      const expected = [...dimensionSubfacets[dimension]].sort();
      const actual = researchTaskBank
        .filter((task) => task.dimension === dimension)
        .map((task) => task.subfacet)
        .sort();

      expect(actual).toEqual(expected);
    }
  });

  it("uses only valid metadata values and complete research metadata", () => {
    for (const task of researchTaskBank) {
      expect(cognitiveDimensions).toContain(task.dimension);
      expect(
        (dimensionSubfacets[task.dimension] as readonly string[]).includes(
          task.subfacet,
        ),
      ).toBe(true);
      expect(taskDifficulties).toContain(task.difficulty);
      expect(taskFamilies).toContain(task.taskFamily);
      expect(expectedResponseTypes).toContain(task.expectedResponseType);
      expect(scoringStrategies).toContain(task.scoringStrategy);
      expect(languageSensitivities).toContain(task.languageSensitivity);
      expect(task.cognitiveTarget.trim().length).toBeGreaterThan(20);
      expect(task.scenarioBlueprint.trim().length).toBeGreaterThan(20);
      expect(task.difficultyDrivers.length).toBeGreaterThan(0);
      expect(task.canonicalAnswerIds.length).toBeGreaterThan(0);
      expect(new Set(task.canonicalAnswerIds).size).toBe(
        task.canonicalAnswerIds.length,
      );

      for (const confound of task.confounds) {
        expect(confoundTypes).toContain(confound);
      }

      expect(task.telemetry.answer).toBe(true);
      expect(typeof task.telemetry.responseTime).toBe("boolean");
      expect(typeof task.telemetry.confidence).toBe("boolean");
      expect(typeof task.telemetry.revisions).toBe("boolean");
      expect(typeof task.telemetry.phaseChanges).toBe("boolean");
    }
  });

  it("keeps exactly the current six tasks in the production short form", () => {
    expect(productionTaskBankEntries).toHaveLength(6);
    expect(candidateTaskBankEntries).toHaveLength(18);

    expect(
      productionTaskBankEntries.map((task) => task.id).sort(),
    ).toEqual(assessmentTasks.map((task) => task.id).sort());

    expect(assessmentTasks).toHaveLength(6);
  });

  it("keeps production canonical answer identifiers aligned with scoring tasks", () => {
    const productionById = new Map(
      productionTaskBankEntries.map((task) => [task.id, task]),
    );

    for (const task of assessmentTasks) {
      expect(productionById.get(task.id)?.canonicalAnswerIds).toEqual(
        productionAnswerIds(task),
      );
    }
  });

  it("keeps localization IDs inside the canonical bank and limited to production tasks", () => {
    const bankIds = new Set(researchTaskBank.map((task) => task.id));
    const productionIds = new Set(
      productionTaskBankEntries.map((task) => task.id),
    );

    for (const locale of supportedLocales) {
      const localizedIds = Object.keys(getAssessmentLocaleContent(locale));

      expect(localizedIds.sort()).toEqual([...productionIds].sort());

      for (const id of localizedIds) {
        expect(bankIds.has(id)).toBe(true);
      }
    }
  });
});

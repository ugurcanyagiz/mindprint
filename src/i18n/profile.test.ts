import { describe, expect, it } from "vitest";

import { buildCognitiveProfile } from "../assessment/profile";
import type { AssessmentResponse } from "../assessment/types";
import { createLocalizedProfileSummary } from "./profile";

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

const perfectResponses: AssessmentResponse[] = [
  response(
    "task-01-information-filtering",
    ["operating-margin", "churn"],
    100,
  ),
  response("task-02-reasoning", "insufficient", 100),
  response(
    "task-03-evidence-evaluation",
    [
      "rct",
      "observational-study",
      "manufacturer-study",
      "viral-video",
    ],
    100,
  ),
  response("task-04-adaptive-rule", { phaseA: "14", phaseB: "15" }),
  response("task-05-missing-information", "insufficient", 100),
  response("task-06-knowledge-transfer", "shift-load"),
];

describe("localized cognitive profile", () => {
  it("creates the copyable summary in the selected assessment language", () => {
    const profile = buildCognitiveProfile(perfectResponses);
    const turkish = createLocalizedProfileSummary(profile, "tr");
    const korean = createLocalizedProfileSummary(profile, "ko");

    expect(turkish).toContain("MINDPRINT — Bilişsel Profil");
    expect(turkish).toContain("Akıl Yürütme: 100/100");
    expect(turkish).toContain("diller arası skor eşdeğerliği");

    expect(korean).toContain("MINDPRINT — 인지 프로필");
    expect(korean).toContain("추론: 100/100");
    expect(korean).toContain("언어 간 점수 동등성");
  });
});

import { describe, expect, it } from "vitest";

import {
  ASSESSMENT_SESSION_VERSION,
  createInitialSession,
  startSession,
  updateSession,
} from "./session";

describe("assessment session", () => {
  it("starts from a clean resumable state", () => {
    const session = createInitialSession();

    expect(session.version).toBe(ASSESSMENT_SESSION_VERSION);
    expect(session.status).toBe("not_started");
    expect(session.assessmentLanguage).toBeNull();
    expect(session.currentTaskIndex).toBe(0);
    expect(session.responses).toEqual([]);
    expect(session.draftAnswer).toBeNull();
  });

  it("locks and preserves the assessment language when resumed", () => {
    const started = startSession(createInitialSession(), "tr");
    const progressed = updateSession(started, {
      currentTaskIndex: 3,
      confidence: 75,
      draftAnswer: "example",
      startedAt: "2026-09-22T10:00:00.000Z",
      taskStartedAt: "2026-09-22T10:04:00.000Z",
    });

    const resumed = startSession(progressed, "en");

    expect(resumed.assessmentLanguage).toBe("tr");
    expect(resumed.currentTaskIndex).toBe(3);
    expect(resumed.confidence).toBe(75);
    expect(resumed.draftAnswer).toBe("example");
    expect(resumed.startedAt).toBe("2026-09-22T10:00:00.000Z");
    expect(resumed.taskStartedAt).toBe("2026-09-22T10:04:00.000Z");
    expect(resumed.status).toBe("in_progress");
  });
});

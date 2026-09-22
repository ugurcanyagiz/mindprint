import { useMemo } from "react";

import { experimentalTasks } from "../assessment/experimental/tasks";
import { ExperimentalTaskView } from "../components/experimental/ExperimentalTaskView";
import { ProgressLine } from "../components/assessment/ProgressLine";
import { Button } from "../components/ui/Button";
import { useExperimentalSession } from "../hooks/useExperimentalSession";

type ExperimentalPageProps = {
  onExit: () => void;
};

function formatDuration(startedAt: string | null, completedAt: string | null) {
  if (!startedAt || !completedAt) {
    return "Session duration recorded locally";
  }

  const elapsed =
    new Date(completedAt).getTime() - new Date(startedAt).getTime();

  if (!Number.isFinite(elapsed) || elapsed < 0) {
    return "Session duration recorded locally";
  }

  const minutes = Math.max(1, Math.round(elapsed / 60000));
  return `Approximate duration: ${minutes} min`;
}

export function ExperimentalPage({ onExit }: ExperimentalPageProps) {
  const {
    session,
    begin,
    setDraftAnswer,
    setConfidence,
    submitPhase,
    reset,
  } = useExperimentalSession();

  const currentTask = experimentalTasks[session.currentTaskIndex];
  const currentState = session.currentTaskState;
  const completedCount = session.responses.length;

  const durationLabel = useMemo(
    () => formatDuration(session.startedAt, session.completedAt),
    [session.startedAt, session.completedAt],
  );

  if (session.status === "not_started") {
    return (
      <main className="min-h-screen">
        <header className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4 px-5 py-6 sm:px-8 sm:py-7">
          <span className="text-[12px] font-semibold tracking-[0.24em]">
            MINDPRINT
          </span>
          <button
            type="button"
            className="text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
            onClick={onExit}
          >
            Return to MINDPRINT
          </button>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-[900px] items-center px-5 pb-20 sm:px-8">
          <div className="w-full max-w-[620px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Internal research form
            </p>
            <h1 className="mt-4 text-balance text-[38px] font-semibold leading-[1.04] tracking-[-0.05em] sm:text-[48px]">
              Experimental battery
            </h1>
            <p className="mt-5 max-w-[590px] text-[16px] leading-7 text-[var(--color-muted)]">
              Twelve pilot-ready tasks exploring how decisions change with
              evidence, uncertainty, feedback, and transfer. This form is not a
              validated or standardized assessment.
            </p>

            <div className="mt-9 flex gap-10 border-y border-[var(--color-border)] py-5 sm:gap-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  Tasks
                </p>
                <p className="mt-1.5 text-sm font-medium">
                  {experimentalTasks.length}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  Language
                </p>
                <p className="mt-1.5 text-sm font-medium">English</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  Estimate
                </p>
                <p className="mt-1.5 text-sm font-medium">~20 min</p>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button onClick={begin}>Begin experimental battery</Button>
              <Button variant="secondary" onClick={onExit}>
                Return to MINDPRINT
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (session.status === "completed") {
    return (
      <main className="min-h-screen">
        <section className="mx-auto flex min-h-screen w-full max-w-[900px] items-center px-5 py-20 sm:px-8">
          <div className="w-full max-w-[620px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Research battery
            </p>
            <h1 className="mt-4 text-[38px] font-semibold tracking-[-0.05em] sm:text-[48px]">
              Experimental battery complete
            </h1>

            <div className="mt-9 border-y border-[var(--color-border)] py-5 text-sm leading-7 text-[var(--color-muted)]">
              <p>{completedCount} tasks completed</p>
              <p>{durationLabel}</p>
              <p>Responses are stored locally on this device.</p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button onClick={onExit}>Return to MINDPRINT</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  reset();
                  begin();
                }}
              >
                Restart battery
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!currentTask || !currentState) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <header className="mx-auto w-full max-w-[900px] px-5 pt-6 sm:px-8 sm:pt-7">
        <div className="flex items-center justify-between gap-4 pb-4">
          <span className="text-[12px] font-semibold tracking-[0.24em]">
            MINDPRINT
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[10px] tabular-nums tracking-[0.04em] text-[var(--color-muted)]">
              {String(session.currentTaskIndex + 1).padStart(2, "0")} /{" "}
              {String(experimentalTasks.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
              onClick={onExit}
            >
              Exit
            </button>
          </div>
        </div>
        <ProgressLine
          current={session.currentTaskIndex + 1}
          total={experimentalTasks.length}
          label="Experimental battery progress"
        />
      </header>

      <section className="mx-auto w-full max-w-[900px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        <div className="max-w-[700px]">
          <ExperimentalTaskView
            task={currentTask}
            state={currentState}
            onDraftChange={setDraftAnswer}
            onConfidenceChange={setConfidence}
            onSubmit={submitPhase}
          />
        </div>
      </section>
    </main>
  );
}

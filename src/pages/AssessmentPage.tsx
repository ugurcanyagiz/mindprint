import { assessmentBlueprints } from "../assessment/tasks";
import { ConfidenceInput } from "../components/assessment/ConfidenceInput";
import { ProgressLine } from "../components/assessment/ProgressLine";
import { ResponseArea } from "../components/assessment/ResponseArea";
import { TaskFrame } from "../components/assessment/TaskFrame";
import { Button } from "../components/ui/Button";
import { useAssessmentSession } from "../hooks/useAssessmentSession";

type AssessmentPageProps = {
  onExit: () => void;
};

export function AssessmentPage({ onExit }: AssessmentPageProps) {
  const { session, begin, setConfidence, reset } = useAssessmentSession();
  const totalTasks = assessmentBlueprints.length;
  const taskNumber = Math.min(session.currentTaskIndex + 1, totalTasks);

  if (session.status === "not_started") {
    return (
      <main className="min-h-screen">
        <header className="mx-auto flex w-full max-w-[920px] items-center justify-between px-5 py-6 sm:px-8 sm:py-8">
          <span className="text-[13px] font-semibold tracking-[0.22em]">
            MINDPRINT
          </span>
          <button
            className="text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
            type="button"
            onClick={onExit}
          >
            Exit
          </button>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-[920px] items-center px-5 pb-20 sm:px-8">
          <div className="w-full max-w-[650px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Assessment
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              A short series of decision tasks.
            </h1>
            <p className="mt-6 max-w-[590px] text-[17px] leading-7 text-[var(--color-muted)]">
              Work at a natural pace. Some tasks ask how confident you are in
              your response. There is no need to prepare.
            </p>

            <div className="mt-10 flex gap-10 border-y border-[var(--color-border)] py-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Duration
                </p>
                <p className="mt-2 text-sm font-medium">~10 minutes</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Tasks
                </p>
                <p className="mt-2 text-sm font-medium">{totalTasks}</p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button className="min-w-[160px]" onClick={begin}>
                Start assessment
              </Button>
              <button
                className="text-sm text-[var(--color-muted)] underline-offset-4 hover:text-[var(--color-foreground)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
                type="button"
                onClick={reset}
              >
                Clear saved progress
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="mx-auto w-full max-w-[920px] px-5 pt-6 sm:px-8 sm:pt-8">
        <div className="flex items-center justify-between gap-6 pb-5">
          <span className="text-[13px] font-semibold tracking-[0.22em]">
            MINDPRINT
          </span>
          <div className="flex items-center gap-5">
            <span className="text-[11px] tabular-nums text-[var(--color-muted)]">
              Task {String(taskNumber).padStart(2, "0")} /{" "}
              {String(totalTasks).padStart(2, "0")}
            </span>
            <button
              className="text-xs text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
              type="button"
              onClick={onExit}
            >
              Exit assessment
            </button>
          </div>
        </div>
        <ProgressLine current={taskNumber} total={totalTasks} />
      </header>

      <section className="mx-auto w-full max-w-[920px] px-5 pb-20 pt-16 sm:px-8 sm:pt-20">
        <div className="max-w-[720px]">
          <TaskFrame
            eyebrow="Assessment framework"
            title="Task content enters in the next milestone."
            description="This view establishes the focused task, response, confidence, and progression framework without introducing live assessment content."
          >
            <ResponseArea />
            <ConfidenceInput
              value={session.confidence}
              onChange={setConfidence}
            />

            <div className="mt-9 flex items-center justify-between gap-4">
              <span className="text-xs text-[var(--color-muted)]">
                Progress is saved on this device.
              </span>
              <Button disabled>Continue</Button>
            </div>
          </TaskFrame>
        </div>
      </section>
    </main>
  );
}

import { useCallback } from "react";

import { assessmentTasks } from "../assessment/tasks";
import type {
  AdaptiveRuleTask,
  MultiSelectTask,
  RankingTask,
  SingleChoiceTask,
} from "../assessment/types";
import { AdaptiveTaskView } from "../components/assessment/AdaptiveTaskView";
import { MetricSelectionTaskView } from "../components/assessment/MetricSelectionTaskView";
import { ProgressLine } from "../components/assessment/ProgressLine";
import { RankingTaskView } from "../components/assessment/RankingTaskView";
import { SingleChoiceTaskView } from "../components/assessment/SingleChoiceTaskView";
import { Button } from "../components/ui/Button";
import { useAssessmentSession } from "../hooks/useAssessmentSession";

type AssessmentPageProps = {
  onExit: () => void;
};

function stringDraft(value: string | string[] | null) {
  return typeof value === "string" ? value : null;
}

function arrayDraft(value: string | string[] | null) {
  return Array.isArray(value) ? value : [];
}

export function AssessmentPage({ onExit }: AssessmentPageProps) {
  const totalTasks = assessmentTasks.length;
  const {
    session,
    begin,
    setConfidence,
    setDraftAnswer,
    saveAdaptivePhaseA,
    moveToAdaptivePhaseB,
    submitResponse,
    reset,
  } = useAssessmentSession(totalTasks);

  const currentTask = assessmentTasks[session.currentTaskIndex];
  const taskNumber = Math.min(session.currentTaskIndex + 1, totalTasks);

  const handleAdaptiveTransitionComplete = useCallback(() => {
    moveToAdaptivePhaseB();
  }, [moveToAdaptivePhaseB]);

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

  if (session.status === "completed" || !currentTask) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto flex min-h-screen w-full max-w-[920px] items-center px-5 py-20 sm:px-8">
          <div className="w-full max-w-[620px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Assessment
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Assessment complete.
            </h1>
            <p className="mt-6 text-[17px] leading-7 text-[var(--color-muted)]">
              Your responses have been saved on this device.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button onClick={onExit}>Return to overview</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  reset();
                  window.requestAnimationFrame(begin);
                }}
              >
                Start again
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const handleSingleChoiceSubmit = (task: SingleChoiceTask) => {
    const answer = stringDraft(session.draftAnswer);

    if (!answer) {
      return;
    }

    submitResponse({
      taskId: task.id,
      answer,
      confidence: task.confidenceRequired ? session.confidence : undefined,
    });
  };

  const handleMultiSelectSubmit = (task: MultiSelectTask) => {
    const answer = arrayDraft(session.draftAnswer);

    if (answer.length !== task.selectionLimit) {
      return;
    }

    submitResponse({
      taskId: task.id,
      answer,
      confidence: session.confidence,
    });
  };

  const handleRankingSubmit = (task: RankingTask) => {
    const answer = arrayDraft(session.draftAnswer);

    if (answer.length !== task.items.length) {
      return;
    }

    submitResponse({
      taskId: task.id,
      answer,
      confidence: session.confidence,
    });
  };

  const handleAdaptiveSubmit = (
    task: AdaptiveRuleTask,
    phaseBAnswer: string,
  ) => {
    submitResponse({
      taskId: task.id,
      answer: {
        phaseA: session.adaptivePhaseAAnswer,
        phaseB: phaseBAnswer,
      },
    });
  };

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
          {currentTask.kind === "multi-select" ? (
            <MetricSelectionTaskView
              task={currentTask}
              answer={arrayDraft(session.draftAnswer)}
              confidence={session.confidence}
              onAnswerChange={setDraftAnswer}
              onConfidenceChange={setConfidence}
              onSubmit={() => handleMultiSelectSubmit(currentTask)}
            />
          ) : currentTask.kind === "ranking" ? (
            <RankingTaskView
              task={currentTask}
              answer={
                Array.isArray(session.draftAnswer)
                  ? session.draftAnswer
                  : null
              }
              confidence={session.confidence}
              onAnswerChange={setDraftAnswer}
              onConfidenceChange={setConfidence}
              onSubmit={() => handleRankingSubmit(currentTask)}
            />
          ) : currentTask.kind === "adaptive-rule" ? (
            <AdaptiveTaskView
              task={currentTask}
              phase={session.adaptivePhase}
              draftAnswer={stringDraft(session.draftAnswer)}
              onDraftChange={setDraftAnswer}
              onSavePhaseA={saveAdaptivePhaseA}
              onTransitionComplete={handleAdaptiveTransitionComplete}
              onSubmit={(phaseBAnswer) =>
                handleAdaptiveSubmit(currentTask, phaseBAnswer)
              }
            />
          ) : (
            <SingleChoiceTaskView
              task={currentTask}
              answer={stringDraft(session.draftAnswer)}
              confidence={session.confidence}
              onAnswerChange={setDraftAnswer}
              onConfidenceChange={setConfidence}
              onSubmit={() => handleSingleChoiceSubmit(currentTask)}
            />
          )}

          <p className="mt-10 text-xs text-[var(--color-muted)]">
            Progress is saved on this device.
          </p>
        </div>
      </section>
    </main>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";

import { buildCognitiveProfile } from "../assessment/profile";
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
import { ProcessingProfile } from "../components/results/ProcessingProfile";
import { Button } from "../components/ui/Button";
import { useAssessmentSession } from "../hooks/useAssessmentSession";
import { ResultsPage } from "./ResultsPage";

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
  const [profileReady, setProfileReady] = useState(false);

  const currentTask = assessmentTasks[session.currentTaskIndex];
  const taskNumber = Math.min(session.currentTaskIndex + 1, totalTasks);

  const profile = useMemo(
    () => buildCognitiveProfile(session.responses),
    [session.responses],
  );

  useEffect(() => {
    if (session.status !== "completed") {
      setProfileReady(false);
    }
  }, [session.status]);

  const handleAdaptiveTransitionComplete = useCallback(() => {
    moveToAdaptivePhaseB();
  }, [moveToAdaptivePhaseB]);

  const handleProfileReady = useCallback(() => {
    setProfileReady(true);
  }, []);

  if (session.status === "not_started") {
    return (
      <main className="min-h-screen">
        <header className="mx-auto flex w-full max-w-[900px] items-center justify-between px-5 py-6 sm:px-8 sm:py-7">
          <span className="text-[12px] font-semibold tracking-[0.24em]">
            MINDPRINT
          </span>
          <button
            className="text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
            type="button"
            onClick={onExit}
          >
            Exit
          </button>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-[900px] items-center px-5 pb-20 sm:px-8">
          <div className="w-full max-w-[610px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Assessment
            </p>
            <h1 className="mt-4 text-balance text-[38px] font-semibold leading-[1.04] tracking-[-0.05em] sm:text-[48px]">
              A short series of decision tasks.
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-[var(--color-muted)]">
              Work at a natural pace. Some tasks ask how confident you are in
              your response.
            </p>

            <div className="mt-9 flex gap-12 border-y border-[var(--color-border)] py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  Duration
                </p>
                <p className="mt-1.5 text-sm font-medium">~10 minutes</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  Tasks
                </p>
                <p className="mt-1.5 text-sm font-medium">{totalTasks}</p>
              </div>
            </div>

            <div className="mt-9">
              <Button className="min-w-[154px]" onClick={begin}>
                Start assessment
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (session.status === "completed") {
    if (!profileReady) {
      return <ProcessingProfile onComplete={handleProfileReady} />;
    }

    return (
      <ResultsPage
        profile={profile}
        onRetake={() => {
          reset();
          setProfileReady(false);
        }}
      />
    );
  }

  if (!currentTask) {
    return null;
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
      <header className="mx-auto w-full max-w-[900px] px-5 pt-6 sm:px-8 sm:pt-7">
        <div className="flex items-center justify-between gap-4 pb-4">
          <span className="text-[12px] font-semibold tracking-[0.24em]">
            MINDPRINT
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[10px] tabular-nums tracking-[0.04em] text-[var(--color-muted)]">
              {String(taskNumber).padStart(2, "0")} /{" "}
              {String(totalTasks).padStart(2, "0")}
            </span>
            <button
              className="text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
              type="button"
              onClick={onExit}
            >
              Exit
            </button>
          </div>
        </div>
        <ProgressLine current={taskNumber} total={totalTasks} />
      </header>

      <section className="mx-auto w-full max-w-[900px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        <div className="max-w-[680px]">
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
        </div>
      </section>
    </main>
  );
}

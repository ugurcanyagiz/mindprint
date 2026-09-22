import { useCallback, useEffect, useMemo, useState } from "react";

import { getLocalizedAssessmentTasks } from "../assessment/localization";
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
import { LanguageSelector } from "../components/ui/LanguageSelector";
import { useAssessmentSession } from "../hooks/useAssessmentSession";
import { useLocale } from "../i18n/LocaleProvider";
import { getUiMessages } from "../i18n/messages";
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
  const { locale } = useLocale();
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

  const effectiveLocale = session.assessmentLanguage ?? locale;
  const messages = getUiMessages(effectiveLocale);
  const localizedTasks = useMemo(
    () => getLocalizedAssessmentTasks(effectiveLocale),
    [effectiveLocale],
  );
  const currentTask = localizedTasks[session.currentTaskIndex];
  const taskNumber = Math.min(session.currentTaskIndex + 1, totalTasks);

  const profile = useMemo(
    () => buildCognitiveProfile(session.responses),
    [session.responses],
  );

  useEffect(() => {
    document.documentElement.lang = effectiveLocale;

    return () => {
      document.documentElement.lang = locale;
    };
  }, [effectiveLocale, locale]);

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
        <header className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4 px-5 py-6 sm:px-8 sm:py-7">
          <span className="shrink-0 text-[12px] font-semibold tracking-[0.24em]">
            MINDPRINT
          </span>
          <div className="flex min-w-0 items-center gap-3">
            <LanguageSelector compact />
            <button
              className="shrink-0 text-[11px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-4"
              type="button"
              onClick={onExit}
            >
              {messages.assessment.exit}
            </button>
          </div>
        </header>

        <section className="mx-auto flex min-h-[calc(100vh-84px)] w-full max-w-[900px] items-center px-5 pb-20 sm:px-8">
          <div className="w-full max-w-[610px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {messages.assessment.label}
            </p>
            <h1 className="mt-4 text-balance text-[36px] font-semibold leading-[1.06] tracking-[-0.05em] sm:text-[48px]">
              {messages.assessment.introTitle}
            </h1>
            <p className="mt-5 max-w-[580px] text-[16px] leading-7 text-[var(--color-muted)]">
              {messages.assessment.introBody}
            </p>

            <div className="mt-9 flex gap-10 border-y border-[var(--color-border)] py-5 sm:gap-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  {messages.assessment.duration}
                </p>
                <p className="mt-1.5 text-sm font-medium">
                  {messages.assessment.durationValue}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  {messages.assessment.tasks}
                </p>
                <p className="mt-1.5 text-sm font-medium">{totalTasks}</p>
              </div>
            </div>

            <div className="mt-9">
              <Button
                className="min-w-[154px]"
                onClick={() => begin(locale)}
              >
                {messages.assessment.startAssessment}
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (session.status === "completed") {
    if (!profileReady) {
      return (
        <ProcessingProfile
          onComplete={handleProfileReady}
          messages={messages.results}
        />
      );
    }

    return (
      <ResultsPage
        profile={profile}
        locale={effectiveLocale}
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

  const handleRankingSubmit = (task: RankingTask, answer: string[]) => {
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
          <span className="shrink-0 text-[12px] font-semibold tracking-[0.24em]">
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
              {messages.assessment.exit}
            </button>
          </div>
        </div>
        <ProgressLine
          current={taskNumber}
          total={totalTasks}
          label={messages.assessment.progressLabel}
        />
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
              ui={messages.assessment}
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
              onSubmit={(answer) => handleRankingSubmit(currentTask, answer)}
              ui={messages.assessment}
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
              ui={messages.assessment}
            />
          ) : (
            <SingleChoiceTaskView
              task={currentTask}
              answer={stringDraft(session.draftAnswer)}
              confidence={session.confidence}
              onAnswerChange={setDraftAnswer}
              onConfidenceChange={setConfidence}
              onSubmit={() => handleSingleChoiceSubmit(currentTask)}
              ui={messages.assessment}
            />
          )}
        </div>
      </section>
    </main>
  );
}

import { useEffect } from "react";

import type { AdaptivePhase, AdaptiveRuleTask } from "../../assessment/types";
import { Button } from "../ui/Button";
import { RulePanel } from "./RulePanel";
import { TaskFrame } from "./TaskFrame";

type AdaptiveTaskViewProps = {
  task: AdaptiveRuleTask;
  phase: AdaptivePhase;
  draftAnswer: string | null;
  onDraftChange: (value: string) => void;
  onSavePhaseA: (answer: string) => void;
  onTransitionComplete: () => void;
  onSubmit: (phaseBAnswer: string) => void;
};

export function AdaptiveTaskView({
  task,
  phase,
  draftAnswer,
  onDraftChange,
  onSavePhaseA,
  onTransitionComplete,
  onSubmit,
}: AdaptiveTaskViewProps) {
  useEffect(() => {
    if (phase !== "transition") {
      return undefined;
    }

    const timeout = window.setTimeout(onTransitionComplete, 850);
    return () => window.clearTimeout(timeout);
  }, [phase, onTransitionComplete]);

  if (phase === "transition") {
    return (
      <div
        className="flex min-h-[360px] items-center"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Adaptive learning
          </p>
          <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
            Rule update
          </p>
          <div className="mt-7 h-px w-28 bg-[var(--color-accent)]" />
        </div>
      </div>
    );
  }

  const activePhase = phase === "phase-a" ? task.phaseA : task.phaseB;
  const canContinue = Boolean(draftAnswer?.trim());

  return (
    <TaskFrame eyebrow={task.eyebrow} title={task.title}>
      <RulePanel
        examples={activePhase.examples}
        prompt={activePhase.prompt}
        value={draftAnswer}
        onChange={onDraftChange}
      />

      <div className="mt-10 flex justify-end">
        <Button
          disabled={!canContinue}
          onClick={() => {
            if (!draftAnswer) {
              return;
            }

            if (phase === "phase-a") {
              onSavePhaseA(draftAnswer);
            } else {
              onSubmit(draftAnswer);
            }
          }}
        >
          Continue
        </Button>
      </div>
    </TaskFrame>
  );
}

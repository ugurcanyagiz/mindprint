import type { HiddenSystemPrototype } from "../../assessment/simulations/types";
import type { HiddenSystemState } from "../../assessment/simulations/session";
import { Button } from "../ui/Button";

type Props = {
  prototype: HiddenSystemPrototype;
  formLabel: "A" | "B";
  state: HiddenSystemState;
  onDraft: (value: string) => void;
  onHypothesis: (value: string) => void;
  onConfidence: (value: number) => void;
  onSubmit: () => void;
};

export function HiddenSystemView({
  prototype,
  formLabel,
  state,
  onDraft,
  onHypothesis,
  onConfidence,
  onSubmit,
}: Props) {
  const trial = prototype.trials[state.trialIndex];
  const isTransfer = trial.phase === "transfer";
  const needsHypothesis = Boolean(trial.hypothesisCheckpoint);

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Hidden-System Learning · Form {formLabel}
      </p>
      <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.045em] sm:text-[42px]">
        {prototype.title}
      </h1>
      <p className="mt-4 max-w-[650px] text-sm leading-6 text-[var(--color-muted)]">
        {prototype.description}
      </p>

      <div className="mt-8 border-y border-[var(--color-border)] py-5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
            {isTransfer ? "Transfer probe" : "Prediction trial"}
          </span>
          <span className="text-[11px] tabular-nums text-[var(--color-muted)]">
            {state.trialIndex + 1} / {prototype.trials.length}
          </span>
        </div>

        {state.lastFeedback ? (
          <p
            className="mt-4 text-sm leading-6 text-[var(--color-foreground-soft)]"
            role="status"
            aria-live="polite"
          >
            {state.lastFeedback}
          </p>
        ) : null}

        <div className="mt-7 flex items-baseline gap-4 font-mono">
          <span className="text-sm text-[var(--color-muted)]">Input</span>
          <span className="text-[34px] tracking-[-0.04em]">{trial.input}</span>
          <span className="text-[18px] text-[var(--color-muted)]">→</span>
          <span className="text-sm text-[var(--color-muted)]">?</span>
        </div>
      </div>

      <label className="mt-7 block text-sm font-medium" htmlFor="hidden-system-answer">
        Predict the output
      </label>
      <input
        id="hidden-system-answer"
        type="number"
        inputMode="numeric"
        autoComplete="off"
        value={state.draftAnswer}
        onChange={(event) => onDraft(event.currentTarget.value)}
        className="mt-3 w-full max-w-[200px] rounded-[9px] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-lg outline-none focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/10"
      />

      {needsHypothesis ? (
        <div className="mt-6 border-t border-[var(--color-border)] pt-5">
          <label className="block text-sm font-medium" htmlFor="hidden-system-hypothesis">
            What rule do you currently think is operating?
          </label>
          <input
            id="hidden-system-hypothesis"
            type="text"
            autoComplete="off"
            value={state.hypothesisDraft}
            onChange={(event) => onHypothesis(event.currentTarget.value)}
            className="mt-3 w-full rounded-[9px] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/10"
          />
        </div>
      ) : null}

      {isTransfer ? (
        <div className="mt-7 border-t border-[var(--color-border)] pt-6">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium" htmlFor="hidden-system-confidence">
              Confidence
            </label>
            <span className="text-xs tabular-nums text-[var(--color-muted)]">
              {state.confidence}%
            </span>
          </div>
          <input
            id="hidden-system-confidence"
            className="confidence-range mt-4 w-full"
            type="range"
            min={0}
            max={100}
            step={5}
            value={state.confidence}
            onChange={(event) => onConfidence(Number(event.currentTarget.value))}
          />
        </div>
      ) : null}

      <div className="mt-8 flex justify-end">
        <Button
          disabled={
            !state.draftAnswer.trim() ||
            (needsHypothesis && !state.hypothesisDraft.trim())
          }
          onClick={onSubmit}
        >
          {isTransfer ? "Complete prototype" : "Submit prediction"}
        </Button>
      </div>
    </div>
  );
}

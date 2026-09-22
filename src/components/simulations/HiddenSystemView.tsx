import type { HiddenSystemPrototype } from "../../assessment/simulations/types";
import type { HiddenSystemState } from "../../assessment/simulations/session";
import { Button } from "../ui/Button";
import { SimulationConfidence } from "./SimulationConfidence";

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
  const canSubmit =
    state.draftAnswer.trim().length > 0 &&
    (!needsHypothesis || state.hypothesisDraft.trim().length > 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[var(--color-border-strong)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
          Learning
        </span>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
          Form {formLabel}
        </span>
      </div>

      <h1 className="mt-4 text-[34px] font-semibold tracking-[-0.045em] sm:text-[42px]">
        {prototype.title}
      </h1>
      <p className="mt-4 max-w-[650px] text-[15px] leading-7 text-[var(--color-muted)]">
        {prototype.description}
      </p>

      <div className="mt-7 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${prototype.trials.length}, minmax(0, 1fr))` }}>
        {prototype.trials.map((item, index) => (
          <div
            key={item.id}
            className={[
              "h-1.5 rounded-full",
              index <= state.trialIndex
                ? "bg-[var(--color-accent)]"
                : "bg-[var(--color-track)]",
            ].join(" ")}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="mt-6 rounded-[14px] border border-[var(--color-border)] bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {isTransfer ? "Transfer probe" : "Prediction trial"}
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Trial {state.trialIndex + 1} of {prototype.trials.length}
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-muted)]">
            Feedback after submit
          </span>
        </div>

        {state.lastFeedback ? (
          <div
            className="mt-5 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-6 text-[var(--color-foreground-soft)]"
            role="status"
            aria-live="polite"
          >
            <span className="font-semibold text-[var(--color-accent)]">
              Previous result:
            </span>{" "}
            {state.lastFeedback}
          </div>
        ) : null}

        <div className="mt-7 grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[12px] bg-[var(--color-surface)] px-4 py-5 font-mono sm:max-w-[380px]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
              Input
            </p>
            <p className="mt-1 text-[34px] font-semibold tracking-[-0.04em]">
              {trial.input}
            </p>
          </div>
          <span className="text-center text-[22px] text-[var(--color-muted)]">
            →
          </span>
          <div>
            <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
              Output
            </p>
            <p className="mt-1 text-[34px] font-semibold tracking-[-0.04em] text-[var(--color-muted-soft)]">
              ?
            </p>
          </div>
        </div>

        <label
          className="mt-7 block text-sm font-semibold"
          htmlFor="hidden-system-answer"
        >
          Your predicted output
        </label>
        <input
          id="hidden-system-answer"
          type="number"
          inputMode="numeric"
          autoComplete="off"
          value={state.draftAnswer}
          onChange={(event) => onDraft(event.currentTarget.value)}
          placeholder="Enter a number"
          className="mt-3 min-h-12 w-full max-w-[240px] rounded-[10px] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-lg font-semibold outline-none transition-[border-color,box-shadow] focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/10"
        />

        {needsHypothesis ? (
          <div className="mt-6 border-t border-[var(--color-border)] pt-5">
            <label
              className="block text-sm font-semibold"
              htmlFor="hidden-system-hypothesis"
            >
              What rule do you currently think is operating?
            </label>
            <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
              A short description is enough. This checkpoint appears only occasionally.
            </p>
            <input
              id="hidden-system-hypothesis"
              type="text"
              autoComplete="off"
              value={state.hypothesisDraft}
              onChange={(event) => onHypothesis(event.currentTarget.value)}
              placeholder="Example: output changes with input by..."
              className="mt-3 min-h-12 w-full rounded-[10px] border border-[var(--color-border-strong)] bg-white px-4 py-3 text-sm outline-none transition-[border-color,box-shadow] focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-focus)]/10"
            />
          </div>
        ) : null}

        {isTransfer ? (
          <SimulationConfidence
            id="hidden-system-confidence"
            value={state.confidence}
            onChange={onConfidence}
            className="mt-7 border-t border-[var(--color-border)] pt-6"
          />
        ) : null}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--color-muted)]">
          {canSubmit
            ? "Your response is ready to submit."
            : needsHypothesis
              ? "Enter both a prediction and your current rule hypothesis."
              : "Enter a prediction to continue."}
        </p>
        <Button
          disabled={!canSubmit}
          onClick={onSubmit}
          className="w-full sm:w-auto"
        >
          {isTransfer ? "Complete learning simulation" : "Submit prediction"}
        </Button>
      </div>
    </div>
  );
}

import {
  evidenceStreamPrototype,
} from "../../assessment/simulations/prototypes";
import type { EvidenceState } from "../../assessment/simulations/session";
import { Button } from "../ui/Button";

type Props = {
  state: EvidenceState;
  onDecision: (value: string) => void;
  onConfidence: (value: number) => void;
  onSubmit: () => void;
};

export function EvidenceStreamView({
  state,
  onDecision,
  onConfidence,
  onSubmit,
}: Props) {
  const current = evidenceStreamPrototype.evidence[state.eventIndex];
  const isLast =
    state.eventIndex === evidenceStreamPrototype.evidence.length - 1;

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Prototype 03 · Dynamic Evidence Stream
      </p>
      <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.045em] sm:text-[42px]">
        {evidenceStreamPrototype.title}
      </h1>
      <p className="mt-4 max-w-[650px] text-sm leading-6 text-[var(--color-muted)]">
        {evidenceStreamPrototype.description}
      </p>

      <div className="mt-8 border-y border-[var(--color-border)] py-5">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Hypothesis
        </p>
        <p className="mt-2 text-[17px] font-medium leading-7">
          {evidenceStreamPrototype.hypothesis}
        </p>
      </div>

      {state.checkpoints.length > 0 ? (
        <div className="mt-5">
          <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Evidence history
          </p>
          <div className="mt-2 border-t border-[var(--color-border)]">
            {state.checkpoints.map((checkpoint, index) => {
              const item = evidenceStreamPrototype.evidence[index];
              return (
                <div
                  key={checkpoint.evidenceId}
                  className="grid gap-1 border-b border-[var(--color-border)] py-3 sm:grid-cols-[1fr_auto]"
                >
                  <span className="text-xs text-[var(--color-foreground-soft)]">
                    {item.source}
                  </span>
                  <span className="text-[11px] text-[var(--color-muted)]">
                    {checkpoint.decision} · {checkpoint.confidence}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        className="mt-6 border-l border-[var(--color-accent)] pl-4"
        aria-live="polite"
      >
        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
          {current.event.label} · {current.source}
        </p>
        <p className="mt-2 max-w-[650px] text-sm leading-6 text-[var(--color-foreground-soft)]">
          {current.evidence}
        </p>
      </div>

      <fieldset className="mt-7">
        <legend className="text-sm font-medium">
          Update your current judgment
        </legend>
        <div className="mt-3 border-y border-[var(--color-border)]">
          {evidenceStreamPrototype.responseOptions.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 border-b border-[var(--color-border)] py-3 last:border-b-0"
            >
              <input
                type="radio"
                name="evidence-judgment"
                value={option.id}
                checked={state.decision === option.id}
                onChange={() => onDecision(option.id)}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7 border-t border-[var(--color-border)] pt-6">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-medium" htmlFor="evidence-confidence">
            Confidence
          </label>
          <span className="text-xs tabular-nums text-[var(--color-muted)]">
            {state.confidence}%
          </span>
        </div>
        <input
          id="evidence-confidence"
          className="confidence-range mt-4 w-full"
          type="range"
          min={0}
          max={100}
          step={5}
          value={state.confidence}
          onChange={(event) => onConfidence(Number(event.currentTarget.value))}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button disabled={!state.decision} onClick={onSubmit}>
          {isLast ? "Complete simulation set" : "Commit judgment"}
        </Button>
      </div>
    </div>
  );
}

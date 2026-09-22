import {
  dynamicAttentionPrototype,
} from "../../assessment/simulations/prototypes";
import type { AttentionState } from "../../assessment/simulations/session";
import { Button } from "../ui/Button";

type Props = {
  state: AttentionState;
  onToggle: (signalId: string) => void;
  onAdvance: () => void;
  onConfidence: (value: number) => void;
  onComplete: () => void;
};

export function DynamicAttentionView({
  state,
  onToggle,
  onAdvance,
  onConfidence,
  onComplete,
}: Props) {
  const frame = dynamicAttentionPrototype.frames[state.frameIndex];
  const isFinal =
    state.frameIndex === dynamicAttentionPrototype.frames.length - 1;

  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Prototype 01 · Dynamic Attention Field
      </p>
      <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.045em] sm:text-[42px]">
        {dynamicAttentionPrototype.title}
      </h1>
      <p className="mt-4 max-w-[650px] text-sm leading-6 text-[var(--color-muted)]">
        {dynamicAttentionPrototype.description}
      </p>

      <div className="mt-8 flex items-center justify-between border-y border-[var(--color-border)] py-3">
        <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
          {frame.event.label}
        </span>
        <span className="text-[11px] tabular-nums text-[var(--color-muted)]">
          {state.frameIndex + 1} / {dynamicAttentionPrototype.frames.length}
        </span>
      </div>

      {frame.note ? (
        <div
          className="mt-5 border-l border-[var(--color-accent)] pl-4 text-sm leading-6 text-[var(--color-foreground-soft)]"
          role="status"
          aria-live="polite"
        >
          {frame.note}
        </div>
      ) : null}

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {dynamicAttentionPrototype.signals.map((signal) => {
          const value = frame.values[signal.id] ?? 0;
          const selected = state.selectedSignalIds.includes(signal.id);

          return (
            <button
              key={signal.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(signal.id)}
              className={[
                "min-w-0 border-b border-[var(--color-border)] px-1 py-3 text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]",
                selected ? "bg-white/70" : "hover:bg-white/45",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium">{signal.label}</span>
                <span className="text-xs tabular-nums text-[var(--color-muted)]">
                  {value}
                </span>
              </div>
              <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-[var(--color-track)]">
                <div
                  className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-500"
                  style={{ width: `${Math.max(3, value)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-[var(--color-muted)]">
        Select the two signals you currently consider most diagnostic. You can revise them as the field changes.
      </p>

      {isFinal ? (
        <div className="mt-8 border-t border-[var(--color-border)] pt-6">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-medium" htmlFor="sim-attention-confidence">
              Confidence
            </label>
            <span className="text-xs tabular-nums text-[var(--color-muted)]">
              {state.confidence}%
            </span>
          </div>
          <input
            id="sim-attention-confidence"
            className="confidence-range mt-4 w-full"
            type="range"
            min={0}
            max={100}
            step={5}
            value={state.confidence}
            onChange={(event) => onConfidence(Number(event.currentTarget.value))}
          />
          <div className="mt-7 flex justify-end">
            <Button
              disabled={
                state.selectedSignalIds.length !==
                dynamicAttentionPrototype.selectionLimit
              }
              onClick={onComplete}
            >
              Complete prototype
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-7 flex justify-end">
          <Button onClick={onAdvance}>Advance event</Button>
        </div>
      )}
    </div>
  );
}

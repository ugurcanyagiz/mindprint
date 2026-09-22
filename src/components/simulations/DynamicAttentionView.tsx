import type { AttentionPrototype } from "../../assessment/simulations/types";
import type { AttentionState } from "../../assessment/simulations/session";
import { Button } from "../ui/Button";
import { SimulationConfidence } from "./SimulationConfidence";

type Props = {
  prototype: AttentionPrototype;
  formLabel: "A" | "B";
  state: AttentionState;
  onToggle: (signalId: string) => void;
  onAdvance: () => void;
  onConfidence: (value: number) => void;
  onComplete: () => void;
};

export function DynamicAttentionView({
  prototype,
  formLabel,
  state,
  onToggle,
  onAdvance,
  onConfidence,
  onComplete,
}: Props) {
  const frame = prototype.frames[state.frameIndex];
  const isFinal = state.frameIndex === prototype.frames.length - 1;
  const selectionComplete =
    state.selectedSignalIds.length === prototype.selectionLimit;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[var(--color-border-strong)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
          Attention
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

      <div className="mt-8 rounded-[14px] border border-[var(--color-border)] bg-white px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
              Current event
            </p>
            <p className="mt-1 text-sm font-medium">{frame.event.label}</p>
          </div>
          <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium tabular-nums text-[var(--color-muted)]">
            {state.frameIndex + 1} / {prototype.frames.length}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-1.5" aria-hidden="true">
          {prototype.frames.map((item, index) => (
            <div
              key={item.event.id}
              className={[
                "h-1.5 rounded-full",
                index <= state.frameIndex
                  ? "bg-[var(--color-accent)]"
                  : "bg-[var(--color-track)]",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      {frame.note ? (
        <div
          className="mt-5 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-sm leading-6 text-[var(--color-foreground-soft)]"
          role="status"
          aria-live="polite"
        >
          <span className="mr-2 font-semibold text-[var(--color-accent)]">
            New event:
          </span>
          {frame.note}
        </div>
      ) : null}

      <div className="mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Choose 2 diagnostic signals</p>
          <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
            Your choices stay selected as the environment changes.
          </p>
        </div>
        <span
          className={[
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums",
            selectionComplete
              ? "bg-[var(--color-accent)] text-white"
              : "bg-[var(--color-surface)] text-[var(--color-muted)]",
          ].join(" ")}
          aria-live="polite"
        >
          {state.selectedSignalIds.length} / {prototype.selectionLimit} selected
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {prototype.signals.map((signal) => {
          const value = frame.values[signal.id] ?? 0;
          const selected = state.selectedSignalIds.includes(signal.id);
          const disabled =
            !selected &&
            state.selectedSignalIds.length >= prototype.selectionLimit;

          return (
            <button
              key={signal.id}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onToggle(signal.id)}
              className={[
                "group relative min-w-0 rounded-[12px] border px-4 py-4 text-left",
                "transition-[background-color,border-color,box-shadow,opacity] duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2",
                selected
                  ? "border-[var(--color-accent)] bg-[#eef2f8] shadow-[inset_0_0_0_1px_var(--color-accent)]"
                  : "border-[var(--color-border)] bg-white hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]",
                disabled ? "cursor-not-allowed opacity-45" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span
                  className={[
                    "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold",
                    selected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                      : "border-[var(--color-border-strong)] bg-white text-transparent",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  ✓
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={[
                        "truncate text-sm font-semibold",
                        selected ? "text-[var(--color-accent-strong)]" : "",
                      ].join(" ")}
                    >
                      {signal.label}
                    </span>
                    <span className="text-xs font-medium tabular-nums text-[var(--color-muted)]">
                      {value}
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-track)]">
                    <div
                      className={[
                        "h-full rounded-full transition-[width] duration-500",
                        selected
                          ? "bg-[var(--color-accent)]"
                          : "bg-[var(--color-muted-soft)]",
                      ].join(" ")}
                      style={{ width: `${Math.max(3, value)}%` }}
                    />
                  </div>

                  <div className="mt-2 h-4">
                    {selected ? (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
                        Selected
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {isFinal ? (
        <div className="mt-8 rounded-[14px] border border-[var(--color-border)] bg-white p-5">
          <SimulationConfidence
            id="sim-attention-confidence"
            value={state.confidence}
            onChange={onConfidence}
          />
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--color-muted)]">
              {selectionComplete
                ? "Two signals selected. You can still revise them before submitting."
                : "Select exactly two signals to continue."}
            </p>
            <Button
              disabled={!selectionComplete}
              onClick={onComplete}
              className="w-full sm:w-auto"
            >
              Complete attention simulation
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--color-muted)]">
            Selections are not scored yet. Keep tracking what seems most diagnostic.
          </p>
          <Button onClick={onAdvance} className="w-full sm:w-auto">
            Next event
          </Button>
        </div>
      )}
    </div>
  );
}

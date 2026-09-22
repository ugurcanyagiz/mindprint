import type { EvidencePrototype } from "../../assessment/simulations/types";
import type { EvidenceState } from "../../assessment/simulations/session";
import { Button } from "../ui/Button";
import { SimulationConfidence } from "./SimulationConfidence";

type Props = {
  prototype: EvidencePrototype;
  formLabel: "A" | "B";
  state: EvidenceState;
  onDecision: (value: string) => void;
  onConfidence: (value: number) => void;
  onSubmit: () => void;
};

export function EvidenceStreamView({
  prototype,
  formLabel,
  state,
  onDecision,
  onConfidence,
  onSubmit,
}: Props) {
  const current = prototype.evidence[state.eventIndex];
  const isLast = state.eventIndex === prototype.evidence.length - 1;
  const selectedLabel = prototype.responseOptions.find(
    (option) => option.id === state.decision,
  )?.label;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[var(--color-border-strong)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
          Evidence
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

      <div className="mt-8 rounded-[14px] border border-[var(--color-border)] bg-white p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Hypothesis
        </p>
        <p className="mt-2 text-[17px] font-semibold leading-7">
          {prototype.hypothesis}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-1.5" aria-label="Evidence progress">
        {prototype.evidence.map((item, index) => (
          <div key={item.id}>
            <div
              className={[
                "h-1.5 rounded-full",
                index <= state.eventIndex
                  ? "bg-[var(--color-accent)]"
                  : "bg-[var(--color-track)]",
              ].join(" ")}
            />
            <p className="mt-1 hidden text-center text-[9px] text-[var(--color-muted-soft)] sm:block">
              {index + 1}
            </p>
          </div>
        ))}
      </div>

      {state.checkpoints.length > 0 ? (
        <details className="mt-5 rounded-[12px] border border-[var(--color-border)] bg-white">
          <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-[var(--color-foreground-soft)]">
            Previous judgments ({state.checkpoints.length})
          </summary>
          <div className="border-t border-[var(--color-border)] px-4">
            {state.checkpoints.map((checkpoint, index) => {
              const item = prototype.evidence[index];
              const label =
                prototype.responseOptions.find(
                  (option) => option.id === checkpoint.decision,
                )?.label ?? checkpoint.decision;

              return (
                <div
                  key={checkpoint.evidenceId}
                  className="grid gap-1 border-b border-[var(--color-border)] py-3 last:border-b-0 sm:grid-cols-[1fr_auto]"
                >
                  <span className="text-xs text-[var(--color-foreground-soft)]">
                    {item.source}
                  </span>
                  <span className="text-[11px] font-medium text-[var(--color-muted)]">
                    {label} · {checkpoint.confidence}%
                  </span>
                </div>
              );
            })}
          </div>
        </details>
      ) : null}

      <div
        className="mt-6 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Evidence {state.eventIndex + 1} of {prototype.evidence.length}
          </p>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-[var(--color-muted)]">
            {current.source}
          </span>
        </div>
        <p className="mt-3 max-w-[650px] text-[15px] leading-7 text-[var(--color-foreground-soft)]">
          {current.evidence}
        </p>
      </div>

      <fieldset className="mt-7">
        <legend className="text-sm font-semibold">
          What is your current judgment?
        </legend>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Select one. You will be able to update your view after the next evidence item.
        </p>

        <div className="mt-4 grid gap-2.5">
          {prototype.responseOptions.map((option) => {
            const checked = state.decision === option.id;

            return (
              <label
                key={option.id}
                className={[
                  "relative flex min-h-14 cursor-pointer items-center gap-3 rounded-[12px] border px-4 py-3.5",
                  "transition-[background-color,border-color,box-shadow] duration-150",
                  "focus-within:ring-2 focus-within:ring-[var(--color-focus)] focus-within:ring-offset-2",
                  checked
                    ? "border-[var(--color-accent)] bg-[#eef2f8] shadow-[inset_0_0_0_1px_var(--color-accent)]"
                    : "border-[var(--color-border)] bg-white hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="evidence-judgment"
                  value={option.id}
                  checked={checked}
                  onChange={() => onDecision(option.id)}
                  className="sr-only"
                />
                <span
                  className={[
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                    checked
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                      : "border-[var(--color-border-strong)] bg-white",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {checked ? (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  ) : null}
                </span>
                <span
                  className={[
                    "min-w-0 flex-1 text-sm font-medium",
                    checked ? "text-[var(--color-accent-strong)]" : "",
                  ].join(" ")}
                >
                  {option.label}
                </span>
                {checked ? (
                  <span className="rounded-full bg-[var(--color-accent)] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                    Selected
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>

        <div className="mt-3 min-h-5 text-xs font-medium text-[var(--color-accent)]" aria-live="polite">
          {selectedLabel ? `Selected: ${selectedLabel}` : "No response selected yet."}
        </div>
      </fieldset>

      <div className="mt-7 rounded-[14px] border border-[var(--color-border)] bg-white p-5">
        <SimulationConfidence
          id="evidence-confidence"
          value={state.confidence}
          onChange={onConfidence}
        />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[var(--color-muted)]">
          {state.decision
            ? "Your selection is saved when you commit this judgment."
            : "Choose one response before continuing."}
        </p>
        <Button
          disabled={!state.decision}
          onClick={onSubmit}
          className="w-full sm:w-auto"
        >
          {isLast ? "Complete evidence simulation" : "Commit and view next evidence"}
        </Button>
      </div>
    </div>
  );
}

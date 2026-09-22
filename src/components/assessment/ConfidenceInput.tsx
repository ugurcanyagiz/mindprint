import type { Confidence } from "../../assessment/types";

type ConfidenceInputProps = {
  value: Confidence;
  onChange: (value: Confidence) => void;
};

export function ConfidenceInput({
  value,
  onChange,
}: ConfidenceInputProps) {
  return (
    <div className="mt-8 border-t border-[var(--color-border)] pt-6">
      <div className="flex items-center justify-between gap-6">
        <label className="text-sm font-medium" htmlFor="assessment-confidence">
          Confidence
        </label>
        <output
          className="text-xs tabular-nums text-[var(--color-muted)]"
          htmlFor="assessment-confidence"
        >
          {value}%
        </output>
      </div>

      <input
        id="assessment-confidence"
        className="confidence-range mt-4 w-full"
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        aria-valuetext={`${value} percent confident`}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />

      <div
        className="mt-1.5 flex justify-between text-[10px] uppercase tracking-[0.08em] text-[var(--color-muted-soft)]"
        aria-hidden="true"
      >
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

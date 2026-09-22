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
    <div className="mt-10 border-t border-[var(--color-border)] pt-7">
      <div className="flex items-center justify-between gap-6">
        <label
          className="text-sm font-medium"
          htmlFor="assessment-confidence"
        >
          Confidence
        </label>
        <output
          className="text-sm tabular-nums text-[var(--color-muted)]"
          htmlFor="assessment-confidence"
        >
          {value}%
        </output>
      </div>

      <input
        id="assessment-confidence"
        className="confidence-range mt-5 w-full"
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        aria-valuetext={`${value} percent confident`}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />

      <div
        className="mt-2 flex justify-between text-[11px] text-[var(--color-muted)]"
        aria-hidden="true"
      >
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

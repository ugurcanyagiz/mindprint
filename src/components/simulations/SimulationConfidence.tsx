type SimulationConfidenceProps = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

export function SimulationConfidence({
  id,
  value,
  onChange,
  className = "",
}: SimulationConfidenceProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium" htmlFor={id}>
          Confidence
        </label>
        <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--color-accent)]">
          {value}%
        </span>
      </div>
      <input
        id={id}
        className="confidence-range mt-4 w-full"
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
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

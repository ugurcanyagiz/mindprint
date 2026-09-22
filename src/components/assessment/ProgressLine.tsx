type ProgressLineProps = {
  current: number;
  total: number;
};

export function ProgressLine({ current, total }: ProgressLineProps) {
  const progress = total === 0 ? 0 : Math.min(100, (current / total) * 100);

  return (
    <div
      className="h-px w-full bg-[var(--color-border)]"
      role="progressbar"
      aria-label="Assessment progress"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <div
        className="h-px bg-[var(--color-accent)] transition-[width] duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

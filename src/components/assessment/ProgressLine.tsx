type ProgressLineProps = {
  current: number;
  total: number;
  label: string;
};

export function ProgressLine({
  current,
  total,
  label,
}: ProgressLineProps) {
  const progress = total === 0 ? 0 : Math.min(100, (current / total) * 100);

  return (
    <div
      className="h-px w-full bg-[var(--color-border)]"
      role="progressbar"
      aria-label={label}
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

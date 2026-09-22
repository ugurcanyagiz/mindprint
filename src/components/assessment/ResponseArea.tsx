type ResponseAreaProps = {
  label?: string;
};

export function ResponseArea({
  label = "Response area",
}: ResponseAreaProps) {
  return (
    <div
      className="rounded-xl border border-[var(--color-border)] bg-white px-5 py-6 sm:px-6"
      aria-label={label}
    >
      <div className="space-y-3" aria-hidden="true">
        <div className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]" />
        <div className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]" />
        <div className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]" />
      </div>
      <p className="mt-5 text-xs leading-5 text-[var(--color-muted)]">
        Response controls will adapt to each task.
      </p>
    </div>
  );
}

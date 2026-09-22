type SimulationProgressProps = {
  currentIndex: number;
};

const steps = [
  { label: "Attention", detail: "Signal selection" },
  { label: "Learning", detail: "Hidden system" },
  { label: "Evidence", detail: "Belief updating" },
];

export function SimulationProgress({
  currentIndex,
}: SimulationProgressProps) {
  return (
    <div
      className="grid grid-cols-3 gap-2"
      aria-label="Simulation progress"
    >
      {steps.map((step, index) => {
        const state =
          index < currentIndex
            ? "complete"
            : index === currentIndex
              ? "current"
              : "upcoming";

        return (
          <div key={step.label} className="min-w-0">
            <div
              className={[
                "h-1 rounded-full transition-colors duration-200",
                state === "complete" || state === "current"
                  ? "bg-[var(--color-accent)]"
                  : "bg-[var(--color-track)]",
              ].join(" ")}
              aria-hidden="true"
            />
            <div className="mt-2 min-w-0">
              <p
                className={[
                  "truncate text-[10px] font-semibold uppercase tracking-[0.12em]",
                  state === "current"
                    ? "text-[var(--color-accent)]"
                    : state === "complete"
                      ? "text-[var(--color-foreground-soft)]"
                      : "text-[var(--color-muted-soft)]",
                ].join(" ")}
              >
                {index + 1}. {step.label}
              </p>
              <p className="mt-0.5 hidden truncate text-[10px] text-[var(--color-muted)] sm:block">
                {step.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

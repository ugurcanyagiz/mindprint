import { Button } from "../components/ui/Button";

const dimensions = [
  "Reasoning",
  "Adaptive Learning",
  "Evidence Evaluation",
  "Information Filtering",
  "Metacognitive Calibration",
  "Knowledge Transfer",
] as const;

export function LandingPage() {
  return (
    <main>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7 lg:px-8">
        <a
          className="text-sm font-semibold tracking-[0.2em]"
          href="/"
          aria-label="MINDPRINT home"
        >
          MINDPRINT
        </a>
        <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Cognitive Assessment
        </span>
      </header>

      <section className="mx-auto grid min-h-[72vh] w-full max-w-6xl place-items-center px-6 py-20 lg:px-8">
        <div className="w-full max-w-3xl">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Experimental prototype
          </p>
          <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">
            A modern assessment of how you reason, adapt and evaluate information.
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-[var(--color-muted)]">
            MINDPRINT is being built as a professional cognitive assessment
            prototype for environments shaped by uncertainty, information
            overload, and intelligent tools.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button disabled>Assessment coming next</Button>
            <span className="text-sm text-[var(--color-muted)]">
              Foundation ready for Codex development
            </span>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dimension) => (
              <div
                key={dimension}
                className="rounded-xl border border-[var(--color-border)] p-5 text-sm font-medium"
              >
                {dimension}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span>MINDPRINT / Experimental cognitive assessment</span>
        <span>Not an IQ test or clinical instrument.</span>
      </footer>
    </main>
  );
}

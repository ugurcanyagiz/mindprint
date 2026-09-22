import { Button } from "../components/ui/Button";

const dimensions = [
  { index: "01", label: "Reasoning" },
  { index: "02", label: "Adaptive learning" },
  { index: "03", label: "Evidence evaluation" },
  { index: "04", label: "Information filtering" },
  { index: "05", label: "Metacognitive calibration" },
  { index: "06", label: "Knowledge transfer" },
] as const;

export function LandingPage() {
  return (
    <main className="overflow-hidden">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-5 py-6 sm:px-8 sm:py-8">
        <a
          className="text-[13px] font-semibold tracking-[0.22em] text-[var(--color-foreground)]"
          href="/"
          aria-label="MINDPRINT home"
        >
          MINDPRINT
        </a>

        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] sm:text-[11px]">
          Experimental assessment
        </span>
      </header>

      <section className="mx-auto grid w-full max-w-[1200px] items-center gap-14 px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-24 lg:min-h-[720px] lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-10 lg:pb-32 lg:pt-24">
        <div className="max-w-[760px]">
          <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Cognitive assessment
          </p>

          <h1 className="text-balance text-[clamp(3.4rem,7vw,6.8rem)] font-semibold leading-[0.91] tracking-[-0.065em]">
            How do you think when the answer isn&apos;t obvious?
          </h1>

          <p className="mt-8 max-w-[620px] text-pretty text-[17px] leading-7 text-[var(--color-muted)] sm:text-[18px] sm:leading-8">
            MINDPRINT examines reasoning, adaptation, evidence judgment, and
            confidence through a short modern assessment.
          </p>

          <div className="mt-10">
            <Button
              className="min-w-[168px] disabled:opacity-70"
              disabled
              title="Assessment flow will open in the next milestone."
            >
              Begin assessment
            </Button>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-[520px] lg:justify-self-end"
          aria-hidden="true"
        >
          <div className="absolute inset-x-[12%] top-[18%] h-[64%] rounded-full bg-[radial-gradient(circle,rgba(49,92,140,0.07),transparent_68%)] blur-2xl" />
          <img
            alt=""
            className="relative block h-auto w-full opacity-95"
            src="/mindprint-field.svg"
          />
        </div>
      </section>

      <section
        className="border-y border-[var(--color-border)] bg-white"
        aria-labelledby="measures-heading"
      >
        <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Scope
              </p>
              <h2
                id="measures-heading"
                className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-[28px]"
              >
                What it measures
              </h2>
            </div>

            <span className="hidden text-xs text-[var(--color-muted)] sm:block">
              Six dimensions
            </span>
          </div>

          <div className="grid grid-cols-2 border-t border-[var(--color-border)] md:grid-cols-3 lg:grid-cols-6">
            {dimensions.map((dimension) => (
              <div
                key={dimension.label}
                className="min-h-[118px] border-b border-[var(--color-border)] py-5 pr-5 odd:pr-4 even:border-l even:border-l-[var(--color-border)] even:pl-4 md:min-h-[128px] md:border-l md:border-l-[var(--color-border)] md:px-5 md:first:border-l-0 lg:border-b-0"
              >
                <span className="text-[10px] font-medium tabular-nums tracking-[0.14em] text-[var(--color-muted-soft)]">
                  {dimension.index}
                </span>
                <p className="mt-8 max-w-[150px] text-sm font-medium leading-5 tracking-[-0.01em]">
                  {dimension.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="method"
        className="mx-auto grid w-full max-w-[1200px] gap-8 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16 lg:py-28"
        aria-labelledby="method-heading"
      >
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Approach
          </p>
          <h2
            id="method-heading"
            className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-[28px]"
          >
            Method
          </h2>
        </div>

        <p className="max-w-[680px] text-pretty text-[18px] leading-8 tracking-[-0.015em] text-[var(--color-foreground-soft)] sm:text-[20px] sm:leading-9">
          Short tasks introduce incomplete information, changing rules,
          conflicting evidence, and confidence judgments. Performance is
          summarized within the assessment itself.
        </p>
      </section>

      <section className="border-t border-[var(--color-border)]">
        <div className="mx-auto grid w-full max-w-[1200px] gap-5 px-5 py-10 sm:px-8 sm:py-12 md:grid-cols-[0.38fr_0.62fr] md:gap-16">
          <p className="text-sm font-medium">Experimental by design.</p>
          <p className="max-w-[680px] text-sm leading-6 text-[var(--color-muted)]">
            MINDPRINT is not an IQ test, clinical instrument, diagnostic tool,
            or population percentile assessment.
          </p>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-5 py-7 text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)] sm:px-8">
          <span>MINDPRINT</span>
          <span>Research preview · V0.1</span>
        </div>
      </footer>
    </main>
  );
}

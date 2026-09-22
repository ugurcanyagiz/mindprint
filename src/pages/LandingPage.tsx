import { Button } from "../components/ui/Button";

const dimensions = [
  { index: "01", label: "Reasoning" },
  { index: "02", label: "Adaptive learning" },
  { index: "03", label: "Evidence evaluation" },
  { index: "04", label: "Information filtering" },
  { index: "05", label: "Metacognitive calibration" },
  { index: "06", label: "Knowledge transfer" },
] as const;

type LandingPageProps = {
  onBegin: () => void;
};

export function LandingPage({ onBegin }: LandingPageProps) {
  return (
    <main className="overflow-hidden">
      <header className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 py-6 sm:px-8 sm:py-7">
        <a
          className="text-[12px] font-semibold tracking-[0.24em] text-[var(--color-foreground)]"
          href="/"
          aria-label="MINDPRINT home"
        >
          MINDPRINT
        </a>

        <span className="text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--color-muted)]">
          Experimental assessment
        </span>
      </header>

      <section className="mx-auto grid w-full max-w-[1180px] items-center gap-12 px-5 pb-24 pt-20 sm:px-8 sm:pb-28 sm:pt-24 lg:min-h-[690px] lg:grid-cols-[minmax(0,1.16fr)_minmax(340px,0.84fr)] lg:gap-16 lg:pb-28 lg:pt-20">
        <div className="max-w-[720px]">
          <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.19em] text-[var(--color-accent)]">
            Cognitive assessment
          </p>

          <h1 className="text-balance text-[clamp(3.15rem,6.4vw,6.25rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
            How do you think when the answer isn&apos;t obvious?
          </h1>

          <p className="mt-7 max-w-[560px] text-pretty text-[16px] leading-7 text-[var(--color-muted)] sm:text-[17px]">
            MINDPRINT examines reasoning, adaptation, evidence judgment, and
            confidence through a short modern assessment.
          </p>

          <div className="mt-9">
            <Button className="min-w-[164px]" onClick={onBegin}>
              Begin assessment
            </Button>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-[460px] lg:justify-self-end"
          aria-hidden="true"
        >
          <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(49,92,140,0.08),transparent_70%)] blur-3xl" />
          <img
            alt=""
            className="relative block h-auto w-full"
            src="/mindprint-field.svg"
          />
        </div>
      </section>

      <section
        className="border-y border-[var(--color-border)] bg-white"
        aria-labelledby="measures-heading"
      >
        <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--color-muted)]">
                Scope
              </p>
              <h2
                id="measures-heading"
                className="mt-3 text-[26px] font-semibold tracking-[-0.04em]"
              >
                What it measures
              </h2>
            </div>

            <div className="grid border-t border-[var(--color-border)] sm:grid-cols-2">
              {dimensions.map((dimension) => (
                <div
                  key={dimension.label}
                  className="flex min-h-[72px] items-center gap-5 border-b border-[var(--color-border)] py-4 sm:pr-6 sm:odd:pr-8 sm:even:pl-8"
                >
                  <span className="text-[10px] font-medium tabular-nums tracking-[0.14em] text-[var(--color-muted-soft)]">
                    {dimension.index}
                  </span>
                  <p className="text-sm font-medium tracking-[-0.01em]">
                    {dimension.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="method"
        className="mx-auto grid w-full max-w-[1180px] gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.32fr_0.68fr] lg:gap-16 lg:py-24"
        aria-labelledby="method-heading"
      >
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--color-muted)]">
            Approach
          </p>
          <h2
            id="method-heading"
            className="mt-3 text-[26px] font-semibold tracking-[-0.04em]"
          >
            Method
          </h2>
        </div>

        <p className="max-w-[640px] text-pretty text-[17px] leading-8 tracking-[-0.012em] text-[var(--color-foreground-soft)] sm:text-[18px]">
          Short tasks introduce incomplete information, changing rules,
          conflicting evidence, and confidence judgments. Performance is
          summarized within the assessment itself.
        </p>
      </section>

      <section className="border-t border-[var(--color-border)]">
        <div className="mx-auto grid w-full max-w-[1180px] gap-4 px-5 py-9 sm:px-8 md:grid-cols-[0.32fr_0.68fr] md:gap-16">
          <p className="text-sm font-medium">Experimental by design.</p>
          <p className="max-w-[640px] text-sm leading-6 text-[var(--color-muted)]">
            Not an IQ test, clinical instrument, diagnostic tool, or population
            percentile assessment.
          </p>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-6 px-5 py-6 text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)] sm:px-8">
          <span>MINDPRINT</span>
          <span>V0.1</span>
        </div>
      </footer>
    </main>
  );
}

import { useEffect } from "react";

type ProcessingProfileProps = {
  onComplete: () => void;
};

export function ProcessingProfile({
  onComplete,
}: ProcessingProfileProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 950);
    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  return (
    <main className="min-h-screen">
      <section
        className="mx-auto flex min-h-screen w-full max-w-[920px] items-center px-5 py-20 sm:px-8"
        aria-live="polite"
      >
        <div className="w-full max-w-[620px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
            MINDPRINT
          </p>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Preparing your cognitive profile
          </h1>

          <div className="mt-10 border-y border-[var(--color-border)] py-6 text-sm leading-7 text-[var(--color-muted)]">
            <p>Summarizing task performance</p>
            <p>Comparing confidence with observed accuracy</p>
            <p>Preparing dimension scores</p>
          </div>
        </div>
      </section>
    </main>
  );
}

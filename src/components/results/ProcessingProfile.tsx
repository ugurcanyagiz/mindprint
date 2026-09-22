import { useEffect } from "react";

import type { UiMessages } from "../../i18n/types";

type ProcessingProfileProps = {
  onComplete: () => void;
  messages: UiMessages["results"];
};

export function ProcessingProfile({
  onComplete,
  messages,
}: ProcessingProfileProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 950);
    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  return (
    <main className="min-h-screen">
      <section
        className="mx-auto flex min-h-screen w-full max-w-[900px] items-center px-5 py-20 sm:px-8"
        aria-live="polite"
      >
        <div className="w-full max-w-[600px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
            MINDPRINT
          </p>
          <h1 className="mt-4 text-balance text-[36px] font-semibold leading-[1.05] tracking-[-0.05em] sm:text-[46px]">
            {messages.preparing}
          </h1>

          <div className="mt-9 border-t border-[var(--color-border)] pt-5 text-[13px] leading-6 text-[var(--color-muted)]">
            <p>{messages.processingPerformance}</p>
            <p>{messages.processingCalibration}</p>
            <p>{messages.processingScores}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

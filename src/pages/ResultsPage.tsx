import { useState } from "react";

import {
  createProfileSummary,
  type CognitiveProfile,
} from "../assessment/profile";
import { ProfileScores } from "../components/results/ProfileScores";
import { Button } from "../components/ui/Button";

type ResultsPageProps = {
  profile: CognitiveProfile;
  onRetake: () => void;
};

export function ResultsPage({
  profile,
  onRetake,
}: ResultsPageProps) {
  const [copied, setCopied] = useState(false);

  const copySummary = async () => {
    const summary = createProfileSummary(profile);

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <header className="mx-auto flex w-full max-w-[980px] items-center justify-between px-5 py-6 sm:px-8 sm:py-8">
        <span className="text-[13px] font-semibold tracking-[0.22em]">
          MINDPRINT
        </span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Cognitive profile
        </span>
      </header>

      <section className="mx-auto w-full max-w-[980px] px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="max-w-[760px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Assessment complete
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
            Cognitive Profile
          </h1>
          <p className="mt-5 max-w-[620px] text-sm leading-6 text-[var(--color-muted)]">
            Performance summary from this assessment session.
          </p>
        </div>

        <div className="mt-14">
          <ProfileScores profile={profile} />
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
          <div className="bg-white p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--color-muted)]">
              Average Confidence
            </p>
            <p className="mt-5 text-3xl font-semibold tabular-nums tracking-[-0.04em]">
              {profile.averageConfidence}%
            </p>
          </div>
          <div className="bg-white p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--color-muted)]">
              Response Accuracy
            </p>
            <p className="mt-5 text-3xl font-semibold tabular-nums tracking-[-0.04em]">
              {profile.responseAccuracy}%
            </p>
          </div>
          <div className="bg-white p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.17em] text-[var(--color-muted)]">
              Calibration Gap
            </p>
            <p className="mt-5 text-3xl font-semibold tabular-nums tracking-[-0.04em]">
              {profile.calibrationGap}
              <span className="ml-1 text-sm font-normal text-[var(--color-muted)]">
                pts
              </span>
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-[var(--color-border)]">
          {[
            ["Observed strengths", profile.strengthsText],
            ["Confidence calibration", profile.calibrationText],
            ["Assessment note", profile.assessmentNote],
          ].map(([label, body]) => (
            <section
              key={label}
              className="grid gap-4 border-b border-[var(--color-border)] py-7 md:grid-cols-[210px_1fr] md:gap-8"
            >
              <h2 className="text-sm font-medium">{label}</h2>
              <p className="max-w-[650px] text-sm leading-6 text-[var(--color-muted)]">
                {body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button onClick={onRetake}>Retake assessment</Button>
          <Button variant="secondary" onClick={copySummary}>
            {copied ? "Copied" : "Copy summary"}
          </Button>
        </div>

        <p className="mt-14 max-w-[760px] border-t border-[var(--color-border)] pt-6 text-[11px] leading-5 text-[var(--color-muted)]">
          Method note: These scores summarize performance within this
          experimental prototype. They are not standardized IQ scores, clinical
          findings, or population percentiles.
        </p>
      </section>
    </main>
  );
}

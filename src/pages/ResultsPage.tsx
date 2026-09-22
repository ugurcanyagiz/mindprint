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

  const interpretations = [
    ["Observed strengths", profile.strengthsText],
    ["Confidence calibration", profile.calibrationText],
    ["Assessment note", profile.assessmentNote],
  ] as const;

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <header className="mx-auto flex w-full max-w-[940px] items-center justify-between px-5 py-6 sm:px-8 sm:py-7">
        <span className="text-[12px] font-semibold tracking-[0.24em]">
          MINDPRINT
        </span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Cognitive profile
        </span>
      </header>

      <section className="mx-auto w-full max-w-[940px] px-5 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
        <div className="max-w-[700px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Assessment complete
          </p>
          <h1 className="mt-3 text-[38px] font-semibold tracking-[-0.055em] sm:text-[48px]">
            Cognitive Profile
          </h1>
          <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
            Performance summary from this assessment session.
          </p>
        </div>

        <div className="mt-11">
          <ProfileScores profile={profile} />
        </div>

        <div className="mt-12 grid border-y border-[var(--color-border)] md:grid-cols-3">
          {[
            ["Average confidence", `${profile.averageConfidence}%`, ""],
            ["Response accuracy", `${profile.responseAccuracy}%`, ""],
            ["Calibration gap", String(profile.calibrationGap), "pts"],
          ].map(([label, value, suffix], index) => (
            <div
              key={label}
              className={[
                "py-5 md:px-6 md:py-6",
                index > 0
                  ? "border-t border-[var(--color-border)] md:border-l md:border-t-0"
                  : "",
              ].join(" ")}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
                {label}
              </p>
              <p className="mt-3 text-[28px] font-semibold tabular-nums tracking-[-0.04em]">
                {value}
                {suffix ? (
                  <span className="ml-1 text-xs font-normal text-[var(--color-muted)]">
                    {suffix}
                  </span>
                ) : null}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[var(--color-border)]">
          {interpretations.map(([label, body]) => (
            <section
              key={label}
              className="grid gap-3 border-b border-[var(--color-border)] py-6 md:grid-cols-[205px_1fr] md:gap-8"
            >
              <h2 className="text-sm font-medium">{label}</h2>
              <p className="max-w-[620px] text-sm leading-6 text-[var(--color-muted)]">
                {body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button onClick={onRetake}>Retake assessment</Button>
          <Button variant="secondary" onClick={copySummary}>
            {copied ? "Copied" : "Copy summary"}
          </Button>
        </div>

        <p className="mt-12 max-w-[720px] border-t border-[var(--color-border)] pt-5 text-[10px] leading-5 text-[var(--color-muted)]">
          Method note: These scores summarize performance within this
          experimental prototype. They are not standardized IQ scores, clinical
          findings, or population percentiles.
        </p>
      </section>
    </main>
  );
}

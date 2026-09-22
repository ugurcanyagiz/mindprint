import { useState } from "react";

import type { CognitiveProfile } from "../assessment/profile";
import { ProfileScores } from "../components/results/ProfileScores";
import { Button } from "../components/ui/Button";
import type { Locale } from "../i18n/config";
import { getUiMessages } from "../i18n/messages";
import {
  createLocalizedProfileSummary,
  getLocalizedProfileInterpretation,
} from "../i18n/profile";

type ResultsPageProps = {
  profile: CognitiveProfile;
  locale: Locale;
  onRetake: () => void;
};

export function ResultsPage({
  profile,
  locale,
  onRetake,
}: ResultsPageProps) {
  const [copied, setCopied] = useState(false);
  const messages = getUiMessages(locale);
  const interpretation = getLocalizedProfileInterpretation(profile, locale);

  const copySummary = async () => {
    const summary = createLocalizedProfileSummary(profile, locale);

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const interpretations = [
    [messages.results.observedStrengths, interpretation.strengthsText],
    [messages.results.confidenceCalibration, interpretation.calibrationText],
    [messages.results.assessmentNote, interpretation.assessmentNote],
  ] as const;

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <header className="mx-auto flex w-full max-w-[940px] items-center justify-between gap-4 px-5 py-6 sm:px-8 sm:py-7">
        <span className="shrink-0 text-[12px] font-semibold tracking-[0.24em]">
          MINDPRINT
        </span>
        <span className="min-w-0 text-right text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          {messages.results.headerLabel}
        </span>
      </header>

      <section className="mx-auto w-full max-w-[940px] px-5 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
        <div className="max-w-[700px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {messages.results.assessmentComplete}
          </p>
          <h1 className="mt-3 text-[38px] font-semibold tracking-[-0.055em] sm:text-[48px]">
            {messages.results.title}
          </h1>
          <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
            {messages.results.subtitle}
          </p>
        </div>

        <div className="mt-11">
          <ProfileScores
            profile={profile}
            labels={messages.dimensions}
          />
        </div>

        <div className="mt-12 grid border-y border-[var(--color-border)] md:grid-cols-3">
          {[
            [
              messages.results.averageConfidence,
              `${profile.averageConfidence}%`,
              "",
            ],
            [
              messages.results.responseAccuracy,
              `${profile.responseAccuracy}%`,
              "",
            ],
            [
              messages.results.calibrationGap,
              String(profile.calibrationGap),
              messages.results.points,
            ],
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
          <Button onClick={onRetake}>
            {messages.results.retakeAssessment}
          </Button>
          <Button variant="secondary" onClick={copySummary}>
            {copied
              ? messages.results.copied
              : messages.results.copySummary}
          </Button>
        </div>

        <p className="mt-12 max-w-[760px] border-t border-[var(--color-border)] pt-5 text-[10px] leading-5 text-[var(--color-muted)]">
          {messages.results.methodNote}
        </p>
      </section>
    </main>
  );
}

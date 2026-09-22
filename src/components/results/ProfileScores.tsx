import type { CognitiveProfile } from "../../assessment/profile";
import type { CognitiveDimension } from "../../assessment/types";

const dimensionOrder: CognitiveDimension[] = [
  "reasoning",
  "adaptiveLearning",
  "evidenceEvaluation",
  "informationFiltering",
  "metacognitiveCalibration",
  "knowledgeTransfer",
];

type ProfileScoresProps = {
  profile: CognitiveProfile;
  labels: Record<CognitiveDimension, string>;
};

export function ProfileScores({
  profile,
  labels,
}: ProfileScoresProps) {
  return (
    <div className="border-t border-[var(--color-border)]">
      {dimensionOrder.map((dimension) => {
        const score = profile.scores[dimension];

        return (
          <div
            key={dimension}
            className="grid gap-2.5 border-b border-[var(--color-border)] py-4.5 sm:grid-cols-[205px_1fr_44px] sm:items-center sm:gap-6"
          >
            <div className="flex items-center justify-between gap-4 sm:block">
              <span className="text-sm font-medium">
                {labels[dimension]}
              </span>
              <span className="text-xs tabular-nums text-[var(--color-muted)] sm:hidden">
                {score}
              </span>
            </div>

            <div
              className="h-[5px] overflow-hidden rounded-full bg-[var(--color-track)]"
              role="meter"
              aria-label={labels[dimension]}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={score}
            >
              <div
                className="h-full rounded-full bg-[var(--color-accent)]"
                style={{ width: `${score}%` }}
              />
            </div>

            <span className="hidden text-right text-xs tabular-nums text-[var(--color-muted)] sm:block">
              {score}
            </span>
          </div>
        );
      })}
    </div>
  );
}

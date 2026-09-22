import {
  dimensionLabels,
  type CognitiveProfile,
} from "../../assessment/profile";
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
};

export function ProfileScores({ profile }: ProfileScoresProps) {
  return (
    <div className="border-t border-[var(--color-border)]">
      {dimensionOrder.map((dimension) => {
        const score = profile.scores[dimension];

        return (
          <div
            key={dimension}
            className="grid gap-3 border-b border-[var(--color-border)] py-5 sm:grid-cols-[210px_1fr_52px] sm:items-center sm:gap-6"
          >
            <span className="text-sm font-medium">
              {dimensionLabels[dimension]}
            </span>

            <div
              className="h-1.5 overflow-hidden rounded-full bg-[#e8ebef]"
              role="meter"
              aria-label={dimensionLabels[dimension]}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={score}
            >
              <div
                className="h-full rounded-full bg-[var(--color-accent)]"
                style={{ width: `${score}%` }}
              />
            </div>

            <span className="text-right text-sm tabular-nums text-[var(--color-muted)]">
              {score}
            </span>
          </div>
        );
      })}
    </div>
  );
}

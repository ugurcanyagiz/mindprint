import type { CognitiveProfile } from "../assessment/profile";
import type { CognitiveDimension } from "../assessment/types";
import { resolveLocale, type Locale } from "./config";
import { getUiMessages, interpolate } from "./messages";

export type LocalizedProfileInterpretation = {
  strengthsText: string;
  calibrationText: string;
  assessmentNote: string;
};

function rankedDimensions(profile: CognitiveProfile) {
  return (Object.entries(profile.scores) as [
    CognitiveDimension,
    number,
  ][]).sort((left, right) => right[1] - left[1]);
}

function formatDimensionList(
  dimensions: CognitiveDimension[],
  locale: Locale,
): string {
  const labels = getUiMessages(locale).dimensions;
  const names = dimensions.map((dimension) => labels[dimension]);

  if (names.length <= 1) {
    return names[0] ?? "";
  }

  if (locale === "ko") {
    return names.join(" 및 ");
  }

  const conjunction = locale === "tr" ? "ve" : locale === "es" ? "y" : "and";

  return names.length === 2
    ? `${names[0]} ${conjunction} ${names[1]}`
    : `${names.slice(0, -1).join(", ")} ${conjunction} ${names.at(-1)}`;
}

export function getLocalizedProfileInterpretation(
  profile: CognitiveProfile,
  localeInput: unknown,
): LocalizedProfileInterpretation {
  const locale = resolveLocale(localeInput);
  const messages = getUiMessages(locale).results;
  const ranked = rankedDimensions(profile);
  const spread = ranked[0][1] - ranked[ranked.length - 1][1];

  const strengthsText =
    spread <= 8
      ? messages.strengthEven
      : interpolate(messages.strengthComparative, {
          dimensions: formatDimensionList(
            ranked.slice(0, 2).map(([dimension]) => dimension),
            locale,
          ),
        });

  const calibrationText =
    profile.calibrationGap <= 15
      ? messages.calibrationClose
      : profile.calibrationGap <= 30
        ? messages.calibrationSomeDistance
        : messages.calibrationNoticeable;

  return {
    strengthsText,
    calibrationText,
    assessmentNote: messages.assessmentNoteBody,
  };
}

export function createLocalizedProfileSummary(
  profile: CognitiveProfile,
  localeInput: unknown,
): string {
  const locale = resolveLocale(localeInput);
  const messages = getUiMessages(locale);
  const interpretation = getLocalizedProfileInterpretation(profile, locale);

  const dimensions = (
    Object.entries(profile.scores) as [CognitiveDimension, number][]
  )
    .map(
      ([dimension, score]) =>
        `${messages.dimensions[dimension]}: ${score}/100`,
    )
    .join("\n");

  return [
    messages.results.summaryTitle,
    "",
    dimensions,
    "",
    `${messages.results.averageConfidence}: ${profile.averageConfidence}%`,
    `${messages.results.responseAccuracy}: ${profile.responseAccuracy}%`,
    `${messages.results.calibrationGap}: ${profile.calibrationGap} ${messages.results.points}`,
    "",
    interpretation.strengthsText,
    interpretation.calibrationText,
    "",
    messages.results.methodNote,
  ].join("\n");
}

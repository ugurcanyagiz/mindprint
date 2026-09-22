import { resolveLocale, type Locale } from "../i18n/config";
import { assessmentTasks } from "./tasks";
import type { AssessmentTask } from "./types";
import { enAssessment } from "./locales/en";
import { esAssessment } from "./locales/es";
import { koAssessment } from "./locales/ko";
import { trAssessment } from "./locales/tr";
import type {
  AssessmentLocaleContent,
  AssessmentTaskLocalization,
} from "./locales/types";

const localeContent: Record<Locale, AssessmentLocaleContent> = {
  en: enAssessment,
  tr: trAssessment,
  es: esAssessment,
  ko: koAssessment,
};

function contentFor(
  locale: Locale,
  taskId: string,
): AssessmentTaskLocalization {
  return (
    localeContent[locale][taskId] ??
    localeContent.en[taskId] ??
    {
      eyebrow: "",
      title: "",
    }
  );
}

export function getAssessmentLocaleContent(
  locale: unknown,
): AssessmentLocaleContent {
  return localeContent[resolveLocale(locale)];
}

export function getLocalizedAssessmentTasks(
  localeInput: unknown,
): AssessmentTask[] {
  const locale = resolveLocale(localeInput);

  return assessmentTasks.map((task) => {
    const localized = contentFor(locale, task.id);

    switch (task.kind) {
      case "multi-select":
        return {
          ...task,
          eyebrow: localized.eyebrow,
          title: localized.title,
          context:
            typeof localized.context === "string"
              ? localized.context
              : task.context,
          prompt: localized.prompt ?? task.prompt,
          metrics: task.metrics.map((metric) => ({
            ...metric,
            label: localized.metrics?.[metric.id] ?? metric.label,
          })),
        };
      case "ranking":
        return {
          ...task,
          eyebrow: localized.eyebrow,
          title: localized.title,
          claim:
            typeof localized.context === "string"
              ? localized.context
              : task.claim,
          prompt: localized.prompt ?? task.prompt,
          items: task.items.map((item) => ({
            ...item,
            label: localized.items?.[item.id]?.label ?? item.label,
            detail: localized.items?.[item.id]?.detail ?? item.detail,
          })),
        };
      case "adaptive-rule":
        return {
          ...task,
          eyebrow: localized.eyebrow,
          title: localized.title,
          phaseA: {
            ...task.phaseA,
            prompt: localized.phaseA?.prompt ?? task.phaseA.prompt,
          },
          phaseB: {
            ...task.phaseB,
            prompt: localized.phaseB?.prompt ?? task.phaseB.prompt,
          },
        };
      case "single-choice":
        return {
          ...task,
          eyebrow: localized.eyebrow,
          title: localized.title,
          context: Array.isArray(localized.context)
            ? localized.context
            : task.context,
          principle: localized.principle ?? task.principle,
          analysis: localized.analysis ?? task.analysis,
          prompt: localized.prompt ?? task.prompt,
          options: task.options.map((option) => ({
            ...option,
            label: localized.options?.[option.id] ?? option.label,
          })),
        };
    }
  });
}

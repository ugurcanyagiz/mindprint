import { DEFAULT_LOCALE, resolveLocale, type Locale } from "./config";
import { en } from "./en";
import { es } from "./es";
import { ko } from "./ko";
import { tr } from "./tr";
import type { UiMessages } from "./types";

const dictionaries: Record<Locale, UiMessages> = {
  en,
  tr,
  es,
  ko,
};

export function getUiMessages(locale: unknown): UiMessages {
  return dictionaries[resolveLocale(locale)] ?? dictionaries[DEFAULT_LOCALE];
}

export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) =>
      result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

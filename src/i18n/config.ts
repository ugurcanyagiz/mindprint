export const supportedLocales = ["en", "tr", "es", "ko"] as const;

export type Locale = (typeof supportedLocales)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LANGUAGE_STORAGE_KEY = "language";

export const localeOptions: ReadonlyArray<{
  code: Locale;
  shortLabel: string;
  label: string;
}> = [
  { code: "en", shortLabel: "EN", label: "English" },
  { code: "tr", shortLabel: "TR", label: "Türkçe" },
  { code: "es", shortLabel: "ES", label: "Español" },
  { code: "ko", shortLabel: "KO", label: "한국어" },
];

export function isSupportedLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    supportedLocales.includes(value as Locale)
  );
}

export function resolveLocale(value: unknown): Locale {
  return isSupportedLocale(value) ? value : DEFAULT_LOCALE;
}

export function getBrowserSuggestedLocale(
  languages: readonly string[] = typeof navigator === "undefined"
    ? []
    : navigator.languages,
): Locale | null {
  for (const language of languages) {
    const base = language.toLowerCase().split("-")[0];

    if (isSupportedLocale(base) && base !== DEFAULT_LOCALE) {
      return base;
    }
  }

  return null;
}

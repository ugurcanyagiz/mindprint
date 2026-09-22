import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  getBrowserSuggestedLocale,
  resolveLocale,
  supportedLocales,
} from "./config";
import { getUiMessages } from "./messages";

describe("localization config", () => {
  it("supports all four launch locales", () => {
    expect(supportedLocales).toEqual(["en", "tr", "es", "ko"]);

    for (const locale of supportedLocales) {
      expect(getUiMessages(locale).landing.headline.length).toBeGreaterThan(0);
      expect(getUiMessages(locale).results.title.length).toBeGreaterThan(0);
    }
  });

  it("falls back to English for unsupported locales", () => {
    expect(resolveLocale("fr")).toBe(DEFAULT_LOCALE);
    expect(getUiMessages("fr").landing.headline).toBe(
      getUiMessages("en").landing.headline,
    );
  });

  it("can detect a supported browser language without changing locale automatically", () => {
    expect(getBrowserSuggestedLocale(["fr-FR", "tr-TR"])).toBe("tr");
    expect(getBrowserSuggestedLocale(["fr-FR"])).toBeNull();
  });
});

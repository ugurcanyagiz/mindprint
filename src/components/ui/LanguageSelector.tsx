import { localeOptions } from "../../i18n/config";
import { useLocale } from "../../i18n/LocaleProvider";

type LanguageSelectorProps = {
  compact?: boolean;
};

export function LanguageSelector({
  compact = false,
}: LanguageSelectorProps) {
  const { locale, setLocale, messages } = useLocale();

  return (
    <select
      className={[
        "min-h-9 rounded-md border border-[var(--color-border)] bg-transparent px-2.5 text-[11px] font-medium text-[var(--color-muted)]",
        "outline-none transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)]",
        "focus-visible:border-[var(--color-focus)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/15",
        compact ? "max-w-[104px]" : "max-w-[124px]",
      ].join(" ")}
      value={locale}
      aria-label={messages.accessibility.languageLabel}
      onChange={(event) =>
        setLocale(event.currentTarget.value as typeof locale)
      }
    >
      {localeOptions.map((option) => (
        <option key={option.code} value={option.code}>
          {option.shortLabel} · {option.label}
        </option>
      ))}
    </select>
  );
}

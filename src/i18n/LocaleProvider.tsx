import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { readLocalValue, writeLocalValue } from "../lib/storage";
import {
  DEFAULT_LOCALE,
  LANGUAGE_STORAGE_KEY,
  resolveLocale,
  type Locale,
} from "./config";
import { getUiMessages } from "./messages";
import type { UiMessages } from "./types";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: UiMessages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  return resolveLocale(readLocalValue<string>(LANGUAGE_STORAGE_KEY));
}

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    writeLocalValue(LANGUAGE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      messages: getUiMessages(locale),
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}

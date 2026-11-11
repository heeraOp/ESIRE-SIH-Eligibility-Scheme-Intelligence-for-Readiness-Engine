import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  detectBrowserLanguage,
  normalizeLanguage,
  uiLocale,
} from "../Components/languages";

import { translate } from "./translations";

const STORAGE_KEY = "esire_language";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") {
      return "en";
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    return stored
      ? normalizeLanguage(stored)
      : detectBrowserLanguage();
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = uiLocale(language);
  }, [language]);

  const setLanguage = useCallback((value) => {
    setLanguageState(normalizeLanguage(value));
  }, []);

  const value = useMemo(() => {
    const locale = uiLocale(language);

    return {
      language,
      locale,

      t: (key) => translate(locale, key),

      setLanguage,
    };
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used within LanguageProvider"
    );
  }

  return context;
}
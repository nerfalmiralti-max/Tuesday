"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dictionaries, type Dictionary, type Language } from "@/lib/i18n";

type LanguageContextValue = {
  language: Language;
  dictionary: Dictionary;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "tuesday-language";

function syncDocumentLanguage(language: Language) {
  document.documentElement.lang = language;
  const path = window.location.pathname;
  const routeTitle =
    path === "/menu"
      ? language === "ru"
        ? "Меню"
        : "Мәзір"
      : path === "/booking"
        ? language === "ru"
          ? "Бронирование"
          : "Броньдау"
        : language === "ru"
          ? "Lounge Bar в Актау"
          : "Ақтаудағы Lounge Bar";
  document.title = `${routeTitle} | Tuesday Lounge Bar`;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ru" || saved === "kk") {
      const timeout = window.setTimeout(() => {
        setLanguageState(saved);
        syncDocumentLanguage(saved);
      }, 0);
      return () => window.clearTimeout(timeout);
    }
  }, []);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    syncDocumentLanguage(nextLanguage);
  }, []);

  const value = useMemo(
    () => ({ language, dictionary: dictionaries[language], setLanguage }),
    [language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

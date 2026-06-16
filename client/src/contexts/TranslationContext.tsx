import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  detectUserLanguage,
  setPreferredLanguage,
  t as translateKey,
} from "@/lib/translationService";

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect user's language on mount
    detectUserLanguage().then((lang) => {
      setLanguageState(lang);
      setPreferredLanguage(lang);
      setIsLoading(false);
    });
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    setPreferredLanguage(lang);
  };

  const t = (key: string) => translateKey(key, language);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}

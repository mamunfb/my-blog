import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/TranslationContext";

interface LanguageSwitchTransitionProps {
  children: React.ReactNode;
}

export default function LanguageSwitchTransition({
  children,
}: LanguageSwitchTransitionProps) {
  const { language } = useTranslation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLanguage, setDisplayLanguage] = useState(language);

  useEffect(() => {
    if (language !== displayLanguage) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayLanguage(language);
        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [language, displayLanguage]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        isTransitioning ? "opacity-50" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}

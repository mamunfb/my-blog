import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SUPPORTED_LANGUAGES,
  getSupportedLanguages,
  setPreferredLanguage,
  detectUserLanguage,
} from "@/lib/translationService";

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect user's language on mount
    detectUserLanguage().then((lang) => {
      setCurrentLanguage(lang);
      setPreferredLanguage(lang);
      setIsLoading(false);
    });
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setPreferredLanguage(lang);
    // Reload page to apply translations
    window.location.reload();
  };

  if (isLoading) {
    return (
      <button className="p-2 hover:bg-accent/10 rounded transition-colors">
        <Globe className="w-5 h-5" />
      </button>
    );
  }

  const currentLangData =
    SUPPORTED_LANGUAGES[currentLanguage as keyof typeof SUPPORTED_LANGUAGES];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 hover:bg-accent/10 rounded transition-colors text-sm"
          title="Change language"
        >
          <span className="text-lg">{currentLangData?.flag}</span>
          <span className="hidden sm:inline text-xs font-medium">
            {currentLangData?.nativeName}
          </span>
          <Globe className="w-4 h-4 sm:hidden" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
        <div className="px-2 py-1.5 text-xs font-semibold text-foreground/70">
          Select Language
        </div>
        {getSupportedLanguages().map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer ${
              currentLanguage === lang.code ? "bg-accent/20" : ""
            }`}
          >
            <span className="text-lg mr-2">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{lang.name}</span>
              <span className="text-xs text-foreground/60">{lang.nativeName}</span>
            </div>
            {currentLanguage === lang.code && (
              <span className="ml-auto text-accent">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

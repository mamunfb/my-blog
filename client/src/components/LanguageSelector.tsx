import { useState, useEffect } from "react";
import { Globe, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SUPPORTED_LANGUAGES,
  getSupportedLanguages,
  setPreferredLanguage,
  detectUserLanguage,
} from "@/lib/translationService";

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
    setSearchQuery("");
    setIsOpen(false);
    // Reload page to apply translations
    window.location.reload();
  };

  const allLanguages = getSupportedLanguages();
  const filteredLanguages = allLanguages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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
      <DropdownMenuContent align="end" className="w-64 p-0">
        {/* Search Input */}
        <div className="sticky top-0 bg-background border-b p-2 z-10">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search languages..."
              className="pl-8 h-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Language List */}
        <div className="max-h-80 overflow-y-auto">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`cursor-pointer px-3 py-2 ${
                  currentLanguage === lang.code ? "bg-accent/20" : ""
                }`}
              >
                <span className="text-lg mr-2">{lang.flag}</span>
                <div className="flex flex-col flex-1">
                  <span className="font-medium text-sm">{lang.name}</span>
                  <span className="text-xs text-foreground/60">
                    {lang.nativeName}
                  </span>
                </div>
                {currentLanguage === lang.code && (
                  <span className="ml-auto text-accent text-sm">✓</span>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No languages found
            </div>
          )}
        </div>

        {/* Language Count */}
        <div className="border-t px-3 py-1.5 text-xs text-muted-foreground text-center">
          {filteredLanguages.length} of {allLanguages.length} languages
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

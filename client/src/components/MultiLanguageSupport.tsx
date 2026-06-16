import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "bn", name: "বাংলা" },
];

interface MultiLanguageSupportProps {
  content: string;
  currentLanguage?: string;
  onTranslate?: (language: string, translatedContent: string) => void;
}

export default function MultiLanguageSupport({
  content,
  currentLanguage = "en",
  onTranslate,
}: MultiLanguageSupportProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (selectedLanguage === currentLanguage) {
      toast.info("Already in this language");
      return;
    }

    setIsTranslating(true);
    try {
      // Simulated translation - in production, use Google Translate API or similar
      const mockTranslation = `[${selectedLanguage.toUpperCase()}] ${content}`;
      setTranslatedContent(mockTranslation);
      onTranslate?.(selectedLanguage, mockTranslation);
      toast.success(`Translated to ${SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage)?.name}`);
    } catch (error) {
      toast.error("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">Translate Content</h3>
      </div>

      <div className="flex gap-2">
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleTranslate}
          disabled={isTranslating || selectedLanguage === currentLanguage}
          className="gap-2"
        >
          {isTranslating ? "Translating..." : "Translate"}
        </Button>
      </div>

      {translatedContent && (
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded-lg text-sm max-h-40 overflow-y-auto">
            <p className="text-foreground/70 line-clamp-5">
              {translatedContent}
            </p>
          </div>

          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="w-full gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Translation
              </>
            )}
          </Button>
        </div>
      )}

      <p className="text-xs text-foreground/50">
        Supports {SUPPORTED_LANGUAGES.length} languages
      </p>
    </div>
  );
}

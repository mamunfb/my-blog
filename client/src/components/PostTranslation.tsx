import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { SUPPORTED_LANGUAGES, getSupportedLanguages } from "@/lib/translationService";

interface PostTranslationProps {
  postId: number;
  originalContent: string;
  currentLanguage: string;
}

export default function PostTranslation({
  postId,
  originalContent,
  currentLanguage,
}: PostTranslationProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLanguage);

  const translateMutation = trpc.translation.translatePost.useMutation();

  const handleTranslate = async () => {
    if (selectedLanguage === "en") {
      setTranslatedContent(originalContent || '');
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateMutation.mutateAsync({
        postId,
        content: originalContent,
        targetLanguage: selectedLanguage,
      });

      setTranslatedContent(typeof result.translatedContent === 'string' ? result.translatedContent : '');
      toast.success(`Post translated to ${SUPPORTED_LANGUAGES[selectedLanguage]?.name}`);
    } catch (error) {
      toast.error("Failed to translate post");
      console.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">Translate Post</h3>
      </div>

      <div className="flex gap-2">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md border border-border bg-background"
        >
          {getSupportedLanguages().map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>

        <Button
          onClick={handleTranslate}
          disabled={isTranslating || selectedLanguage === "en"}
          size="sm"
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </Button>
      </div>

      {translatedContent && (
        <div className="mt-4 p-3 bg-background rounded border border-border">
          <p className="text-sm text-foreground/70 mb-2">
            Translated to {SUPPORTED_LANGUAGES[selectedLanguage]?.name}:
          </p>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {translatedContent}
          </div>
        </div>
      )}
    </div>
  );
}

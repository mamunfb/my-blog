import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AIContentSuggestionsProps {
  currentText: string;
  onApply?: (suggestion: string) => void;
}

export default function AIContentSuggestions({
  currentText,
  onApply,
}: AIContentSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const generateSuggestions = async () => {
    if (!currentText.trim()) {
      toast.error("Please write some content first");
      return;
    }

    setIsLoading(true);
    try {
      // Simulated AI suggestions - in production, call your LLM API
      const mockSuggestions = [
        `${currentText} Furthermore, this demonstrates...`,
        `${currentText} In addition, it's worth noting that...`,
        `${currentText} To elaborate on this point...`,
        `${currentText} This is particularly important because...`,
        `${currentText} Building on this idea...`,
      ];

      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
      toast.success("Suggestions generated!");
    } catch (error) {
      toast.error("Failed to generate suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    onApply?.(suggestion);
    toast.success("Suggestion applied!");
    setShowSuggestions(false);
  };

  const copySuggestion = (suggestion: string) => {
    navigator.clipboard.writeText(suggestion);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={generateSuggestions}
        disabled={isLoading || !currentText.trim()}
        className="gap-2 w-full"
        variant="outline"
      >
        <Sparkles className="w-4 h-4" />
        {isLoading ? "Generating..." : "Get AI Suggestions"}
      </Button>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              AI Suggestions
            </h4>
            <button
              onClick={generateSuggestions}
              className="text-xs text-accent hover:text-accent/80"
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 bg-background border border-border rounded-lg text-sm"
              >
                <p className="mb-2 line-clamp-2">{suggestion}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => applySuggestion(suggestion)}
                    className="text-xs"
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copySuggestion(suggestion)}
                    className="text-xs gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

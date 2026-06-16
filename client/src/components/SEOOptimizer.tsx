import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertCircle, Info, Zap } from "lucide-react";

interface SEOScore {
  score: number;
  title: string;
  description: string;
  issues: string[];
  suggestions: string[];
}

interface SEOOptimizerProps {
  title?: string;
  description?: string;
  content?: string;
  slug?: string;
  onOptimize?: (data: { title: string; description: string; slug: string }) => void;
}

export default function SEOOptimizer({
  title = "",
  description = "",
  content = "",
  slug = "",
  onOptimize,
}: SEOOptimizerProps) {
  const [seoTitle, setSeoTitle] = useState(title);
  const [seoDescription, setSeoDescription] = useState(description);
  const [seoSlug, setSeoSlug] = useState(slug);
  const [seoScore, setSeoScore] = useState<SEOScore | null>(null);

  const analyzeSEO = () => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 0;

    // Title analysis
    if (seoTitle.length === 0) {
      issues.push("Title is missing");
    } else if (seoTitle.length < 30) {
      issues.push("Title is too short (minimum 30 characters)");
    } else if (seoTitle.length > 60) {
      suggestions.push("Title might be too long (ideal: 30-60 characters)");
    } else {
      score += 20;
    }

    // Description analysis
    if (seoDescription.length === 0) {
      issues.push("Meta description is missing");
    } else if (seoDescription.length < 120) {
      issues.push("Meta description is too short (minimum 120 characters)");
    } else if (seoDescription.length > 160) {
      suggestions.push("Meta description might be too long (ideal: 120-160 characters)");
    } else {
      score += 20;
    }

    // Slug analysis
    if (seoSlug.length === 0) {
      issues.push("URL slug is missing");
    } else if (!/^[a-z0-9-]+$/.test(seoSlug)) {
      issues.push("URL slug contains invalid characters");
    } else if (seoSlug.split("-").length < 2) {
      suggestions.push("URL slug could be more descriptive");
    } else {
      score += 15;
    }

    // Content analysis
    if (content.length === 0) {
      issues.push("Content is missing");
    } else if (content.length < 300) {
      issues.push("Content is too short (minimum 300 characters)");
    } else {
      score += 20;
    }

    // Keyword presence
    const titleWords = seoTitle.toLowerCase().split(" ");
    const descriptionWords = seoDescription.toLowerCase().split(" ");
    const contentWords = content.toLowerCase().split(" ");

    const commonWords = titleWords.filter(
      (word) =>
        word.length > 3 &&
        descriptionWords.includes(word) &&
        contentWords.includes(word)
    );

    if (commonWords.length > 0) {
      score += 15;
    } else {
      suggestions.push("Keywords in title, description, and content should align");
    }

    // Readability
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgWordsPerSentence = contentWords.length / Math.max(sentences.length, 1);

    if (avgWordsPerSentence > 20) {
      suggestions.push("Consider breaking up long sentences for better readability");
    } else {
      score += 10;
    }

    setSeoScore({
      score: Math.min(100, score),
      title: seoTitle,
      description: seoDescription,
      issues,
      suggestions,
    });
  };

  const handleOptimize = () => {
    if (seoTitle && seoDescription && seoSlug) {
      onOptimize?.({
        title: seoTitle,
        description: seoDescription,
        slug: seoSlug,
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900";
    return "bg-red-100 dark:bg-red-900";
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-accent" />
          <h3 className="font-bold">SEO Optimizer</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold">SEO Title</label>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Page title (30-60 characters)"
              maxLength={60}
            />
            <div className="text-xs text-foreground/50 mt-1">
              {seoTitle.length}/60 characters
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Meta Description</label>
            <Textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Meta description (120-160 characters)"
              maxLength={160}
              rows={3}
            />
            <div className="text-xs text-foreground/50 mt-1">
              {seoDescription.length}/160 characters
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">URL Slug</label>
            <Input
              value={seoSlug}
              onChange={(e) =>
                setSeoSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              placeholder="url-slug-format"
            />
          </div>

          <Button onClick={analyzeSEO} className="w-full gap-2">
            <Zap className="w-4 h-4" />
            Analyze SEO
          </Button>
        </div>
      </Card>

      {seoScore && (
        <Card className="p-4">
          <div className="space-y-4">
            {/* Score */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-1">SEO Score</h4>
                <p className="text-sm text-foreground/70">
                  {seoScore.score >= 80
                    ? "Excellent!"
                    : seoScore.score >= 60
                      ? "Good, but can improve"
                      : "Needs improvement"}
                </p>
              </div>
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${getScoreBgColor(seoScore.score)} ${getScoreColor(seoScore.score)}`}
              >
                {seoScore.score}
              </div>
            </div>

            {/* Issues */}
            {seoScore.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  Issues ({seoScore.issues.length})
                </h4>
                <ul className="space-y-1">
                  {seoScore.issues.map((issue, i) => (
                    <li key={i} className="text-sm text-foreground/70">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {seoScore.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                  <Info className="w-4 h-4" />
                  Suggestions ({seoScore.suggestions.length})
                </h4>
                <ul className="space-y-1">
                  {seoScore.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-foreground/70">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success */}
            {seoScore.issues.length === 0 && seoScore.suggestions.length === 0 && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Perfect SEO optimization!</span>
              </div>
            )}

            <Button onClick={handleOptimize} className="w-full">
              Apply SEO Optimization
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

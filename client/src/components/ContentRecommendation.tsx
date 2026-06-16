import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight } from "lucide-react";

interface RecommendedContent {
  id: number;
  title: string;
  category: string;
  readingTime: number;
  relevanceScore: number;
}

interface ContentRecommendationProps {
  currentPostId?: number;
  userPreferences?: string[];
  onSelectContent?: (contentId: number) => void;
}

export default function ContentRecommendation({
  currentPostId,
  userPreferences = [],
  onSelectContent,
}: ContentRecommendationProps) {
  const [recommendations, setRecommendations] = useState<RecommendedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading recommendations based on user preferences
    if (userPreferences.length > 0 || currentPostId) {
      setIsLoading(true);
      // In a real app, this would call an API
      setTimeout(() => {
        const mockRecommendations: RecommendedContent[] = [
          {
            id: 1,
            title: "Advanced React Patterns for Scalable Applications",
            category: "Technology",
            readingTime: 8,
            relevanceScore: 95,
          },
          {
            id: 2,
            title: "Building Responsive Web Designs with Modern CSS",
            category: "Design",
            readingTime: 6,
            relevanceScore: 87,
          },
          {
            id: 3,
            title: "The Future of Web Development: Trends to Watch",
            category: "Technology",
            readingTime: 7,
            relevanceScore: 82,
          },
          {
            id: 4,
            title: "User Experience Best Practices in 2026",
            category: "Design",
            readingTime: 5,
            relevanceScore: 78,
          },
        ];
        setRecommendations(mockRecommendations);
        setIsLoading(false);
      }, 500);
    }
  }, [userPreferences, currentPostId]);

  if (recommendations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-bold">Recommended For You</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-3 bg-background border border-border rounded-lg hover:border-accent/50 transition-all cursor-pointer group"
              onClick={() => onSelectContent?.(rec.id)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-accent transition-colors">
                    {rec.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded">
                      {rec.category}
                    </span>
                    <span className="text-xs text-foreground/50">
                      {rec.readingTime} min read
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs font-semibold text-accent">
                    {rec.relevanceScore}% match
                  </div>
                  <ChevronRight className="w-4 h-4 text-foreground/50 group-hover:text-accent transition-colors" />
                </div>
              </div>

              {/* Relevance bar */}
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent/50 transition-all"
                  style={{ width: `${rec.relevanceScore}%` }}
                />
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full gap-2 mt-4">
            <Sparkles className="w-4 h-4" />
            See More Recommendations
          </Button>
        </div>
      )}
    </Card>
  );
}

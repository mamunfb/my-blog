import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { BookOpen, ChevronRight } from "lucide-react";

interface SeriesPost {
  id: number;
  title: string;
  slug: string;
  order: number;
}

interface PostSeriesProps {
  seriesName: string;
  posts: SeriesPost[];
  currentPostId: number;
}

export default function PostSeries({
  seriesName,
  posts,
  currentPostId,
}: PostSeriesProps) {
  const [, navigate] = useLocation();

  if (!posts || posts.length === 0) {
    return null;
  }

  const sortedPosts = [...posts].sort((a, b) => a.order - b.order);
  const currentIndex = sortedPosts.findIndex((p) => p.id === currentPostId);

  return (
    <Card className="p-6 bg-accent/5 border-accent/20">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-accent" />
        <h3 className="font-bold text-lg">Series: {seriesName}</h3>
      </div>

      <div className="space-y-2">
        {sortedPosts.map((post, index) => (
          <button
            key={post.id}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
              post.id === currentPostId
                ? "bg-accent text-accent-foreground"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm font-semibold flex-shrink-0">
                Part {index + 1}
              </span>
              <span className="text-sm line-clamp-1">{post.title}</span>
            </div>
            {post.id !== currentPostId && (
              <ChevronRight className="w-4 h-4 flex-shrink-0 ml-2" />
            )}
          </button>
        ))}
      </div>

      {currentIndex >= 0 && (
        <div className="mt-4 pt-4 border-t border-accent/20 text-xs text-foreground/70">
          <p>
            Reading Part {currentIndex + 1} of {sortedPosts.length}
          </p>
        </div>
      )}
    </Card>
  );
}

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function TagCloud() {
  const [, navigate] = useLocation();
  const { data: allPosts, isLoading } = trpc.blog.getLatestPosts.useQuery({
    limit: 1000,
    offset: 0,
  });

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
    );
  }

  // Extract and count tags from all posts
  const tagCounts: Record<string, number> = {};
  allPosts?.forEach((post) => {
    // Tags would be extracted from post data if available
    // For now, we'll create sample tags from categories
    if (post.categoryId) {
      const tagName = `tag-${post.categoryId}`;
      tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
    }
  });

  const tags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  if (tags.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/70">
        <p>No tags yet</p>
      </div>
    );
  }

  // Calculate size range for tag cloud
  const maxCount = Math.max(...tags.map((t) => t.count));
  const minCount = Math.min(...tags.map((t) => t.count));
  const range = maxCount - minCount || 1;

  const getSizeClass = (count: number) => {
    const normalized = (count - minCount) / range;
    if (normalized > 0.7) return "text-lg font-bold";
    if (normalized > 0.4) return "text-base font-semibold";
    return "text-sm";
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {tags.map(({ tag, count }) => (
        <Button
          key={tag}
          variant="outline"
          size="sm"
          onClick={() => navigate(`/blog?tag=${encodeURIComponent(tag)}`)}
          className={`rounded-full ${getSizeClass(count)}`}
        >
          {tag.replace("tag-", "")}
          <span className="ml-2 text-xs opacity-70">({count})</span>
        </Button>
      ))}
    </div>
  );
}

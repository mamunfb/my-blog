import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useLocation } from "wouter";

interface PopularPostsProps {
  limit?: number;
}

export default function PopularPosts({ limit = 5 }: PopularPostsProps) {
  const [, navigate] = useLocation();
  const { data: allPosts, isLoading } = trpc.blog.getLatestPosts.useQuery({
    limit: 1000,
    offset: 0,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-3">
            <Skeleton className="h-4 mb-2 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  const popularPosts = (allPosts || [])
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limit);

  if (popularPosts.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/70">
        <p>No posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {popularPosts.map((post, index) => (
        <Card
          key={post.id}
          className="p-3 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/blog/${post.slug}`)}
        >
          <div className="flex gap-3">
            <div className="text-2xl font-bold text-accent/50 min-w-8">
              #{index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm line-clamp-2 hover:text-accent transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-foreground/60 mt-1">
                <Eye className="w-3 h-3" />
                <span>{post.viewCount || 0} views</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

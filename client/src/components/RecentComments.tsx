import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentCommentsProps {
  limit?: number;
}

export default function RecentComments({ limit = 5 }: RecentCommentsProps) {
  const { data: allPosts, isLoading } = trpc.blog.getLatestPosts.useQuery({
    limit: 1000,
    offset: 0,
  });

  const { data: comments, isLoading: commentsLoading } =
    trpc.blog.getPostComments.useQuery(
      { postId: allPosts?.[0]?.id || 0 },
      { enabled: !!allPosts?.[0]?.id }
    );

  if (isLoading || commentsLoading) {
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

  const recentComments = comments?.slice(0, limit) || [];

  if (recentComments.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/70">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No comments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentComments.map((comment) => (
        <Card key={comment.id} className="p-3 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium line-clamp-2 mb-1">
            {comment.content}
          </p>
          <p className="text-xs text-foreground/60">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </p>
        </Card>
      ))}
    </div>
  );
}

import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Eye, MessageSquare, TrendingUp } from "lucide-react";

export default function BlogStatistics() {
  const { data: allPosts, isLoading: postsLoading } = trpc.blog.getLatestPosts.useQuery({
    limit: 1000,
    offset: 0,
  });

  // Comments are already tracked in the database
  const totalComments = 0; // This would be fetched from the server
  const commentsLoading = false;

  if (postsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-8 mb-2 w-1/2" />
            <Skeleton className="h-4" />
          </Card>
        ))}
      </div>
    );
  }

  const totalPosts = allPosts?.length || 0;
  const totalViews = allPosts?.reduce((sum, post) => sum + (post.viewCount || 0), 0) || 0;
  const avgViewsPerPost = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;

  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Total Comments",
      value: totalComments,
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "Avg Views/Post",
      value: avgViewsPerPost,
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-foreground/70 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        );
      })}
    </div>
  );
}

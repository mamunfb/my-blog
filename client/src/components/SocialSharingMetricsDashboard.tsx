import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Facebook, Twitter, Linkedin, MessageCircle, Send, Mail, Share2 } from "lucide-react";

interface SharingMetrics {
  platform: string;
  shares: number;
  icon: React.ReactNode;
  color: string;
}

interface PostSharingData {
  postId: number;
  postTitle: string;
  totalShares: number;
  byPlatform: Record<string, number>;
}

export default function SocialSharingMetricsDashboard() {
  const [metrics, setMetrics] = useState<SharingMetrics[]>([]);
  const [topPosts, setTopPosts] = useState<PostSharingData[]>([]);
  const [totalShares, setTotalShares] = useState(0);

  useEffect(() => {
    // Load sharing metrics from localStorage
    const loadMetrics = () => {
      try {
        const stored = localStorage.getItem("socialSharingMetrics");
        if (stored) {
          const data = JSON.parse(stored);
          
          // Aggregate metrics by platform
          const platformMetrics: Record<string, number> = {
            facebook: 0,
            twitter: 0,
            linkedin: 0,
            whatsapp: 0,
            telegram: 0,
            email: 0,
            reddit: 0,
          };

          // Aggregate post data
          const postMap: Record<number, PostSharingData> = {};

          Object.entries(data).forEach(([key, value]: [string, any]) => {
            const [postId, platform] = key.split("_");
            const count = value as number;

            // Update platform metrics
            if (platformMetrics.hasOwnProperty(platform)) {
              platformMetrics[platform] += count;
            }

            // Update post metrics
            if (!postMap[parseInt(postId)]) {
              postMap[parseInt(postId)] = {
                postId: parseInt(postId),
                postTitle: `Post ${postId}`,
                totalShares: 0,
                byPlatform: {},
              };
            }
            postMap[parseInt(postId)].byPlatform[platform] = count;
            postMap[parseInt(postId)].totalShares += count;
          });

          // Convert to array and sort
          const metricsArray: SharingMetrics[] = [
            { platform: "Facebook", shares: platformMetrics.facebook, icon: <Facebook className="w-4 h-4" />, color: "#1877F2" },
            { platform: "Twitter", shares: platformMetrics.twitter, icon: <Twitter className="w-4 h-4" />, color: "#1DA1F2" },
            { platform: "LinkedIn", shares: platformMetrics.linkedin, icon: <Linkedin className="w-4 h-4" />, color: "#0A66C2" },
            { platform: "WhatsApp", shares: platformMetrics.whatsapp, icon: <MessageCircle className="w-4 h-4" />, color: "#25D366" },
            { platform: "Telegram", shares: platformMetrics.telegram, icon: <Send className="w-4 h-4" />, color: "#0088cc" },
            { platform: "Email", shares: platformMetrics.email, icon: <Mail className="w-4 h-4" />, color: "#EA4335" },
            { platform: "Reddit", shares: platformMetrics.reddit, icon: <Share2 className="w-4 h-4" />, color: "#FF4500" },
          ];

          const topPostsArray = Object.values(postMap)
            .sort((a, b) => b.totalShares - a.totalShares)
            .slice(0, 5);

          const total = Object.values(platformMetrics).reduce((a, b) => a + b, 0);

          setMetrics(metricsArray);
          setTopPosts(topPostsArray);
          setTotalShares(total);
        }
      } catch (error) {
        console.error("Error loading metrics:", error);
      }
    };

    loadMetrics();
    // Refresh every 30 seconds
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const chartData = metrics.filter((m) => m.shares > 0);
  const colors = chartData.map((m) => m.color);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Shares Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Shares</h3>
          <p className="text-4xl font-bold text-primary">{totalShares}</p>
          <p className="text-sm text-foreground/60 mt-2">Across all platforms</p>
        </Card>

        {/* Top Platform Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Top Platform</h3>
          {chartData.length > 0 ? (
            <>
              <p className="text-2xl font-bold">{chartData[0].platform}</p>
              <p className="text-sm text-foreground/60 mt-2">{chartData[0].shares} shares</p>
            </>
          ) : (
            <p className="text-sm text-foreground/60">No data yet</p>
          )}
        </Card>
      </div>

      {/* Platform Distribution Chart */}
      {chartData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Shares by Platform</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="shares" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Platform Distribution Pie Chart */}
      {chartData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ platform, shares }) => `${platform}: ${shares}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="shares"
              >
                {colors.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Top Posts */}
      {topPosts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Posts by Shares</h3>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.postId} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div>
                  <p className="font-medium">#{index + 1} - Post {post.postId}</p>
                  <p className="text-sm text-foreground/60">{post.totalShares} total shares</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{post.totalShares}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Platform Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Platform Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.platform} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                {metric.icon}
                <span className="font-medium">{metric.platform}</span>
              </div>
              <span className="text-lg font-bold">{metric.shares}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Empty State */}
      {totalShares === 0 && (
        <Card className="p-12 text-center">
          <p className="text-foreground/60">No sharing data yet. Start sharing posts to see metrics!</p>
        </Card>
      )}
    </div>
  );
}

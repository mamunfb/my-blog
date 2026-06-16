import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  avgTimeOnSite: number;
  bounceRate: number;
  topPosts: Array<{ title: string; views: number }>;
  trafficByDay: Array<{ date: string; views: number }>;
  deviceBreakdown: Array<{ device: string; percentage: number }>;
  referrers: Array<{ source: string; count: number }>;
}

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      const mockData: AnalyticsData = {
        totalViews: 12543,
        uniqueVisitors: 3421,
        avgTimeOnSite: 4.5,
        bounceRate: 32,
        topPosts: [
          { title: "Getting Started with React", views: 2341 },
          { title: "Web Design Trends 2024", views: 1893 },
          { title: "JavaScript Best Practices", views: 1654 },
        ],
        trafficByDay: [
          { date: "Mon", views: 1200 },
          { date: "Tue", views: 1900 },
          { date: "Wed", views: 1500 },
          { date: "Thu", views: 2200 },
          { date: "Fri", views: 2800 },
          { date: "Sat", views: 1800 },
          { date: "Sun", views: 1242 },
        ],
        deviceBreakdown: [
          { device: "Desktop", percentage: 65 },
          { device: "Mobile", percentage: 28 },
          { device: "Tablet", percentage: 7 },
        ],
        referrers: [
          { source: "Google", count: 2341 },
          { source: "Direct", count: 1893 },
          { source: "Twitter", count: 1654 },
          { source: "LinkedIn", count: 1200 },
        ],
      };
      setAnalytics(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {analytics.totalViews.toLocaleString()}
          </div>
          <div className="text-xs text-foreground/70 mt-1">Total Views</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {analytics.uniqueVisitors.toLocaleString()}
          </div>
          <div className="text-xs text-foreground/70 mt-1">Unique Visitors</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {analytics.avgTimeOnSite.toFixed(1)}m
          </div>
          <div className="text-xs text-foreground/70 mt-1">Avg Time</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {analytics.bounceRate}%
          </div>
          <div className="text-xs text-foreground/70 mt-1">Bounce Rate</div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="traffic" className="gap-2">
            <LineChart className="w-4 h-4" />
            <span className="hidden sm:inline">Traffic</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-2">
            <BarChart className="w-4 h-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-2">
            <PieChart className="w-4 h-4" />
            <span className="hidden sm:inline">Devices</span>
          </TabsTrigger>
          <TabsTrigger value="referrers">Referrers</TabsTrigger>
        </TabsList>

        {/* Traffic Tab */}
        <TabsContent value="traffic">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Weekly Traffic</h3>
            <div className="space-y-2">
              {analytics.trafficByDay.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium">{day.date}</span>
                  <div className="flex-1 bg-muted rounded h-6 relative overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all"
                      style={{
                        width: `${(day.views / 3000) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-foreground/70 w-16 text-right">
                    {day.views}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Top Posts Tab */}
        <TabsContent value="posts">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Top Performing Posts</h3>
            <div className="space-y-3">
              {analytics.topPosts.map((post, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-background border border-border rounded"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{post.title}</h4>
                    <span className="text-sm font-bold text-accent">
                      {post.views}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded h-2">
                    <div
                      className="bg-accent h-full rounded"
                      style={{
                        width: `${(post.views / 2341) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Device Breakdown Tab */}
        <TabsContent value="devices">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Device Breakdown</h3>
            <div className="space-y-3">
              {analytics.deviceBreakdown.map((device) => (
                <div key={device.device}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{device.device}</span>
                    <span className="text-sm font-bold text-accent">
                      {device.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full transition-all"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Referrers Tab */}
        <TabsContent value="referrers">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Top Referrers</h3>
            <div className="space-y-2">
              {analytics.referrers.map((ref) => (
                <div
                  key={ref.source}
                  className="flex items-center justify-between p-2 bg-background border border-border rounded"
                >
                  <span className="text-sm font-medium">{ref.source}</span>
                  <span className="text-sm font-bold text-accent">
                    {ref.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Export Analytics</span>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors">
              CSV
            </button>
            <button className="text-xs px-3 py-1 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors">
              PDF
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

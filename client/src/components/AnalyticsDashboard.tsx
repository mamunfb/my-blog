import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface LanguageStats {
  language: string;
  views: number;
  percentage: number;
}

interface TimeSeriesData {
  date: string;
  views: number;
}

const COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#84cc16",
];

/**
 * Analytics Dashboard Component
 * Displays language usage statistics and trends
 */
export default function AnalyticsDashboard() {
  const [languageStats, setLanguageStats] = useState<LanguageStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    const mockData: LanguageStats[] = [
      { language: "English", views: 1250, percentage: 35 },
      { language: "Spanish", views: 850, percentage: 24 },
      { language: "French", views: 620, percentage: 17 },
      { language: "German", views: 480, percentage: 14 },
      { language: "Japanese", views: 320, percentage: 10 },
    ];

    setTimeout(() => {
      setLanguageStats(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const totalViews = languageStats.reduce((sum, stat) => sum + stat.views, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-foreground/70">Language usage and engagement metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-foreground/70 mb-2">Total Views</div>
          <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-foreground/70 mb-2">Languages Tracked</div>
          <div className="text-3xl font-bold">{languageStats.length}</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-foreground/70 mb-2">Top Language</div>
          <div className="text-3xl font-bold">
            {languageStats[0]?.language || "N/A"}
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Views by Language</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={languageStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="language" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Language Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ language, percentage }) => `${language} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="views"
              >
                {languageStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Language Statistics Table */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Language Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">Language</th>
                <th className="text-right py-3 px-4 font-semibold">Views</th>
                <th className="text-right py-3 px-4 font-semibold">Percentage</th>
                <th className="text-right py-3 px-4 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {languageStats.map((stat, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 px-4">{stat.language}</td>
                  <td className="text-right py-3 px-4">{stat.views.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">{stat.percentage}%</td>
                  <td className="text-right py-3 px-4">
                    <span className="text-green-600 font-semibold">↑ 12%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-accent/10 border-accent">
        <h3 className="text-lg font-semibold mb-3">Key Insights</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ English is your primary audience language with {languageStats[0]?.percentage}% of views</li>
          <li>✓ Spanish and French combined represent {(languageStats[1]?.percentage || 0) + (languageStats[2]?.percentage || 0)}% of traffic</li>
          <li>✓ Consider creating more content in your top 3 languages for maximum engagement</li>
          <li>✓ Monitor emerging languages for potential growth opportunities</li>
        </ul>
      </Card>
    </div>
  );
}

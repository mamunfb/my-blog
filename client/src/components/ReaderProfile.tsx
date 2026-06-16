import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, TrendingUp, BookOpen, Heart } from "lucide-react";

interface ReaderStats {
  totalPostsRead: number;
  totalTimeSpent: number;
  favoriteCategories: string[];
  readingStreak: number;
  achievements: string[];
  engagementLevel: "beginner" | "regular" | "power-reader";
}

interface ReaderProfileProps {
  userId?: number;
  userName?: string;
  userEmail?: string;
}

export default function ReaderProfile({
  userId,
  userName = "Reader",
  userEmail,
}: ReaderProfileProps) {
  const [stats, setStats] = useState<ReaderStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      // Simulate loading reader stats
      setTimeout(() => {
        const mockStats: ReaderStats = {
          totalPostsRead: 24,
          totalTimeSpent: 480, // minutes
          favoriteCategories: ["Technology", "Design", "Business"],
          readingStreak: 7,
          achievements: [
            "First Post Read",
            "Week Warrior",
            "Comment Master",
            "Share Champion",
          ],
          engagementLevel: "power-reader",
        };
        setStats(mockStats);
        setIsLoading(false);
      }, 500);
    }
  }, [userId]);

  if (!stats && !isLoading) {
    return null;
  }

  const getEngagementBadge = (level: string) => {
    switch (level) {
      case "power-reader":
        return "🔥 Power Reader";
      case "regular":
        return "📖 Regular Reader";
      default:
        return "👶 Beginner";
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <Card className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <User className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">{userName}</h3>
            {userEmail && (
              <p className="text-sm text-foreground/70">{userEmail}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-accent">
              {getEngagementBadge(stats?.engagementLevel || "beginner")}
            </div>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 text-center">
              <BookOpen className="w-5 h-5 mx-auto mb-2 text-accent" />
              <div className="font-bold text-lg">{stats.totalPostsRead}</div>
              <div className="text-xs text-foreground/70">Posts Read</div>
            </Card>

            <Card className="p-3 text-center">
              <TrendingUp className="w-5 h-5 mx-auto mb-2 text-accent" />
              <div className="font-bold text-lg">{stats.readingStreak}</div>
              <div className="text-xs text-foreground/70">Day Streak</div>
            </Card>

            <Card className="p-3 text-center">
              <Heart className="w-5 h-5 mx-auto mb-2 text-accent" />
              <div className="font-bold text-lg">
                {Math.round(stats.totalTimeSpent / 60)}h
              </div>
              <div className="text-xs text-foreground/70">Time Spent</div>
            </Card>

            <Card className="p-3 text-center">
              <User className="w-5 h-5 mx-auto mb-2 text-accent" />
              <div className="font-bold text-lg">
                {stats.achievements.length}
              </div>
              <div className="text-xs text-foreground/70">Achievements</div>
            </Card>
          </div>

          {/* Favorite Categories */}
          {stats.favoriteCategories.length > 0 && (
            <Card className="p-3">
              <h4 className="font-semibold text-sm mb-2">Favorite Categories</h4>
              <div className="flex flex-wrap gap-2">
                {stats.favoriteCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs px-2 py-1 bg-accent/10 text-accent rounded"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Achievements */}
          {stats.achievements.length > 0 && (
            <Card className="p-3">
              <h4 className="font-semibold text-sm mb-2">Achievements</h4>
              <div className="grid grid-cols-2 gap-2">
                {stats.achievements.map((achievement) => (
                  <div
                    key={achievement}
                    className="p-2 bg-accent/5 border border-accent/20 rounded text-xs text-center"
                  >
                    ⭐ {achievement}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              View Reading History
            </Button>
            <Button variant="outline" className="flex-1">
              Preferences
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}

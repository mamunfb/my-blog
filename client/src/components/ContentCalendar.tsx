import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Edit2,
} from "lucide-react";

interface ScheduledPost {
  id: string;
  title: string;
  date: Date;
  status: "draft" | "scheduled" | "published";
}

interface ContentCalendarProps {
  posts?: ScheduledPost[];
  onAddPost?: (date: Date) => void;
  onEditPost?: (postId: string) => void;
}

export default function ContentCalendar({
  posts = [],
  onAddPost,
  onEditPost,
}: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const getPostsForDate = (date: Date | null) => {
    if (!date) return [];
    return posts.filter(
      (post) =>
        post.date.getDate() === date.getDate() &&
        post.date.getMonth() === date.getMonth() &&
        post.date.getFullYear() === date.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-lg">{monthName}</h3>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleNextMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-foreground/70">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const dayPosts = getPostsForDate(date);
            const isToday =
              date &&
              date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`min-h-24 p-2 border rounded-lg ${
                  date
                    ? isToday
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                    : "bg-muted/30 border-transparent"
                }`}
              >
                {date && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">
                        {date.getDate()}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => onAddPost?.(date)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {dayPosts.length > 0 && (
                      <div className="space-y-1">
                        {dayPosts.slice(0, 2).map((post) => (
                          <button
                            key={post.id}
                            onClick={() => onEditPost?.(post.id)}
                            className={`w-full text-left text-xs p-1 rounded truncate transition-colors ${
                              post.status === "published"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : post.status === "scheduled"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            }`}
                            title={post.title}
                          >
                            {post.title}
                          </button>
                        ))}
                        {dayPosts.length > 2 && (
                          <div className="text-xs text-foreground/50 px-1">
                            +{dayPosts.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-xs text-foreground/70 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900 rounded" />
            <span>Draft</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900 rounded" />
            <span>Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded" />
            <span>Published</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

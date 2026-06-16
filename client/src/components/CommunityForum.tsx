import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageSquare, Users, TrendingUp, Plus, Search } from "lucide-react";

interface ForumThread {
  id: string;
  title: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  lastReply: Date;
  isPinned: boolean;
}

interface CommunityForumProps {
  threads?: ForumThread[];
  onCreateThread?: () => void;
  onViewThread?: (threadId: string) => void;
}

export default function CommunityForum({
  threads = [],
  onCreateThread,
  onViewThread,
}: CommunityForumProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "general",
    "tutorials",
    "questions",
    "showcase",
    "feedback",
  ];

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || thread.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const pinnedThreads = filteredThreads.filter((t) => t.isPinned);
  const regularThreads = filteredThreads.filter((t) => !t.isPinned);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-accent" />
            Community Forum
          </h2>
          <p className="text-sm text-foreground/70 mt-1">
            Join our community and share your thoughts
          </p>
        </div>
        <Button onClick={onCreateThread} className="gap-2">
          <Plus className="w-4 h-4" />
          New Thread
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/50" />
          <Input
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Pinned Threads */}
      {pinnedThreads.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-foreground/70">
            Pinned Threads
          </h3>
          {pinnedThreads.map((thread) => (
            <Card
              key={thread.id}
              className="p-4 hover:border-accent/50 cursor-pointer transition-colors border-l-4 border-l-accent"
              onClick={() => onViewThread?.(thread.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold line-clamp-2">
                    {thread.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-2 text-xs text-foreground/70">
                    <span>by {thread.author}</span>
                    <span className="px-2 py-1 bg-accent/10 rounded text-accent capitalize">
                      {thread.category}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 text-right text-xs text-foreground/70 ml-4">
                  <div>
                    <div className="font-semibold text-foreground">
                      {thread.replies}
                    </div>
                    <div>replies</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {thread.views}
                    </div>
                    <div>views</div>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs text-foreground/50">
                Last reply {formatDate(thread.lastReply)}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Regular Threads */}
      <div className="space-y-2">
        {regularThreads.length > 0 && (
          <h3 className="font-semibold text-sm text-foreground/70">
            Recent Threads
          </h3>
        )}
        {regularThreads.map((thread) => (
          <Card
            key={thread.id}
            className="p-4 hover:border-accent/50 cursor-pointer transition-colors"
            onClick={() => onViewThread?.(thread.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold line-clamp-2">
                  {thread.title}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-xs text-foreground/70">
                  <span>by {thread.author}</span>
                  <span className="px-2 py-1 bg-muted rounded capitalize">
                    {thread.category}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 text-right text-xs text-foreground/70 ml-4">
                <div>
                  <div className="font-semibold text-foreground">
                    {thread.replies}
                  </div>
                  <div>replies</div>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {thread.views}
                  </div>
                  <div>views</div>
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-foreground/50">
              Last reply {formatDate(thread.lastReply)}
            </div>
          </Card>
        ))}

        {regularThreads.length === 0 && pinnedThreads.length === 0 && (
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-foreground/30 mb-3" />
            <p className="text-foreground/70">No threads found</p>
            <Button
              onClick={onCreateThread}
              variant="outline"
              className="mt-4 gap-2"
            >
              <Plus className="w-4 h-4" />
              Start a Discussion
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

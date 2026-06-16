import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bookmark, Trash2, Share2, Clock } from "lucide-react";
import { toast } from "sonner";

interface BookmarkedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  savedAt: Date;
}

interface ReaderBookmarksProps {
  postId?: number;
  postTitle?: string;
  onNavigate?: (slug: string) => void;
}

export default function ReaderBookmarks({
  postId,
  postTitle,
  onNavigate,
}: ReaderBookmarksProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("blog-bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  // Check if current post is bookmarked
  useEffect(() => {
    if (postId) {
      const bookmarked = bookmarks.some((b) => b.id === postId);
      setIsBookmarked(bookmarked);
    }
  }, [bookmarks, postId]);

  const toggleBookmark = () => {
    if (!postId || !postTitle) return;

    let updated;
    if (isBookmarked) {
      updated = bookmarks.filter((b) => b.id !== postId);
      toast.success("Removed from bookmarks");
    } else {
      const newBookmark: BookmarkedPost = {
        id: postId,
        title: postTitle,
        slug: postTitle.toLowerCase().replace(/\s+/g, "-"),
        excerpt: postTitle,
        savedAt: new Date(),
      };
      updated = [newBookmark, ...bookmarks];
      toast.success("Added to bookmarks!");
    }

    setBookmarks(updated);
    localStorage.setItem("blog-bookmarks", JSON.stringify(updated));
  };

  const removeBookmark = (id: number) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("blog-bookmarks", JSON.stringify(updated));
    toast.success("Removed from bookmarks");
  };

  const shareBookmark = (bookmark: BookmarkedPost) => {
    const text = `Check out this post: ${bookmark.title}`;
    if (navigator.share) {
      navigator.share({
        title: bookmark.title,
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `${bookmark.title} - ${window.location.origin}`
      );
      toast.success("Link copied to clipboard!");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Bookmark Button */}
      {postId && postTitle && (
        <Button
          onClick={toggleBookmark}
          variant={isBookmarked ? "default" : "outline"}
          className="w-full gap-2"
        >
          <Bookmark
            className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
          />
          {isBookmarked ? "Bookmarked" : "Bookmark This Post"}
        </Button>
      )}

      {/* Bookmarks List */}
      {bookmarks.length > 0 && (
        <Card className="p-4 bg-accent/5 border-accent/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-accent" />
            My Bookmarks ({bookmarks.length})
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="p-3 bg-background border border-border rounded-lg hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <button
                    onClick={() => onNavigate?.(bookmark.slug)}
                    className="flex-1 text-left hover:text-accent transition-colors"
                  >
                    <h4 className="font-semibold text-sm line-clamp-2">
                      {bookmark.title}
                    </h4>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-foreground/70 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(bookmark.savedAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onNavigate?.(bookmark.slug)}
                    className="flex-1 text-xs"
                  >
                    Read
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => shareBookmark(bookmark)}
                    className="text-xs gap-1"
                  >
                    <Share2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {bookmarks.length === 0 && postId && (
        <Card className="p-4 text-center text-foreground/70 text-sm">
          <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No bookmarks yet. Save posts to read later!</p>
        </Card>
      )}
    </div>
  );
}

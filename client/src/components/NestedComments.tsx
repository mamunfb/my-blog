import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: number;
  content: string;
  author: string;
  createdAt: Date;
  replies?: Comment[];
}

interface NestedCommentsProps {
  comments: Comment[];
  onReply?: (commentId: number, content: string) => void;
  depth?: number;
}

export default function NestedComments({
  comments,
  onReply,
  depth = 0,
}: NestedCommentsProps) {
  const [expandedReplies, setExpandedReplies] = useState<number[]>([]);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleReply = (commentId: number) => {
    if (replyContent.trim()) {
      onReply?.(commentId, replyContent);
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  return (
    <div className={`space-y-4 ${depth > 0 ? "ml-4 border-l border-border pl-4" : ""}`}>
      {comments.map((comment) => (
        <Card key={comment.id} className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-sm">{comment.author}</p>
              <p className="text-xs text-foreground/60">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          <p className="text-sm text-foreground/80 mb-3">{comment.content}</p>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="text-xs"
          >
            <Reply className="w-3 h-3 mr-1" />
            Reply
          </Button>

          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Post Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => toggleReplies(comment.id)}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 mb-3"
              >
                {expandedReplies.includes(comment.id) ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
              </button>

              {expandedReplies.includes(comment.id) && (
                <NestedComments
                  comments={comment.replies}
                  onReply={onReply}
                  depth={depth + 1}
                />
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

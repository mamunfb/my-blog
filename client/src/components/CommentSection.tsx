import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Star, Loader2, Trash2 } from "lucide-react";

interface Comment {
  id: number;
  content: string;
  authorName: string;
  rating?: number;
  createdAt: Date;
  approved: "pending" | "approved" | "rejected";
}

interface CommentSectionProps {
  postId: number;
  comments?: Comment[];
  isLoading?: boolean;
  onCommentSubmit?: (content: string, rating: number) => Promise<void>;
  onCommentDelete?: (commentId: number) => Promise<void>;
}

export default function CommentSection({
  postId,
  comments = [],
  isLoading = false,
  onCommentSubmit,
  onCommentDelete,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onCommentSubmit) {
        await onCommentSubmit(newComment, rating);
      }
      setNewComment("");
      setRating(5);
      toast.success("Comment submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit comment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      if (onCommentDelete) {
        await onCommentDelete(commentId);
      }
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error(error);
    }
  };

  const approvedComments = comments.filter((c) => c.approved === "approved");
  const averageRating =
    approvedComments.length > 0
      ? (
          approvedComments.reduce((sum, c) => sum + (c.rating || 0), 0) /
          approvedComments.length
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-8">
      {/* Comments Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Comments & Ratings</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(Number(averageRating))
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-foreground/20"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-foreground/70">
            {averageRating} ({approvedComments.length} {approvedComments.length === 1 ? "rating" : "ratings"})
          </span>
        </div>
      </div>

      {/* Comment Form */}
      <Card className="p-6 bg-accent/5">
        <h3 className="font-semibold mb-4">Leave a Comment</h3>

        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Text */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Comment</label>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this post..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </div>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          {approvedComments.length} {approvedComments.length === 1 ? "Comment" : "Comments"}
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
          </div>
        ) : approvedComments.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-foreground/70">No comments yet. Be the first to comment!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvedComments.map((comment) => (
              <Card key={comment.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{comment.authorName}</h4>
                    <p className="text-xs text-foreground/50">
                      {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Rating Stars */}
                  {comment.rating && (
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < comment.rating!
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-foreground/80 mb-3">{comment.content}</p>

                {/* Delete Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pending Comments Notice */}
      {comments.some((c) => c.approved === "pending") && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-900">
            💡 {comments.filter((c) => c.approved === "pending").length} comment(s) pending approval
          </p>
        </Card>
      )}
    </div>
  );
}

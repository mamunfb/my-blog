import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminCommentModeration() {
  const { data: comments = [], isLoading, error } = trpc.blog.getPendingComments.useQuery();
  const utils = trpc.useUtils();

  const approveMutation = trpc.blog.approveComment.useMutation({
    onSuccess: () => {
      toast.success("Comment approved");
      utils.blog.getPendingComments.invalidate();
    },
    onError: () => {
      toast.error("Failed to approve comment");
    },
  });

  const rejectMutation = trpc.blog.rejectComment.useMutation({
    onSuccess: () => {
      toast.success("Comment rejected");
      utils.blog.getPendingComments.invalidate();
    },
    onError: () => {
      toast.error("Failed to reject comment");
    },
  });

  const deleteMutation = trpc.blog.deleteComment.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted");
      utils.blog.getPendingComments.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete comment");
    },
  });

  const handleApprove = (commentId: number) => {
    approveMutation.mutate({ id: commentId });
  };

  const handleReject = (commentId: number) => {
    rejectMutation.mutate({ id: commentId });
  };

  const handleDelete = (commentId: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate({ id: commentId });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Moderate Comments</h2>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-8">
          <p className="text-destructive font-semibold mb-2">Error loading comments</p>
          <p className="text-sm text-destructive/80 mb-4">
            Failed to load pending comments. Please try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4">
              <Skeleton className="h-4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-foreground">
                    Pending Review
                  </p>
                  <p className="text-sm text-foreground/70">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                  Pending
                </span>
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                {comment.content}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700"
                  onClick={() => handleApprove(comment.id)}
                  disabled={approveMutation.isPending}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-600 hover:text-orange-700"
                  onClick={() => handleReject(comment.id)}
                  disabled={rejectMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDelete(comment.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-foreground/70 mb-4">No pending comments</p>
          <p className="text-sm text-foreground/60">
            All comments have been moderated
          </p>
        </div>
      )}
    </div>
  );
}

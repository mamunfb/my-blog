import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { CalendarClock, Clock3, Edit2, Eye, Loader2, MessageSquare, Share2, Timer, Trash2 } from "lucide-react";

interface PostStatistics {
  postId: number;
  views: number;
  shares: number;
  comments: number;
  averageReadTimeSeconds: number;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  published: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
  content: string;
  excerpt: string | null;
  authorId: number;
  categoryId: number | null;
  featuredImageUrl: string | null;
  viewCount: number;
  publishedAt: Date | null;
  scheduledPublishDate: Date | null;
  statistics?: PostStatistics;
}

interface PostListingTableProps {
  posts?: Post[];
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
}

function formatSchedule(value: Date | null) {
  return value ? new Date(value).toLocaleString() : "";
}

export default function PostListingTable({ posts: externalPosts, onEdit, onDelete }: PostListingTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: fetchedPosts, isLoading, refetch } = trpc.blog.getAllPosts.useQuery(undefined, { enabled: !externalPosts });
  const posts = (externalPosts || fetchedPosts) as Post[] | undefined;
  const deletePostMutation = trpc.blog.deletePost.useMutation({
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      setDeletePostId(null);
      refetch();
    },
    onError: (error) => toast.error(error.message || "Failed to delete post"),
  });

  const handleDelete = async () => {
    if (!deletePostId) return;
    setIsDeleting(true);
    try {
      if (externalPosts && onDelete) {
        await onDelete(deletePostId);
        setDeletePostId(null);
      } else {
        await deletePostMutation.mutateAsync({ id: deletePostId });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  ) || [];

  if (isLoading) {
    return <Card className="p-8"><div className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading posts...</span></div></Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div><h3 className="text-lg font-semibold">All Blog Posts</h3><p className="text-sm text-foreground/60">Monitor publication plans and engagement at a glance.</p></div><span className="text-sm text-foreground/70">{filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}</span></div>
          <Input type="text" placeholder="Search by title or slug..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Schedule</TableHead><TableHead><span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> Views</span></TableHead><TableHead><span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> Shares</span></TableHead><TableHead><span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> Comments</span></TableHead><TableHead><span className="flex items-center gap-1"><Timer className="h-3.5 w-3.5" /> Read</span></TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredPosts.length === 0 ? <TableRow><TableCell colSpan={8} className="py-8 text-center text-foreground/50">No posts found. Create your first post!</TableCell></TableRow> : filteredPosts.map((post) => {
                  const stat = post.statistics;
                  const isScheduled = Boolean(post.scheduledPublishDate);
                  return <TableRow key={post.id}>
                    <TableCell className="max-w-[220px]"><p className="truncate font-medium">{post.title}</p><p className="truncate text-xs text-foreground/50">/{post.slug}</p></TableCell>
                    <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isScheduled ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200" : post.published === "published" ? "bg-green-100 text-green-800" : post.published === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{isScheduled ? "scheduled" : post.published}</span></TableCell>
                    <TableCell className="min-w-[170px] text-xs">{isScheduled ? <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300"><CalendarClock className="h-3.5 w-3.5" />{formatSchedule(post.scheduledPublishDate)}</span> : <span className="text-foreground/45">Not scheduled</span>}</TableCell>
                    <TableCell className="font-semibold">{stat?.views ?? post.viewCount ?? 0}</TableCell>
                    <TableCell className="font-semibold">{stat?.shares ?? 0}</TableCell>
                    <TableCell className="font-semibold">{stat?.comments ?? 0}</TableCell>
                    <TableCell className="font-semibold">{stat?.averageReadTimeSeconds ?? 0}s</TableCell>
                    <TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button size="sm" variant="ghost" onClick={() => window.open(`/blog/${post.slug}`, "_blank")} title="View post"><Eye className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => onEdit?.(post)} title="Edit post"><Edit2 className="h-4 w-4" /></Button><Button size="sm" variant="ghost" onClick={() => setDeletePostId(post.id)} title="Delete post" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                  </TableRow>;
                })}
              </TableBody>
            </Table>
          </div>
          <div className="border-t border-border pt-4 text-sm text-foreground/70"><p><Clock3 className="mr-1 inline h-4 w-4" />Scheduled rows publish automatically when the Heartbeat job calls <code>/api/scheduled/publish-posts</code>.</p></div>
        </div>
      </Card>
      <AlertDialog open={deletePostId !== null} onOpenChange={(open) => !open && setDeletePostId(null)}><AlertDialogContent><AlertDialogTitle>Delete Post?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. The post will be permanently deleted.</AlertDialogDescription><div className="flex justify-end gap-4"><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">{isDeleting ? "Deleting..." : "Delete"}</AlertDialogAction></div></AlertDialogContent></AlertDialog>
    </div>
  );
}

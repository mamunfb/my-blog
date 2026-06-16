import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface AdminPostEditorProps {
  postId?: number;
  onSave: () => void;
}

export default function AdminPostEditor({ postId, onSave }: AdminPostEditorProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState("draft");
  const [isSaving, setIsSaving] = useState(false);

  const { data: categories } = trpc.blog.getAllCategories.useQuery();

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Implement save logic via tRPC
      toast.success(postId ? "Post updated successfully" : "Post created successfully");
      onSave();
    } catch (error) {
      toast.error("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold mb-8">
        {postId ? "Edit Post" : "Create New Post"}
      </h2>

      <div className="bg-card border border-border rounded-lg p-8 space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) {
                setSlug(generateSlug(e.target.value));
              }
            }}
            placeholder="Enter post title"
            className="mt-2"
          />
        </div>

        {/* Slug */}
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            placeholder="post-slug"
            className="mt-2"
          />
        </div>

        {/* Excerpt */}
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary of the post"
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Editor */}
        <div>
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here... (Markdown supported)"
            rows={15}
            className="mt-2 font-mono text-sm"
          />
          <p className="text-xs text-foreground/60 mt-2">
            Markdown formatting is supported. Use **bold**, *italic*, # headings, etc.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-border">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : postId ? "Update Post" : "Create Post"}
          </Button>
          <Button variant="outline" onClick={onSave}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

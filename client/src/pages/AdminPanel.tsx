import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import PostListingTable from "@/components/PostListingTable";
import ImageUpload from "@/components/ImageUpload";
import SocialSharingMetricsDashboard from "@/components/SocialSharingMetricsDashboard";
import { useAutoSaveDraft } from "@/hooks/useAutoSaveDraft";
import { useEffect } from "react";

export default function AdminPanel() {
  // All hooks must be called unconditionally
  const { user, loading } = useAuth();
  const [match, params] = useRoute("/admin/:tab");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured: false,
    featuredImageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);

  // Auto-save draft
  const { loadDraft, deleteDraft, getDraftInfo } = useAutoSaveDraft(formData, {
    postId: editingPostId || undefined,
    saveInterval: 30000,
    onSave: async (draft) => {
      console.log("Draft auto-saved:", draft);
    },
  });

  // Create post mutation
  const createPostMutation = trpc.blog.createPost.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully!");
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featured: false,
        featuredImageUrl: "",
      });
      deleteDraft();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create blog post");
    },
  });

  // Update post mutation
  const updatePostMutation = trpc.blog.updatePost.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully!");
      setEditingPostId(null);
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featured: false,
        featuredImageUrl: "",
      });
      deleteDraft();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update blog post");
    },
  });

  // Delete post mutation
  const deletePostMutation = trpc.blog.deletePost.useMutation({
    onSuccess: () => {
      toast.success("Blog post deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog post");
    },
  });

  // Get all posts query
  const { data: posts = [], refetch: refetchPosts } = trpc.blog.getAllPosts.useQuery();

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setFormData((prev) => ({
        ...prev,
        title: draft.title || prev.title,
        slug: draft.slug || prev.slug,
        content: draft.content || prev.content,
        excerpt: draft.excerpt || prev.excerpt,
        featuredImageUrl: draft.featuredImageUrl || prev.featuredImageUrl,
      }));
      toast.info("Draft loaded from previous session");
    }
  }, [loadDraft]);

  // Show loading state
  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect if not admin
  if (user?.role !== "admin") {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-foreground/70">You don't have permission to access this page.</p>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingPostId) {
        await updatePostMutation.mutateAsync({
          id: editingPostId,
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          status: "published",
          featuredImageUrl: formData.featuredImageUrl,
        });
      } else {
        await createPostMutation.mutateAsync({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          status: "published",
          featuredImageUrl: formData.featuredImageUrl,
        });
      }
      await refetchPosts();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      featured: post.featured || false,
      featuredImageUrl: post.featuredImageUrl || "",
    });
    setEditingPostId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingPostId(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featured: false,
      featuredImageUrl: "",
    });
  };

  const handleDelete = async (postId: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePostMutation.mutateAsync({ id: postId });
      await refetchPosts();
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      featuredImageUrl: url,
    }));
  };

  const tab = params?.tab || "posts";

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-foreground/70">Manage your blog posts, analytics, and settings</p>
      </div>

      <Tabs value={tab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Create Post</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Create Post Tab */}
        <TabsContent value="posts" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingPostId ? "Edit Post" : "Create New Post"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="url-friendly-slug"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the post"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content *</label>
                <Textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Post content (HTML supported)"
                  rows={8}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <ImageUpload onImageUpload={handleImageUpload} />
                {formData.featuredImageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.featuredImageUrl}
                      alt="Featured"
                      className="max-w-xs rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingPostId ? "Update Post" : "Create Post"}
                </Button>
                {editingPostId && (
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-bold mb-4">All Posts</h3>
              <PostListingTable
                posts={posts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card className="p-6">
            <AnalyticsDashboard />
            <div className="mt-8 pt-8 border-t">
              <SocialSharingMetricsDashboard />
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Blog Settings</h2>
            <p className="text-foreground/70">Configure your blog settings here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

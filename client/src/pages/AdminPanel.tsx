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
import { useAutoSaveDraft } from "@/hooks/useAutoSaveDraft";
import { useEffect } from "react";

export default function AdminPanel() {
  const { user } = useAuth();
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
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update blog post");
    },
  });

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
          content: formData.content,
          excerpt: formData.excerpt,
          status: formData.featured ? "published" : "draft",
          featuredImageUrl: formData.featuredImageUrl,
        });
      } else {
        await createPostMutation.mutateAsync({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          status: formData.featured ? "published" : "draft",
          featuredImageUrl: formData.featuredImageUrl,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTab = match ? params?.tab : "posts";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-foreground/70 mt-2">Manage your blog content and analytics</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs value={currentTab || "posts"} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Blog Posts Tab */}
          <TabsContent value="posts" className="space-y-6">
            <div className="space-y-6">
              {/* Post Listing Table */}
              <PostListingTable
                onEdit={(post) => {
                  setEditingPostId(post.id);
                  setFormData({
                    title: post.title,
                    slug: post.slug,
                    content: post.content,
                    excerpt: post.excerpt || "",
                    featured: post.published === "published",
                    featuredImageUrl: post.featuredImageUrl || "",
                  });
                  // Scroll to form
                  setTimeout(() => {
                    document.getElementById("post-form")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              />

              {/* Create/Edit Post Form */}
              <Card className="p-8" id="post-form">
                <h2 className="text-2xl font-bold mb-6">
                  {editingPostId ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Post Title *
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter post title"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      URL Slug *
                    </label>
                    <Input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="url-slug"
                      required
                    />
                    <p className="text-xs text-foreground/50 mt-1">
                      Used in the URL: /blog/{formData.slug}
                    </p>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Excerpt
                    </label>
                    <Textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Brief summary of your post"
                      rows={2}
                    />
                  </div>

                  {/* Featured Image */}
                  <ImageUpload
                    onImageUpload={(url) =>
                      setFormData((prev) => ({ ...prev, featuredImageUrl: url }))
                    }
                    currentImage={formData.featuredImageUrl}
                  />

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Content *
                    </label>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Write your post content here (HTML supported)"
                      rows={10}
                      required
                    />
                    <p className="text-xs text-foreground/50 mt-1">
                      You can use HTML tags for formatting
                    </p>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                      Mark as Featured Post
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Saving..." : editingPostId ? "Update Post" : "Create Post"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingPostId(null);
                        setFormData({
                          title: "",
                          slug: "",
                          content: "",
                          excerpt: "",
                          featured: false,
                          featuredImageUrl: "",
                        });
                      }}
                    >
                      {editingPostId ? "Cancel Edit" : "Clear"}
                    </Button>
                  </div>
                </form>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-accent/10 border border-accent rounded-lg">
                  <h3 className="font-semibold mb-2">💡 Tips for Creating Great Posts</h3>
                  <ul className="text-sm space-y-1 text-foreground/70">
                    <li>• Use clear, descriptive titles that include keywords</li>
                    <li>• Write a compelling excerpt to attract readers</li>
                    <li>• Structure content with headings (h2, h3, etc.)</li>
                    <li>• Include relevant links and resources</li>
                    <li>• Add a featured image for better engagement</li>
                    <li>• Mark important posts as featured for homepage display</li>
                  </ul>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Blog Settings</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Blog Title
                      </label>
                      <Input
                        type="text"
                        placeholder="My Blog"
                        defaultValue="My Blog"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Blog Description
                      </label>
                      <Textarea
                        placeholder="Describe your blog"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-foreground/70">
                      These actions cannot be undone. Please proceed with caution.
                    </p>
                    <Button variant="destructive">Delete All Posts</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

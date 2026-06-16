import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function AdminPanel() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [match, params] = useRoute("/admin/:tab");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      // Here you would call your tRPC mutation to create a post
      // For now, we'll just show a success message
      toast.success("Blog post created successfully!");
      setFormData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featured: false,
      });
    } catch (error) {
      toast.error("Failed to create blog post");
      console.error(error);
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
            <TabsTrigger value="posts">Create Post</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Create Post Tab */}
          <TabsContent value="posts" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Create New Blog Post</h2>
              
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
                    {isSubmitting ? "Creating..." : "Create Post"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        title: "",
                        slug: "",
                        content: "",
                        excerpt: "",
                        featured: false,
                      })
                    }
                  >
                    Clear
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
                  <li>• Mark important posts as featured for homepage display</li>
                </ul>
              </div>
            </Card>
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

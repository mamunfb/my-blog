import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import AdminPostList from "@/components/AdminPostList";
import AdminPostEditor from "@/components/AdminPostEditor";
import AdminCommentModeration from "@/components/AdminCommentModeration";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit" | "comments">(
    "list"
  );
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated === false || (isAuthenticated && user?.role !== "admin")) {
      navigate("/");
    }
  }, [isAuthenticated, user?.role, navigate]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <a href="/">
            <Button variant="outline">Back to Blog</Button>
          </a>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="container flex gap-2 py-4">
          <Button
            variant={currentView === "list" ? "default" : "outline"}
            onClick={() => {
              setCurrentView("list");
              setSelectedPostId(null);
            }}
          >
            All Posts
          </Button>
          <Button
            variant={currentView === "create" ? "default" : "outline"}
            onClick={() => setCurrentView("create")}
          >
            Create Post
          </Button>
          <Button
            variant={currentView === "comments" ? "default" : "outline"}
            onClick={() => setCurrentView("comments")}
          >
            Moderate Comments
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        {currentView === "list" && (
          <AdminPostList
            onEdit={(postId) => {
              setSelectedPostId(postId);
              setCurrentView("edit");
            }}
          />
        )}
        {currentView === "create" && (
          <AdminPostEditor
            onSave={() => {
              setCurrentView("list");
              setSelectedPostId(null);
            }}
          />
        )}
        {currentView === "edit" && selectedPostId && (
          <AdminPostEditor
            postId={selectedPostId}
            onSave={() => {
              setCurrentView("list");
              setSelectedPostId(null);
            }}
          />
        )}
        {currentView === "comments" && (
          <AdminCommentModeration />
        )}
      </main>
    </div>
  );
}

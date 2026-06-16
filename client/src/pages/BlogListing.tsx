import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { Search, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BlogListing() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const [page, setPage] = useState(0);

  const { data: categories } = trpc.blog.getAllCategories.useQuery();
  const { data: latestPosts, isLoading } = trpc.blog.getLatestPosts.useQuery({
    limit: 12,
    offset: page * 12,
  });
  const { data: searchResults, isLoading: searchLoading } =
    trpc.blog.searchPosts.useQuery(
      { query: searchQuery, limit: 50 },
      { enabled: searchQuery.length > 0 }
    );

  const displayPosts = useMemo(() => {
    let posts = searchQuery.length > 0 ? searchResults : latestPosts;

    if (!posts) return [];

    if (selectedCategory) {
      posts = posts.filter((p) => p.categoryId === selectedCategory);
    }

    // Sort posts
    const sorted = [...posts];
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "popular") {
      sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }

    return sorted;
  }, [latestPosts, searchResults, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog Posts</h1>
          <p className="text-foreground/70 text-lg">
            Explore our latest articles and insights
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="pl-10 h-12"
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            <Select
              value={selectedCategory?.toString() || "all"}
              onValueChange={(value) => {
                setSelectedCategory(value === "all" ? null : parseInt(value));
                setPage(0);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading || searchLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : displayPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post) => (
              <div
                key={post.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all hover:shadow-lg">
                  {post.featuredImageUrl && (
                    <div className="h-48 bg-muted overflow-hidden">
                      <img
                        src={post.featuredImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                        {categories?.find((c) => c.id === post.categoryId)?.name || "Uncategorized"}
                      </span>
                      <span className="text-xs text-foreground/50">
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-sm text-foreground/70 line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-foreground/50">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.viewCount || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{Math.ceil((post.content?.length || 0) / 200)} min read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 mb-4">No posts found</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {displayPosts.length > 0 && !searchQuery && (
          <div className="flex justify-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <div className="flex items-center px-4">
              Page {page + 1}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={!latestPosts || latestPosts.length < 12}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

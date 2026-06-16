import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { Search, Calendar, Eye, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "@/components/Breadcrumb";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/20 dark:to-purple-950/20">
      <Navigation categories={categories} />

      {/* Breadcrumb */}
      <div className="container py-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", current: true },
          ]}
        />
      </div>

      <main className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Blog Posts
          </h1>
          <p className="text-foreground/70 text-lg">
            Explore our latest articles and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Search Widget */}
          <aside className="lg:col-span-1">
            {/* Search Widget */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-6 mb-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Search & Filter
                </h3>
              </div>

              {/* Search Input */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Search Posts
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <Input
                    placeholder="Type keywords..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0);
                    }}
                    className="pl-10 h-10 bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Category
                </label>
                <Select
                  value={selectedCategory?.toString() || "all"}
                  onValueChange={(value) => {
                    setSelectedCategory(value === "all" ? null : parseInt(value));
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600">
                    <SelectValue placeholder="All Categories" />
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
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={(value: any) => setSortBy(value)}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {(searchQuery || selectedCategory || sortBy !== "newest") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSortBy("newest");
                    setPage(0);
                  }}
                  className="w-full mt-6 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Popular Categories */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-2 border-purple-300 dark:border-purple-700 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                Popular Categories
              </h3>
              <div className="space-y-2">
                {categories?.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchQuery("");
                      setPage(0);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      selectedCategory === cat.id
                        ? "bg-purple-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6 text-sm text-foreground/70">
              Showing {displayPosts.length} post{displayPosts.length !== 1 ? "s" : ""}
            </div>

            {/* Posts Grid */}
            <div className="grid gap-6">
              {isLoading || searchLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))
              ) : displayPosts.length > 0 ? (
                displayPosts.map((post) => (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h2>
                      {post.published === "published" && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Published
                        </span>
                      )}
                    </div>

                    <p className="text-foreground/70 mb-4 line-clamp-2">
                      {post.excerpt || post.content?.substring(0, 150)}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.viewCount || 0} views
                      </div>
                      {post.categoryId && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                          Category
                        </span>
                      )}
                    </div>
                  </a>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-foreground/70 text-lg">
                    No posts found. Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!searchQuery && displayPosts.length > 0 && (
              <div className="flex justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/70">
                    Page {page + 1}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={displayPosts.length < 12}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

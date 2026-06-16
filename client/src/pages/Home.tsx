import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { ArrowRight, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const { data: categories } = trpc.blog.getAllCategories.useQuery();
  const { data: featuredPosts, isLoading: featuredLoading } =
    trpc.blog.getFeaturedPosts.useQuery();
  const { data: latestPosts, isLoading: latestLoading } =
    trpc.blog.getLatestPosts.useQuery({ limit: 6 });

  return (
    <div className="min-h-screen bg-background">
      <Navigation categories={categories} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-card to-muted/50 border-b border-border">
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Thoughts, Stories & Ideas
            </h1>
            <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
              Explore insightful articles, in-depth guides, and creative
              perspectives on topics that matter. Join our community of readers
              and writers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/blog">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore All Posts <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
              <a href="#featured">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Featured Stories
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section id="featured" className="py-20 md:py-28 border-b border-border">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Stories</h2>
            <p className="text-foreground/70 text-lg">
              Our most popular and impactful articles
            </p>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="post-card">
                  <Skeleton className="h-48 mb-4" />
                  <Skeleton className="h-6 mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts?.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="post-card group"
                >
                  {post.featuredImageUrl && (
                    <div className="mb-4 h-48 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={post.featuredImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-foreground/70 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-foreground/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.viewCount} views
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-4">Latest Articles</h2>
              <p className="text-foreground/70 text-lg">
                Fresh content from our writers
              </p>
            </div>
            <a href="/blog" className="hidden md:block">
              <Button variant="outline">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>

          {latestLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="post-card">
                  <Skeleton className="h-6 mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {latestPosts?.map((post) => (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="post-card group flex flex-col"
                  >
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-foreground/70 mb-4 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-foreground/60 pt-4 border-t border-border">
                      <span>
                        {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="text-accent group-hover:translate-x-1 transition-transform">
                        Read →
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-12 text-center md:hidden">
                <a href="/blog">
                  <Button size="lg" variant="outline">
                    View All Articles
                  </Button>
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <p className="text-sm text-foreground/70">
                A platform for sharing ideas, stories, and knowledge.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2">
                {categories?.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`/category/${cat.slug}`}
                      className="text-sm text-foreground/70 hover:text-accent transition-colors"
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/blog"
                    className="text-sm text-foreground/70 hover:text-accent transition-colors"
                  >
                    All Posts
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="text-sm text-foreground/70 hover:text-accent transition-colors"
                  >
                    Home
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <p className="text-sm text-foreground/70">
                Share your thoughts and feedback with us.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2026 My Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Search, Loader } from "lucide-react";

interface SearchSuggestionsProps {
  query: string;
  onSelect: (slug: string) => void;
}

export default function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
  const [, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const { data: results, isLoading } = trpc.blog.searchPosts.useQuery(
    { query, limit: 5 },
    { enabled: query.length > 2 }
  );

  useEffect(() => {
    setIsOpen(query.length > 2 && (results?.length || 0) > 0);
  }, [query, results]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {isLoading ? (
        <div className="p-4 flex items-center justify-center gap-2 text-foreground/70">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Searching...</span>
        </div>
      ) : results && results.length > 0 ? (
        <div className="divide-y divide-border">
          {results.map((post) => (
            <button
              key={post.id}
              onClick={() => {
                navigate(`/blog/${post.slug}`);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-start gap-3"
            >
              <Search className="w-4 h-4 text-foreground/50 flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="font-medium line-clamp-1">{post.title}</p>
                {post.excerpt && (
                  <p className="text-sm text-foreground/60 line-clamp-1">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-foreground/70">
          <p>No results found</p>
        </div>
      )}
    </div>
  );
}

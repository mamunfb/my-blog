import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import LanguageSelector from "./LanguageSelector";

interface NavigationProps {
  categories?: Array<{ id: number; name: string; slug: string }>;
}

export default function Navigation({ categories = [] }: NavigationProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-accent-foreground">
              ✦
            </div>
            <span className="hidden sm:inline">My Blog</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/blog"
              className={`text-sm transition-colors ${
                isActive("/blog")
                  ? "text-accent font-semibold"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              All Posts
            </a>

            {categories.slice(0, 3).map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className={`text-sm transition-colors ${
                  location === `/category/${category.slug}`
                    ? "text-accent font-semibold"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {category.name}
              </a>
            ))}
          </div>

          {/* Theme Toggle, Language Selector & Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-foreground/70" />
              )}
            </button>
            {isAuthenticated ? (
              <>
                <div className="text-sm text-foreground/70">
                  {user?.name || "User"}
                </div>
                {user?.role === "admin" && (
                  <a href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </a>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm">Login</Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border pb-4">
            <a
              href="/blog"
              className="block px-4 py-2 text-sm hover:bg-muted"
              onClick={() => setIsOpen(false)}
            >
              All Posts
            </a>

            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="block px-4 py-2 text-sm hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </a>
            ))}

            <div className="px-4 py-2 border-t border-border mt-2 pt-4 flex flex-col gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted rounded-lg transition-colors"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                )}
              </button>
              {isAuthenticated ? (
                <>
                  <div className="text-sm text-foreground/70 px-0">
                    {user?.name || "User"}
                  </div>
                  {user?.role === "admin" && (
                    <a href="/admin">
                      <Button variant="outline" size="sm" className="w-full">
                        Admin
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <a href={getLoginUrl()} className="w-full">
                  <Button size="sm" className="w-full">
                    Login
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

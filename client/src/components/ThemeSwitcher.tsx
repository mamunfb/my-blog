import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";

const THEMES = [
  { id: "light", name: "Light", color: "bg-white" },
  { id: "dark", name: "Dark", color: "bg-slate-900" },
  { id: "sepia", name: "Sepia", color: "bg-amber-50" },
  { id: "highcontrast", name: "High Contrast", color: "bg-black" },
];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("blog-theme") || "light";
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId as string);
    localStorage.setItem("blog-theme", themeId);
    setIsOpen(false);
    applyTheme(themeId);
  };

  const applyTheme = (themeId: string | null) => {
    if (!themeId) return;
    const root = document.documentElement;
    
    const themes: Record<string, Record<string, string>> = {
      light: {
        "--background": "0 0% 100%",
        "--foreground": "0 0% 3.6%",
      },
      dark: {
        "--background": "0 0% 3.6%",
        "--foreground": "0 0% 98%",
      },
      sepia: {
        "--background": "39 100% 97%",
        "--foreground": "20 14% 20%",
      },
      highcontrast: {
        "--background": "0 0% 0%",
        "--foreground": "0 0% 100%",
      },
    };

    const themeVars = themes[themeId] || themes.light;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        title="Change theme"
      >
        <Palette className="w-5 h-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 p-2">
          <p className="text-xs font-semibold text-foreground/70 px-2 py-1">
            Choose Theme
          </p>
          <div className="space-y-1">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-muted transition-colors text-sm"
              >
                <div className={`w-4 h-4 rounded-full border-2 ${t.color}`} />
                <span className="flex-1 text-left">{t.name}</span>
                {currentTheme === t.id && (
                  <Check className="w-4 h-4 text-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

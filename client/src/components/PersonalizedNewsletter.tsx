import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Sliders, CheckCircle } from "lucide-react";

interface NewsletterPreference {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly";
}

interface PersonalizedNewsletterProps {
  userEmail?: string;
  onSavePreferences?: (preferences: NewsletterPreference[]) => void;
}

export default function PersonalizedNewsletter({
  userEmail,
  onSavePreferences,
}: PersonalizedNewsletterProps) {
  const [preferences, setPreferences] = useState<NewsletterPreference[]>([
    {
      id: "tech",
      name: "Technology News",
      description: "Latest tech trends and updates",
      enabled: true,
      frequency: "weekly",
    },
    {
      id: "design",
      name: "Design Insights",
      description: "Design tips and inspiration",
      enabled: false,
      frequency: "weekly",
    },
    {
      id: "business",
      name: "Business Tips",
      description: "Business strategies and advice",
      enabled: false,
      frequency: "monthly",
    },
    {
      id: "personal",
      name: "Personal Development",
      description: "Growth and productivity content",
      enabled: true,
      frequency: "weekly",
    },
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSave = () => {
    onSavePreferences?.(preferences);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const enabledCount = preferences.filter((p) => p.enabled).length;

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-bold">Personalized Newsletter</h3>
      </div>

      {userEmail && (
        <div className="mb-4 p-3 bg-background border border-border rounded text-sm">
          <span className="text-foreground/70">Subscribed to:</span>
          <div className="font-semibold text-accent">{userEmail}</div>
        </div>
      )}

      <div className="space-y-3 mb-4">
        {preferences.map((pref) => (
          <div
            key={pref.id}
            className="p-3 bg-background border border-border rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <div className="flex items-start gap-3">
              <Checkbox
                checked={pref.enabled}
                onCheckedChange={() => togglePreference(pref.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{pref.name}</h4>
                <p className="text-xs text-foreground/70 mt-1">
                  {pref.description}
                </p>
                {pref.enabled && (
                  <div className="mt-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded w-fit">
                    {pref.frequency.charAt(0).toUpperCase() +
                      pref.frequency.slice(1)}{" "}
                    digest
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 p-3 bg-accent/5 border border-accent/20 rounded">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-accent" />
          <span className="text-sm">
            <span className="font-semibold">{enabledCount}</span> newsletter
            {enabledCount !== 1 ? "s" : ""} selected
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1 gap-2">
          {isSaved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              Save Preferences
            </>
          )}
        </Button>
        <Button variant="outline" className="flex-1">
          Unsubscribe
        </Button>
      </div>

      <div className="mt-4 p-3 bg-background border border-border rounded text-xs text-foreground/70">
        <p>
          📧 <span className="font-semibold">Note:</span> We respect your
          privacy. You can change these preferences anytime.
        </p>
      </div>
    </Card>
  );
}

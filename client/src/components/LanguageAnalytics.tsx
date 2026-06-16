import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { SUPPORTED_LANGUAGES } from "@/lib/translationService";
import { Loader2 } from "lucide-react";

export default function LanguageAnalytics() {
  const { data: analytics, isLoading } = trpc.translation.getLanguageAnalytics.useQuery();
  const [sortedLanguages, setSortedLanguages] = useState<any[]>([]);

  useEffect(() => {
    if (analytics?.topLanguages) {
      const sorted = [...analytics.topLanguages].sort((a, b) => b.views - a.views);
      setSortedLanguages(sorted);
    }
  }, [analytics]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
        </CardContent>
      </Card>
    );
  }

  const maxViews = Math.max(...(sortedLanguages?.map((l) => l.views) || [1]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Usage Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedLanguages && sortedLanguages.length > 0 ? (
          sortedLanguages.map((lang) => {
            const percentage = (lang.views / maxViews) * 100;
            const langData = SUPPORTED_LANGUAGES[lang.code];

            return (
              <div key={lang.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{langData?.flag}</span>
                    <div>
                      <p className="font-medium text-sm">{lang.language}</p>
                      <p className="text-xs text-foreground/60">{langData?.nativeName}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-accent">
                    {lang.views.toLocaleString()} views
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-foreground/60 text-center py-4">
            No language data available yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { useEffect } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { trpc } from "@/lib/trpc";

export function useLanguageTracking(postId?: number) {
  const { language } = useTranslation();
  const trackMutation = trpc.translation.trackLanguageUsage.useMutation();

  useEffect(() => {
    // Track language usage when language changes
    trackMutation.mutate({
      language,
      postId,
    });
  }, [language, postId]);

  return { isTracking: trackMutation.isPending };
}

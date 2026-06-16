import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

export interface DraftData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImageUrl: string;
  [key: string]: any;
}

interface UseAutoSaveDraftOptions {
  postId?: number;
  saveInterval?: number; // milliseconds
  onSave?: (draft: DraftData) => Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * Hook for auto-saving draft content
 * Saves to localStorage immediately and to server periodically
 */
export function useAutoSaveDraft(
  draftData: DraftData,
  options: UseAutoSaveDraftOptions = {}
) {
  const {
    postId,
    saveInterval = 30000, // 30 seconds
    onSave,
    onError,
  } = options;

  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSavedRef = useRef<string>("");
  const isSavingRef = useRef(false);

  // Save to localStorage
  const saveToLocalStorage = useCallback(() => {
    const draftKey = postId ? `draft-${postId}` : "draft-new";
    const draftString = JSON.stringify({
      ...draftData,
      savedAt: new Date().toISOString(),
    });

    try {
      localStorage.setItem(draftKey, draftString);
      lastSavedRef.current = draftString;
    } catch (error) {
      console.error("Failed to save draft to localStorage", error);
    }
  }, [draftData, postId]);

  // Save to server
  const saveToServer = useCallback(async () => {
    if (isSavingRef.current) return;

    const draftString = JSON.stringify(draftData);
    if (draftString === lastSavedRef.current) {
      return; // No changes since last save
    }

    isSavingRef.current = true;
    try {
      if (onSave) {
        await onSave(draftData);
      }
      lastSavedRef.current = draftString;
      toast.success("Draft saved");
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error");
      console.error("Failed to save draft to server", err);
      if (onError) {
        onError(err);
      }
      toast.error("Failed to save draft");
    } finally {
      isSavingRef.current = false;
    }
  }, [draftData, onSave, onError]);

  // Auto-save effect
  useEffect(() => {
    // Always save to localStorage immediately
    saveToLocalStorage();

    // Schedule server save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToServer();
    }, saveInterval);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [draftData, saveToLocalStorage, saveToServer, saveInterval]);

  // Load draft from localStorage
  const loadDraft = useCallback((): DraftData | null => {
    const draftKey = postId ? `draft-${postId}` : "draft-new";
    const stored = localStorage.getItem(draftKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Remove metadata
        const { savedAt, ...data } = parsed;
        return data as DraftData;
      } catch (error) {
        console.error("Failed to load draft from localStorage", error);
        return null;
      }
    }

    return null;
  }, [postId]);

  // Delete draft
  const deleteDraft = useCallback(() => {
    const draftKey = postId ? `draft-${postId}` : "draft-new";
    try {
      localStorage.removeItem(draftKey);
      lastSavedRef.current = "";
    } catch (error) {
      console.error("Failed to delete draft", error);
    }
  }, [postId]);

  // Get draft info
  const getDraftInfo = useCallback(() => {
    const draftKey = postId ? `draft-${postId}` : "draft-new";
    const stored = localStorage.getItem(draftKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          exists: true,
          savedAt: parsed.savedAt ? new Date(parsed.savedAt) : null,
          size: new Blob([stored]).size,
        };
      } catch (error) {
        return { exists: false, savedAt: null, size: 0 };
      }
    }

    return { exists: false, savedAt: null, size: 0 };
  }, [postId]);

  // Manual save
  const manualSave = useCallback(async () => {
    saveToLocalStorage();
    await saveToServer();
  }, [saveToLocalStorage, saveToServer]);

  return {
    loadDraft,
    deleteDraft,
    getDraftInfo,
    manualSave,
  };
}

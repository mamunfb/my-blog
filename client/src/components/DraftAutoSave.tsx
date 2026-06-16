import { useEffect, useState } from "react";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DraftAutoSaveProps {
  content: string;
  title: string;
  onSave?: (draft: { title: string; content: string }) => void;
}

export default function DraftAutoSave({ content, title, onSave }: DraftAutoSaveProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content || title) {
        saveDraft();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timer);
  }, [content, title]);

  const saveDraft = async () => {
    if (!content && !title) return;

    setIsSaving(true);
    try {
      const draft = { title, content };
      localStorage.setItem("blog_draft", JSON.stringify(draft));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      onSave?.(draft);
      toast.success("Draft saved automatically");
    } catch (error) {
      toast.error("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem("blog_draft");
    setLastSaved(null);
    toast.success("Draft cleared");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      {isSaving ? (
        <>
          <Save className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-foreground/70">Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-foreground/70">
            Saved at {formatTime(lastSaved)}
          </span>
        </>
      ) : (
        <>
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span className="text-foreground/70">No draft saved</span>
        </>
      )}
      {lastSaved && (
        <button
          onClick={clearDraft}
          className="text-xs text-foreground/50 hover:text-foreground/70 underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}

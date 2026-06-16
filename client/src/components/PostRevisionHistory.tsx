import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { History, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Revision {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  author?: string;
}

interface PostRevisionHistoryProps {
  revisions?: Revision[];
  onRestore?: (revision: Revision) => void;
}

export default function PostRevisionHistory({
  revisions = [],
  onRestore,
}: PostRevisionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);

  if (!revisions || revisions.length === 0) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Revision History</h3>
          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
            {revisions.length} versions
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-2">
          {revisions.map((revision, index) => (
            <Card
              key={revision.id}
              className="p-3 cursor-pointer hover:bg-muted transition-colors"
              onClick={() =>
                setSelectedRevision(
                  selectedRevision?.id === revision.id ? null : revision
                )
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">
                    {revision.title || "Untitled"}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {formatDistanceToNow(new Date(revision.createdAt), {
                      addSuffix: true,
                    })}
                    {revision.author && ` • by ${revision.author}`}
                  </p>
                </div>
                {index === 0 && (
                  <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                    Current
                  </span>
                )}
              </div>

              {selectedRevision?.id === revision.id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-foreground/70 mb-2 line-clamp-3">
                    {revision.content}
                  </p>
                  {index > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore?.(revision);
                      }}
                    >
                      Restore This Version
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Clock, User, CheckCircle } from "lucide-react";

interface ContentVersion {
  id: number;
  version: number;
  title: string;
  author: string;
  timestamp: Date;
  changes: string;
  isPublished: boolean;
}

interface ContentVersioningProps {
  postId?: number;
  currentVersion?: number;
  onRestore?: (versionId: number) => void;
}

export default function ContentVersioning({
  postId,
  currentVersion = 1,
  onRestore,
}: ContentVersioningProps) {
  const [versions, setVersions] = useState<ContentVersion[]>([
    {
      id: 1,
      version: 3,
      title: "Latest Version",
      author: "You",
      timestamp: new Date(),
      changes: "Fixed typos and improved readability",
      isPublished: true,
    },
    {
      id: 2,
      version: 2,
      title: "Previous Version",
      author: "You",
      timestamp: new Date(Date.now() - 86400000),
      changes: "Added new section on best practices",
      isPublished: true,
    },
    {
      id: 3,
      version: 1,
      title: "Original Version",
      author: "You",
      timestamp: new Date(Date.now() - 172800000),
      changes: "Initial publication",
      isPublished: true,
    },
  ]);

  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(
    null
  );

  const handleRestore = (version: ContentVersion) => {
    onRestore?.(version.id);
    setSelectedVersion(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/20 dark:to-purple-950/10 border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="font-bold">Content Versions</h3>
      </div>

      <div className="space-y-3">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              selectedVersion?.id === version.id
                ? "border-purple-400 bg-purple-100/50 dark:bg-purple-900/30"
                : "border-border hover:border-purple-300 dark:hover:border-purple-700"
            }`}
            onClick={() => setSelectedVersion(version)}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    Version {version.version}
                  </span>
                  {version.isPublished && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Published
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  {version.changes}
                </p>
              </div>
              {version.version === currentVersion && (
                <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                  Current
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-foreground/50">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{version.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(version.timestamp)}</span>
              </div>
            </div>

            {selectedVersion?.id === version.id && (
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVersion(null);
                  }}
                >
                  View Details
                </Button>
                {version.version !== currentVersion && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRestore(version);
                    }}
                  >
                    Restore This Version
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-background border border-border rounded text-sm text-foreground/70">
        <p>
          💡 <span className="font-semibold">Tip:</span> You can restore any
          previous version of your content. All changes are automatically saved.
        </p>
      </div>
    </Card>
  );
}

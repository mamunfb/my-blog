import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, X, AlertCircle } from "lucide-react";

interface VideoEmbedProps {
  url?: string;
  title?: string;
  onRemove?: () => void;
}

export default function VideoEmbed({ url, title, onRemove }: VideoEmbedProps) {
  const [videoUrl, setVideoUrl] = useState(url || "");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(!url);

  const extractVideoId = (url: string): { id: string; type: string } | null => {
    // YouTube
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (youtubeMatch) {
      return { id: youtubeMatch[1], type: "youtube" };
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return { id: vimeoMatch[1], type: "vimeo" };
    }

    return null;
  };

  const handleAddVideo = () => {
    setError("");
    if (!videoUrl.trim()) {
      setError("Please enter a video URL");
      return;
    }

    const video = extractVideoId(videoUrl);
    if (!video) {
      setError("Please enter a valid YouTube or Vimeo URL");
      return;
    }

    setIsEditing(false);
  };

  if (!videoUrl || isEditing) {
    return (
      <Card className="p-4 bg-muted">
        <div className="space-y-3">
          <h4 className="font-semibold">Embed Video</h4>
          <Input
            placeholder="Paste YouTube or Vimeo URL"
            value={videoUrl}
            onChange={(e) => {
              setVideoUrl(e.target.value);
              setError("");
            }}
          />
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={handleAddVideo} className="flex-1 gap-2">
              <Play className="w-4 h-4" />
              Embed Video
            </Button>
            {url && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  const video = extractVideoId(videoUrl);
  if (!video) return null;

  const embedUrl =
    video.type === "youtube"
      ? `https://www.youtube.com/embed/${video.id}`
      : `https://player.vimeo.com/video/${video.id}`;

  return (
    <div className="space-y-2">
      <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
        <iframe
          src={embedUrl}
          title={title || "Video"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="flex-1"
        >
          Change Video
        </Button>
        {onRemove && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

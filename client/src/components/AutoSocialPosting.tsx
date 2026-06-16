import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Share2, Clock, CheckCircle } from "lucide-react";

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  customMessage?: string;
}

interface AutoSocialPostingProps {
  postTitle?: string;
  postUrl?: string;
  onSchedule?: (platforms: string[], time: Date, message: string) => void;
}

export default function AutoSocialPosting({
  postTitle = "",
  postUrl = "",
  onSchedule,
}: AutoSocialPostingProps) {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    { id: "twitter", name: "Twitter/X", icon: "𝕏", enabled: false },
    { id: "facebook", name: "Facebook", icon: "f", enabled: false },
    { id: "linkedin", name: "LinkedIn", icon: "in", enabled: false },
    { id: "instagram", name: "Instagram", icon: "📷", enabled: false },
  ]);

  const [customMessage, setCustomMessage] = useState(
    `Check out my latest post: "${postTitle}"`
  );
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [isScheduled, setIsScheduled] = useState(false);

  const togglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSchedule = () => {
    const selectedPlatforms = platforms
      .filter((p) => p.enabled)
      .map((p) => p.id);

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform");
      return;
    }

    if (!scheduleTime) {
      alert("Please select a time to schedule");
      return;
    }

    const scheduleDate = new Date(scheduleTime);
    onSchedule?.(selectedPlatforms, scheduleDate, customMessage);
    setIsScheduled(true);

    setTimeout(() => setIsScheduled(false), 3000);
  };

  const handlePostNow = () => {
    const selectedPlatforms = platforms
      .filter((p) => p.enabled)
      .map((p) => p.id);

    if (selectedPlatforms.length === 0) {
      alert("Please select at least one platform");
      return;
    }

    onSchedule?.(selectedPlatforms, new Date(), customMessage);
    setIsScheduled(true);

    setTimeout(() => setIsScheduled(false), 3000);
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-bold">Auto Social Posting</h3>
      </div>

      <div className="space-y-4">
        {/* Platform Selection */}
        <div>
          <label className="text-sm font-semibold mb-2 block">
            Select Platforms
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center gap-2 p-2 rounded border border-border hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <Checkbox
                  checked={platform.enabled}
                  onCheckedChange={() => togglePlatform(platform.id)}
                />
                <span className="text-sm">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Custom Message
          </label>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Customize your social media message..."
            rows={3}
            maxLength={280}
          />
          <div className="text-xs text-foreground/50 mt-1">
            {customMessage.length}/280 characters
          </div>
        </div>

        {/* Schedule Time */}
        <div>
          <label className="text-sm font-semibold mb-1 block">
            Schedule Time
          </label>
          <Input
            type="datetime-local"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
          />
        </div>

        {/* Post URL */}
        {postUrl && (
          <div className="p-2 bg-background border border-border rounded text-xs text-foreground/70">
            <span className="font-semibold">URL:</span> {postUrl}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handlePostNow} className="flex-1 gap-2">
            <Share2 className="w-4 h-4" />
            Post Now
          </Button>
          <Button
            onClick={handleSchedule}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Clock className="w-4 h-4" />
            Schedule
          </Button>
        </div>

        {/* Success Message */}
        {isScheduled && (
          <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Posted to selected platforms!
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

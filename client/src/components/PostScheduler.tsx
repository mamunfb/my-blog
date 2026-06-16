import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

interface PostSchedulerProps {
  onSchedule?: (scheduledDate: Date) => void;
}

export default function PostScheduler({ onSchedule }: PostSchedulerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");

  const handleSchedule = () => {
    if (!scheduledDate) {
      toast.error("Please select a date");
      return;
    }

    const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();

    if (dateTime <= now) {
      toast.error("Scheduled date must be in the future");
      return;
    }

    onSchedule?.(dateTime);
    toast.success(`Post scheduled for ${dateTime.toLocaleString()}`);
    setIsOpen(false);
    setScheduledDate("");
    setScheduledTime("09:00");
  };

  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Schedule Post</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Cancel" : "Schedule"}
        </Button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="schedule-date">Date</Label>
            <Input
              id="schedule-date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <Label htmlFor="schedule-time" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time
            </Label>
            <Input
              id="schedule-time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>

          <Button onClick={handleSchedule} className="w-full">
            Confirm Schedule
          </Button>
        </div>
      )}
    </div>
  );
}

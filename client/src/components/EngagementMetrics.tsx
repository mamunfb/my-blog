import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Eye, Clock, Zap } from "lucide-react";

interface EngagementData {
  sectionName: string;
  readCount: number;
  averageTimeSpent: number; // in seconds
  scrollDepth: number; // percentage
}

interface EngagementMetricsProps {
  postId: number;
  sections: EngagementData[];
}

export default function EngagementMetrics({
  postId,
  sections,
}: EngagementMetricsProps) {
  const [totalEngagement, setTotalEngagement] = useState(0);
  const [mostEngagedSection, setMostEngagedSection] = useState<
    EngagementData | undefined
  >();

  useEffect(() => {
    if (sections.length > 0) {
      const total = sections.reduce((sum, s) => sum + s.readCount, 0);
      setTotalEngagement(total);

      const mostEngaged = sections.reduce((prev, current) =>
        current.readCount > prev.readCount ? current : prev
      );
      setMostEngagedSection(mostEngaged);
    }
  }, [sections]);

  const maxReads = Math.max(...sections.map((s) => s.readCount), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/70">Total Reads</p>
              <p className="text-2xl font-bold">{totalEngagement}</p>
            </div>
            <Eye className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/70">Avg. Time/Section</p>
              <p className="text-2xl font-bold">
                {sections.length > 0
                  ? Math.round(
                      sections.reduce((sum, s) => sum + s.averageTimeSpent, 0) /
                        sections.length
                    )
                  : 0}
                s
              </p>
            </div>
            <Clock className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/70">Engagement Rate</p>
              <p className="text-2xl font-bold">
                {sections.length > 0
                  ? Math.round(
                      (sections.reduce((sum, s) => sum + s.scrollDepth, 0) /
                        sections.length /
                        100) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <Zap className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart className="w-4 h-4" />
          Section Engagement
        </h4>

        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium line-clamp-1">
                  {section.sectionName}
                </span>
                <span className="text-foreground/70">
                  {section.readCount} reads
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{
                    width: `${(section.readCount / maxReads) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-foreground/50">
                <span>{Math.round(section.averageTimeSpent)}s avg time</span>
                <span>{section.scrollDepth}% scroll depth</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import { Clock } from "lucide-react";

interface ReadingTimeProps {
  content: string;
  className?: string;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime);
}

export default function ReadingTime({ content, className = "" }: ReadingTimeProps) {
  const readingTime = calculateReadingTime(content);

  return (
    <div className={`flex items-center gap-2 text-sm text-foreground/70 ${className}`}>
      <Clock className="w-4 h-4" />
      <span>{readingTime} min read</span>
    </div>
  );
}

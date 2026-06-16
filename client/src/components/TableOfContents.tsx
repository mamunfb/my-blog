import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export default function TableOfContents({ content, className = "" }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h2, h3, h4");

    const extractedHeadings: Heading[] = [];
    headingElements.forEach((heading, index) => {
      const text = heading.textContent || "";
      const level = parseInt(heading.tagName.substring(1));
      const id = `heading-${index}`;

      extractedHeadings.push({ id, text, level });
    });

    setHeadings(extractedHeadings);
  }, [content]);

  if (headings.length < 2) {
    return null;
  }

  const scrollToHeading = (id: string) => {
    // In a real implementation, this would scroll to the actual heading
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between font-bold mb-3"
      >
        <span>Table of Contents</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <nav className="space-y-2">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`block text-left text-sm hover:text-accent transition-colors w-full truncate ${
                heading.level === 2 ? "font-medium" : "text-foreground/70 ml-4"
              }`}
              title={heading.text}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

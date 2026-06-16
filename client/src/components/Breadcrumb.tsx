import { useEffect } from "react";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb component with structured data (JSON-LD)
 * Improves navigation UX and SEO
 */
export default function Breadcrumb({ items }: BreadcrumbProps) {
  // Generate structured data for breadcrumbs
  useEffect(() => {
    const breadcrumbList = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(item.href && { item: item.href }),
      })),
    };

    // Add or update structured data
    let script = document.querySelector('script[data-breadcrumb]') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-breadcrumb", "true");
      document.head.appendChild(script);
    }
    (script as HTMLScriptElement).textContent = JSON.stringify(breadcrumbList);
  }, [items]);

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm text-foreground/70">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item.href && !item.current ? (
              <a
                href={item.href}
                className="text-accent hover:text-accent/80 transition-colors underline"
              >
                {item.label}
              </a>
            ) : (
              <span className={item.current ? "text-foreground font-medium" : ""}>
                {item.label}
              </span>
            )}

            {index < items.length - 1 && (
              <ChevronRight className="w-4 h-4 text-foreground/50" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

import { describe, expect, it } from "vitest";
import { buildBrandedNewsletterEmail } from "./newsletterEmailHandler";
import { isScheduleDue } from "./scheduledPublisher";

describe("advanced blog features", () => {
  it("renders a branded newsletter with logo, colors, CTA, and unsubscribe link", () => {
    const html = buildBrandedNewsletterEmail(
      {
        id: 7,
        title: "A <great> story",
        slug: "great-story",
        excerpt: "A useful excerpt",
        content: "Full content",
      },
      "<p>Generated newsletter copy</p>",
      {
        name: "Vibrant Journal",
        logoUrl: "https://cdn.example.com/logo.png",
        primaryColor: "#123456",
        accentColor: "#abcdef",
        appUrl: "https://example.com",
      },
    );

    expect(html).toContain("https://cdn.example.com/logo.png");
    expect(html).toContain("#123456");
    expect(html).toContain("#abcdef");
    expect(html).toContain("A &lt;great&gt; story");
    expect(html).toContain("Generated newsletter copy");
    expect(html).toContain("https://example.com/blog/great-story");
    expect(html).toContain("https://example.com/unsubscribe");
  });

  it("only considers past or current schedules due", () => {
    const now = new Date("2026-10-29T06:00:00.000Z");
    expect(isScheduleDue(new Date("2026-10-29T05:59:59.000Z"), now)).toBe(true);
    expect(isScheduleDue(new Date("2026-10-29T06:00:00.000Z"), now)).toBe(true);
    expect(isScheduleDue(new Date("2026-10-29T06:00:01.000Z"), now)).toBe(false);
    expect(isScheduleDue(null, now)).toBe(false);
  });
});

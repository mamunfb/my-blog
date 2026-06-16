import { getDb } from "./db";
import { posts, categories } from "../drizzle/schema";
import { SUPPORTED_LANGUAGES } from "../client/src/lib/translationService";

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  alternates?: Array<{
    lang: string;
    href: string;
  }>;
}

/**
 * Generate XML sitemap for the blog
 */
export async function generateSitemap(baseUrl: string): Promise<string> {
  const entries: SitemapEntry[] = [];

  try {
    // Add homepage for each language
    const languages = Object.keys(SUPPORTED_LANGUAGES);
    languages.forEach((lang) => {
      entries.push({
        url: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 1.0,
        alternates: languages.map((l) => ({
          lang: l,
          href: `${baseUrl}?lang=${l}`,
        })),
      });
    });

    // Add blog listing page
    entries.push({
      url: `${baseUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.9,
      alternates: languages.map((lang) => ({
        lang,
        href: `${baseUrl}/blog?lang=${lang}`,
      })),
    });

    // Add all published posts
    const db = await getDb();
    if (!db) {
      console.warn("[Sitemap] Database not available");
      return generateSitemapXML(entries);
    }
    const allPosts = await db.select().from(posts);
    
    allPosts.forEach((post: any) => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      entries.push({
        url: postUrl,
        lastmod: (post.updatedAt || post.publishedAt || post.createdAt).toISOString(),
        changefreq: "weekly",
        priority: 0.8,
        alternates: languages.map((lang) => ({
          lang,
          href: `${postUrl}?lang=${lang}`,
        })),
      });
    });

    // Add all categories
    const allCategories = await db.select().from(categories);
    
    allCategories.forEach((category: any) => {
      const categoryUrl = `${baseUrl}/category/${category.slug}`;
      entries.push({
        url: categoryUrl,
        lastmod: (category.updatedAt || category.createdAt).toISOString(),
        changefreq: "weekly",
        priority: 0.7,
        alternates: languages.map((lang) => ({
          lang,
          href: `${categoryUrl}?lang=${lang}`,
        })),
      });
    });

    // Generate XML
    return generateSitemapXML(entries);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return a basic sitemap with just homepage if there's an error
    return generateSitemapXML([
      {
        url: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: 1.0,
      },
    ]);
  }
}

/**
 * Generate sitemap index for multiple sitemaps
 */
export async function generateSitemapIndex(baseUrl: string): Promise<string> {
  const sitemaps = [
    {
      loc: `${baseUrl}/sitemap.xml`,
      lastmod: new Date().toISOString(),
    },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemaps.forEach((sitemap) => {
    xml += "  <sitemap>\n";
    xml += `    <loc>${escapeXml(sitemap.loc)}</loc>\n`;
    xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
    xml += "  </sitemap>\n";
  });

  xml += "</sitemapindex>";

  return xml;
}

/**
 * Generate XML from sitemap entries
 */
function generateSitemapXML(entries: SitemapEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '         xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  entries.forEach((entry) => {
    xml += "  <url>\n";
    xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;

    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }

    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    }

    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority}</priority>\n`;
    }

    // Add hreflang alternates
    if (entry.alternates && entry.alternates.length > 0) {
      entry.alternates.forEach((alt) => {
        xml += `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.lang)}" href="${escapeXml(alt.href)}" />\n`;
      });
    }

    xml += "  </url>\n";
  });

  xml += "</urlset>";

  return xml;
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(baseUrl: string): string {
  const robotsTxt = `# Robots.txt for ${baseUrl}
# Generated automatically for multilingual blog

# Allow all bots
User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin
Disallow: /api/
Disallow: /_next/
Disallow: /.next/

# Allow specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Crawl delay (in seconds)
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-index.xml

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

# Comment: This robots.txt file is automatically generated
# Last updated: ${new Date().toISOString()}
`;

  return robotsTxt;
}

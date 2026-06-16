/**
 * SEO Helper Functions
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

export function setSEOMetadata(metadata: SEOMetadata) {
  // Set title
  document.title = metadata.title;

  // Set or update meta tags
  updateMetaTag("name", "description", metadata.description);
  
  if (metadata.keywords) {
    updateMetaTag("name", "keywords", metadata.keywords.join(", "));
  }

  if (metadata.author) {
    updateMetaTag("name", "author", metadata.author);
  }

  // Open Graph tags
  updateMetaTag("property", "og:title", metadata.title);
  updateMetaTag("property", "og:description", metadata.description);
  
  if (metadata.ogImage) {
    updateMetaTag("property", "og:image", metadata.ogImage);
  }

  if (metadata.ogUrl) {
    updateMetaTag("property", "og:url", metadata.ogUrl);
  }

  // Twitter Card tags
  updateMetaTag("name", "twitter:title", metadata.title);
  updateMetaTag("name", "twitter:description", metadata.description);
  
  if (metadata.ogImage) {
    updateMetaTag("name", "twitter:image", metadata.ogImage);
  }

  // Article tags
  if (metadata.publishedDate) {
    updateMetaTag("property", "article:published_time", metadata.publishedDate);
  }

  if (metadata.modifiedDate) {
    updateMetaTag("property", "article:modified_time", metadata.modifiedDate);
  }
}

function updateMetaTag(
  attribute: "name" | "property",
  content: string,
  value: string
) {
  let tag = document.querySelector(`meta[${attribute}="${content}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, content);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", value);
}

export function generateSitemap(posts: Array<{ slug: string; updatedAt: Date }>) {
  const baseUrl = window.location.origin;
  
  const urls: Array<{ url: string; priority: number; lastmod?: string }> = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/blog`, priority: 0.9 },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      priority: 0.8,
      lastmod: post.updatedAt.toISOString().split("T")[0],
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (item) => `
  <url>
    <loc>${item.url}</loc>
    ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ""}
    <priority>${item.priority}</priority>
  </url>
  `
    )
    .join("")}
</urlset>`

  return xml;
}

export function generateRobotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${window.location.origin}/sitemap.xml`;
}

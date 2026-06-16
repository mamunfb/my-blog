import { SUPPORTED_LANGUAGES } from "./translationService";

export interface SEOMetaData {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  image?: string;
  url: string;
  type?: "website" | "article";
  publishedDate?: string;
  modifiedDate?: string;
  language: string;
}

/**
 * Set meta tags for SEO
 */
export function setMetaTags(metadata: SEOMetaData) {
  // Title
  document.title = metadata.title;
  setMetaTag("og:title", metadata.title);
  setMetaTag("twitter:title", metadata.title);

  // Description
  setMetaTag("description", metadata.description);
  setMetaTag("og:description", metadata.description);
  setMetaTag("twitter:description", metadata.description);

  // Keywords
  if (metadata.keywords) {
    setMetaTag("keywords", metadata.keywords);
  }

  // Author
  if (metadata.author) {
    setMetaTag("author", metadata.author);
  }

  // Image
  if (metadata.image) {
    setMetaTag("og:image", metadata.image);
    setMetaTag("twitter:image", metadata.image);
  }

  // URL
  setMetaTag("og:url", metadata.url);
  setMetaTag("canonical", metadata.url, "link");

  // Type
  setMetaTag("og:type", metadata.type || "website");

  // Language
  setMetaTag("og:locale", getLocaleCode(metadata.language));

  // Article specific
  if (metadata.type === "article") {
    if (metadata.publishedDate) {
      setMetaTag("article:published_time", metadata.publishedDate);
    }
    if (metadata.modifiedDate) {
      setMetaTag("article:modified_time", metadata.modifiedDate);
    }
  }

  // Twitter Card
  setMetaTag("twitter:card", "summary_large_image");
}

/**
 * Set a single meta tag
 */
function setMetaTag(
  name: string,
  content: string,
  type: "meta" | "link" = "meta"
) {
  if (type === "meta") {
    let element = document.querySelector(`meta[name="${name}"]`) ||
      document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null;

    if (!element) {
      element = document.createElement("meta");
      const isProperty = name.startsWith("og:") || name.startsWith("article:");
      if (isProperty) {
        element.setAttribute("property", name);
      } else {
        element.setAttribute("name", name);
      }
      document.head.appendChild(element);
    }
    (element as HTMLMetaElement).content = content;
  } else if (type === "link") {
    let element = document.querySelector(`link[rel="${name}"]`) as HTMLLinkElement | null;
    if (!element) {
      element = document.createElement("link");
      element.setAttribute("rel", name);
      document.head.appendChild(element);
    }
    element.href = content;
  }
}

/**
 * Add hreflang links for language alternates
 */
export function setHrefLangLinks(url: string, languages: string[] = []) {
  // Remove existing hreflang links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => {
    el.remove();
  });

  // Add hreflang for each language
  const baseUrl = url.split("?")[0].split("#")[0];
  const langList = languages.length > 0 ? languages : Object.keys(SUPPORTED_LANGUAGES);

  langList.forEach((lang) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    (link as any).hreflang = lang;
    link.href = `${baseUrl}?lang=${lang}`;
    document.head.appendChild(link);
  });

  // Add x-default hreflang
  const defaultLink = document.createElement("link");
  defaultLink.rel = "alternate";
  (defaultLink as any).hreflang = "x-default";
  defaultLink.href = baseUrl;
  document.head.appendChild(defaultLink);
}

/**
 * Generate structured data (JSON-LD) for blog posts
 */
export function generateBlogPostSchema(data: {
  title: string;
  description: string;
  content: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
  language: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    image: data.image || "",
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate || data.publishedDate,
    author: {
      "@type": "Person",
      name: data.author,
    },
    inLanguage: getLocaleCode(data.language),
    url: data.url,
  };

  return schema;
}

/**
 * Generate structured data (JSON-LD) for website
 */
export function generateWebsiteSchema(data: {
  name: string;
  description: string;
  url: string;
  logo?: string;
  language: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name,
    description: data.description,
    url: data.url,
    inLanguage: getLocaleCode(data.language),
    ...(data.logo && { image: data.logo }),
  };

  return schema;
}

/**
 * Set JSON-LD structured data
 */
export function setStructuredData(schema: Record<string, any>) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Convert language code to locale code (e.g., 'en' -> 'en_US')
 */
export function getLocaleCode(language: string): string {
  const localeMap: Record<string, string> = {
    en: "en_US",
    es: "es_ES",
    fr: "fr_FR",
    de: "de_DE",
    it: "it_IT",
    pt: "pt_BR",
    ru: "ru_RU",
    ja: "ja_JP",
    zh: "zh_CN",
    "zh-TW": "zh_TW",
    ko: "ko_KR",
    ar: "ar_SA",
    hi: "hi_IN",
    th: "th_TH",
    vi: "vi_VN",
    id: "id_ID",
    tr: "tr_TR",
    pl: "pl_PL",
    nl: "nl_NL",
    sv: "sv_SE",
    da: "da_DK",
    no: "nb_NO",
    fi: "fi_FI",
    cs: "cs_CZ",
    hu: "hu_HU",
    ro: "ro_RO",
    el: "el_GR",
    he: "he_IL",
    uk: "uk_UA",
    bg: "bg_BG",
    hr: "hr_HR",
    sr: "sr_RS",
    sk: "sk_SK",
    sl: "sl_SI",
    et: "et_EE",
    lv: "lv_LV",
    lt: "lt_LT",
  };

  return localeMap[language] || `${language}_${language.toUpperCase()}`;
}

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Add sitemap link to head
 */
export function addSitemapLink() {
  let link = document.querySelector('link[rel="sitemap"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "sitemap";
    link.type = "application/xml";
    link.href = "/sitemap.xml";
    document.head.appendChild(link);
  }
}

/**
 * Get language-specific keywords
 */
export function getLanguageKeywords(language: string, baseKeywords: string[] = []): string {
  const languageKeywords: Record<string, string[]> = {
    en: ["blog", "article", "story", "ideas"],
    es: ["blog", "artículo", "historia", "ideas"],
    fr: ["blog", "article", "histoire", "idées"],
    de: ["blog", "artikel", "geschichte", "ideen"],
    ja: ["ブログ", "記事", "ストーリー", "アイデア"],
    zh: ["博客", "文章", "故事", "想法"],
    ar: ["مدونة", "مقالة", "قصة", "أفكار"],
    hi: ["ब्लॉग", "लेख", "कहानी", "विचार"],
  };

  const keywords = [
    ...baseKeywords,
    ...(languageKeywords[language] || languageKeywords["en"]),
  ];

  return keywords.join(", ");
}

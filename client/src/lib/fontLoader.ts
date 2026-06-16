import { useEffect } from "react";

// Language-specific font loading configuration
export const LANGUAGE_FONTS: Record<string, string> = {
  // CJK Languages
  zh: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;700&display=swap",
  "zh-TW": "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;700&display=swap",
  ja: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700&display=swap",
  ko: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700&display=swap",

  // Arabic
  ar: "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap",

  // Devanagari (Hindi, Sanskrit, etc.)
  hi: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap",

  // Thai
  th: "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;700&display=swap",

  // Bengali
  bn: "https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap",

  // Khmer
  km: "https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;600;700&display=swap",

  // Lao
  lo: "https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;600;700&display=swap",

  // Myanmar
  my: "https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;600;700&display=swap",

  // Georgian
  ka: "https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;600;700&display=swap",

  // Armenian
  hy: "https://fonts.googleapis.com/css2?family=Noto+Sans+Armenian:wght@400;600;700&display=swap",

  // Hebrew
  he: "https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@400;600;700&display=swap",

  // Sinhala
  si: "https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;600;700&display=swap",

  // Tamil
  ta: "https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&display=swap",

  // Telugu
  te: "https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;600;700&display=swap",

  // Kannada
  kn: "https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;600;700&display=swap",

  // Malayalam
  ml: "https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;600;700&display=swap",
};

export function loadLanguageFont(language: string) {
  const fontUrl = LANGUAGE_FONTS[language];
  if (!fontUrl) return;

  // Check if font is already loaded
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
  if (existingLink) return;

  // Create and append the font link
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = fontUrl;
  document.head.appendChild(link);
}

export function useLanguageFontLoader(language: string) {
  useEffect(() => {
    loadLanguageFont(language);
  }, [language]);
}

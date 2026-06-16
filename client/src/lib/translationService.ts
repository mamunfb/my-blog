// Language detection and translation service
// Supports 20+ languages with automatic country detection

export const SUPPORTED_LANGUAGES: Record<string, { name: string; nativeName: string; flag: string; rtl?: boolean }> = {
  en: { name: "English", nativeName: "English", flag: "🇬🇧" },
  bn: { name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  es: { name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  fr: { name: "French", nativeName: "Français", flag: "🇫🇷" },
  de: { name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  it: { name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  pt: { name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  ru: { name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  ja: { name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  zh: { name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  ko: { name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  ar: { name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  hi: { name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  th: { name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  vi: { name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  id: { name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  tr: { name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  pl: { name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  nl: { name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  sv: { name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  he: { name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", rtl: true },
  ur: { name: "Urdu", nativeName: "اردو", flag: "🇵🇰", rtl: true },
};

// Country to language mapping
export const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  BD: "bn", // Bangladesh
  IN: "hi", // India
  US: "en",
  GB: "en",
  ES: "es",
  FR: "fr",
  DE: "de",
  IT: "it",
  PT: "pt",
  RU: "ru",
  JP: "ja",
  CN: "zh",
  KR: "ko",
  SA: "ar",
  AE: "ar",
  TH: "th",
  VN: "vi",
  ID: "id",
  TR: "tr",
  PL: "pl",
  NL: "nl",
  SE: "sv",
  IL: "he",
  PK: "ur",
};

// Get user's country from IP (using free API)
export async function detectCountryFromIP(): Promise<string | null> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return data.country_code || null;
  } catch (error) {
    console.error("Failed to detect country:", error);
    return null;
  }
}

// Get browser language
export function getBrowserLanguage(): string {
  const browserLang = navigator.language.split("-")[0];
  return SUPPORTED_LANGUAGES[browserLang as keyof typeof SUPPORTED_LANGUAGES]
    ? browserLang
    : "en";
}

// Detect user's preferred language
export async function detectUserLanguage(): Promise<string> {
  // Check localStorage first
  const savedLanguage = localStorage.getItem("preferredLanguage");
  if (savedLanguage) return savedLanguage;

  // Try to detect from country
  try {
    const country = await detectCountryFromIP();
    if (country && COUNTRY_TO_LANGUAGE[country]) {
      return COUNTRY_TO_LANGUAGE[country];
    }
  } catch (error) {
    console.error("Country detection failed:", error);
  }

  // Fall back to browser language
  return getBrowserLanguage();
}

// Save language preference
export function setPreferredLanguage(lang: string): void {
  localStorage.setItem("preferredLanguage", lang);
  // Apply RTL if needed
  const isRTL =
    SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]?.rtl || false;
  document.documentElement.dir = isRTL ? "rtl" : "ltr";
  document.documentElement.lang = lang;
}

// Simple translation function (in production, use a proper translation API)
export const translations: Record<
  string,
  Record<string, string>
> = {
  bn: {
    "All Posts": "সকল পোস্ট",
    "Featured Stories": "বৈশিষ্ট্যযুক্ত গল্প",
    "Latest Articles": "সর্বশেষ নিবন্ধ",
    Home: "হোম",
    About: "সম্পর্কে",
    Contact: "যোগাযোগ",
    Search: "অনুসন্ধান",
    Categories: "বিভাগ",
    Tags: "ট্যাগ",
    "Read More": "আরও পড়ুন",
    "Share Post": "পোস্ট শেয়ার করুন",
    Comments: "মন্তব্য",
    "Leave a Comment": "একটি মন্তব্য রেখে যান",
    Submit: "জমা দিন",
    Loading: "লোড হচ্ছে",
    Error: "ত্রুটি",
    "No posts found": "কোনো পোস্ট পাওয়া যায়নি",
  },
  es: {
    "All Posts": "Todos los Artículos",
    "Featured Stories": "Historias Destacadas",
    "Latest Articles": "Últimos Artículos",
    Home: "Inicio",
    About: "Acerca de",
    Contact: "Contacto",
    Search: "Buscar",
    Categories: "Categorías",
    Tags: "Etiquetas",
    "Read More": "Leer Más",
    "Share Post": "Compartir Artículo",
    Comments: "Comentarios",
    "Leave a Comment": "Dejar un Comentario",
    Submit: "Enviar",
    Loading: "Cargando",
    Error: "Error",
    "No posts found": "No se encontraron artículos",
  },
  fr: {
    "All Posts": "Tous les Articles",
    "Featured Stories": "Histoires en Vedette",
    "Latest Articles": "Derniers Articles",
    Home: "Accueil",
    About: "À Propos",
    Contact: "Contact",
    Search: "Rechercher",
    Categories: "Catégories",
    Tags: "Étiquettes",
    "Read More": "Lire la Suite",
    "Share Post": "Partager l'Article",
    Comments: "Commentaires",
    "Leave a Comment": "Laisser un Commentaire",
    Submit: "Soumettre",
    Loading: "Chargement",
    Error: "Erreur",
    "No posts found": "Aucun article trouvé",
  },
  de: {
    "All Posts": "Alle Artikel",
    "Featured Stories": "Ausgewählte Geschichten",
    "Latest Articles": "Neueste Artikel",
    Home: "Startseite",
    About: "Über",
    Contact: "Kontakt",
    Search: "Suchen",
    Categories: "Kategorien",
    Tags: "Tags",
    "Read More": "Mehr Lesen",
    "Share Post": "Artikel Teilen",
    Comments: "Kommentare",
    "Leave a Comment": "Kommentar Hinterlassen",
    Submit: "Absenden",
    Loading: "Wird geladen",
    Error: "Fehler",
    "No posts found": "Keine Artikel gefunden",
  },
  ar: {
    "All Posts": "جميع المنشورات",
    "Featured Stories": "القصص المميزة",
    "Latest Articles": "أحدث المقالات",
    Home: "الرئيسية",
    About: "حول",
    Contact: "اتصل",
    Search: "بحث",
    Categories: "الفئات",
    Tags: "الوسوم",
    "Read More": "اقرأ المزيد",
    "Share Post": "مشاركة المنشور",
    Comments: "التعليقات",
    "Leave a Comment": "ترك تعليق",
    Submit: "إرسال",
    Loading: "جاري التحميل",
    Error: "خطأ",
    "No posts found": "لم يتم العثور على مقالات",
  },
  hi: {
    "All Posts": "सभी पोस्ट",
    "Featured Stories": "विशेष कहानियाँ",
    "Latest Articles": "नवीनतम लेख",
    Home: "होम",
    About: "परिचय",
    Contact: "संपर्क",
    Search: "खोज",
    Categories: "श्रेणियाँ",
    Tags: "टैग",
    "Read More": "और पढ़ें",
    "Share Post": "पोस्ट साझा करें",
    Comments: "टिप्पणियाँ",
    "Leave a Comment": "एक टिप्पणी छोड़ें",
    Submit: "जमा करें",
    Loading: "लोड हो रहा है",
    Error: "त्रुटि",
    "No posts found": "कोई पोस्ट नहीं मिली",
  },
  ja: {
    "All Posts": "すべての投稿",
    "Featured Stories": "特集記事",
    "Latest Articles": "最新記事",
    Home: "ホーム",
    About: "について",
    Contact: "お問い合わせ",
    Search: "検索",
    Categories: "カテゴリー",
    Tags: "タグ",
    "Read More": "続きを読む",
    "Share Post": "投稿を共有",
    Comments: "コメント",
    "Leave a Comment": "コメントを残す",
    Submit: "送信",
    Loading: "読み込み中",
    Error: "エラー",
    "No posts found": "投稿が見つかりません",
  },
  zh: {
    "All Posts": "所有文章",
    "Featured Stories": "精选故事",
    "Latest Articles": "最新文章",
    Home: "首页",
    About: "关于",
    Contact: "联系",
    Search: "搜索",
    Categories: "分类",
    Tags: "标签",
    "Read More": "阅读更多",
    "Share Post": "分享文章",
    Comments: "评论",
    "Leave a Comment": "留下评论",
    Submit: "提交",
    Loading: "加载中",
    Error: "错误",
    "No posts found": "未找到文章",
  },
};

// Translate a key
export function t(key: string, language: string = "en"): string {
  if (language === "en") return key;
  return (
    translations[language]?.[key] ||
    translations["en"]?.[key] ||
    key
  );
}

// Get all supported languages
export function getSupportedLanguages() {
  return Object.entries(SUPPORTED_LANGUAGES).map(([code, data]) => ({
    code,
    ...data,
  }));
}

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी | Hindi" },
  { code: "as", label: "অসমীয়া | Assamese" },
  { code: "bn", label: "বাংলা | Bengali" },
  { code: "brx", label: "बरʼ | Bodo" },
  { code: "doi", label: "डोगरी | Dogri" },
  { code: "gu", label: "ગુજરાતી | Gujarati" },
  { code: "kn", label: "ಕನ್ನಡ | Kannada" },
  { code: "ks", label: "Kashmiri" },
  { code: "kok", label: "कोंकणी | Konkani" },
  { code: "mai", label: "मैथिली | Maithili" },
  { code: "ml", label: "മലയാളം | Malayalam" },
  { code: "mni", label: "Manipuri (Meitei)" },
  { code: "mr", label: "मराठी | Marathi" },
  { code: "ne", label: "नेपाली | Nepali" },
  { code: "or", label: "ଓଡ଼ିଆ | Odia" },
  { code: "pa", label: "ਪੰਜਾਬੀ | Punjabi" },
  { code: "sa", label: "संस्कृत | Sanskrit" },
  { code: "sat", label: "Santali" },
  { code: "sd", label: "सिन्धी | Sindhi" },
  { code: "ta", label: "தமிழ் | Tamil" },
  { code: "te", label: "తెలుగు | Telugu" },
  { code: "ur", label: "اردو | Urdu" },
];

export const LANGUAGES = LANGUAGE_OPTIONS.map((item) => item.label);

export const UI_LOCALES = ["en", "hi", "mni"];

export function languageLabel(code) {
  return LANGUAGE_OPTIONS.find((item) => item.code === code)?.label || "English";
}

export function normalizeLanguage(value) {
  if (!value) return "en";
  const raw = String(value).trim();
  const byCode = LANGUAGE_OPTIONS.find((item) => item.code === raw.toLowerCase());
  if (byCode) return byCode.code;
  const byLabel = LANGUAGE_OPTIONS.find((item) => item.label === raw || item.label.split(" | ")[0] === raw);
  if (byLabel) return byLabel.code;
  const lower = raw.toLowerCase();
  if (lower.startsWith("hi")) return "hi";
  if (lower.startsWith("mni") || lower.includes("manipur") || lower.includes("meitei")) return "mni";
  if (lower.startsWith("en")) return "en";
  return "en";
}

export function detectBrowserLanguage() {
  const nav = (typeof navigator !== "undefined" && (navigator.language || navigator.userLanguage)) || "en";
  return normalizeLanguage(nav);
}

export function uiLocale(code) {
  const normalized = normalizeLanguage(code);
  return UI_LOCALES.includes(normalized) ? normalized : "en";
}

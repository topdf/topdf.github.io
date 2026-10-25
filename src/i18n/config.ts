import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';
import ru from './locales/ru.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', badge: 'US', label: 'English', path: '/', hreflang: 'en' },
  { code: 'es', badge: 'ES', label: 'Español', path: '/es/', hreflang: 'es' },
  { code: 'pt', badge: 'BR', label: 'Português', path: '/pt/', hreflang: 'pt' },
  { code: 'de', badge: 'DE', label: 'Deutsch', path: '/de/', hreflang: 'de' },
  { code: 'fr', badge: 'FR', label: 'Français', path: '/fr/', hreflang: 'fr' },
  { code: 'ja', badge: 'JP', label: '日本語', path: '/ja/', hreflang: 'ja' },
  { code: 'zh', badge: 'CN', label: '简体中文', path: '/zh/', hreflang: 'zh' },
  { code: 'ru', badge: 'RU', label: 'Русский', path: '/ru/', hreflang: 'ru' }
] as const;

export type LangCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export type Dictionary = typeof en;

const dictionaries: Record<LangCode, Dictionary> = {
  en,
  es,
  pt,
  de,
  fr,
  ja,
  zh,
  ru
};

export function getDictionary(lang: LangCode): Dictionary {
  return dictionaries[lang] || dictionaries.en;
}

export function getLanguageMeta(lang: LangCode) {
  return SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
}

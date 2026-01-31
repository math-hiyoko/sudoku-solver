import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import jaTranslation from '../locales/ja/translation.json';
import enTranslation from '../locales/en/translation.json';
import frTranslation from '../locales/fr/translation.json';
import zhTranslation from '../locales/zh/translation.json';

const resources = {
  ja: {
    translation: jaTranslation,
  },
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
};

// Helper function to detect language from browser settings
// Called only after hydration to avoid SSR mismatch
export const detectLanguage = (): string => {
  if (typeof window === 'undefined') return 'ja';

  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && ['ja', 'en', 'fr', 'zh'].includes(savedLanguage)) {
    return savedLanguage;
  }

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('zh')) return 'zh';

  // Default to Japanese if no match
  return 'ja';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    // Always initialize with 'ja' to ensure SSR/client match
    // Language will be updated after hydration via useEffect
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

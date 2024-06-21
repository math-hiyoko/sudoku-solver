import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationJA from './locales/ja/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  ja: {
    translation: translationJA,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring'],
      lookupQuerystring: 'lang',
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations directly to ensure they're bundled and available immediately
import enTranslation from './en.json';
import frTranslation from './fr.json';
import arTranslation from './ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'ar'],
    load: 'languageOnly', // Only load base languages (e.g., 'en' instead of 'en-US')
    
    // Bundled resources for instant paint and reliable translation
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      ar: { translation: arTranslation }
    },

    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'htmlTag', 'cookie', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Apply RTL direction on init
const applyDirection = (lang) => {
  // Use resolvedLanguage to get the actual language being used (e.g., 'ar' from 'ar-DZ')
  const currentLang = lang || i18n.resolvedLanguage || 'en';
  const dir = currentLang.startsWith('ar') ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', currentLang);
};

// Initial application
applyDirection(i18n.language);

i18n.on('languageChanged', (lang) => {
  applyDirection(lang);
});

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from '../translations/en';
import { de } from '../translations/de';
import { ar } from '../translations/ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      de,
      ar,
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 
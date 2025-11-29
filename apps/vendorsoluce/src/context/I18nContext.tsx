import React, { createContext, useContext, useEffect } from 'react';
import * as i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from '../locales/en/translation.json';
import frTranslation from '../locales/fr/translation.json';

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect language from browser
  .use(initReactI18next) // Bind i18next to React
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  });

// Create context for language switcher
interface I18nContextType {
  changeLanguage: (lng: string) => void;
  currentLanguage: string;
  supportedLanguages: { code: string; name: string }[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  
  const supportedLanguages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  useEffect(() => {
    // Apply RTL direction if needed based on language
    // Currently none of our languages are RTL, but this is for future-proofing
    document.documentElement.dir = i18n.dir();
  }, [i18n]);

  return (
    <I18nContext.Provider
      value={{
        changeLanguage,
        currentLanguage: i18n.language,
        supportedLanguages
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export default i18n;
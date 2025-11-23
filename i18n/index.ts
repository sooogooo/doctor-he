import React, { createContext, useContext, useState, useCallback } from 'react';
import { zh, type Translations } from './zh';
import { en } from './en';

export type Language = 'zh' | 'en';

const translations: Record<Language, Translations> = {
  zh,
  en,
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

const LANGUAGE_KEY = 'app_language';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_KEY) as Language;
      if (saved && (saved === 'zh' || saved === 'en')) {
        return saved;
      }
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('zh')) {
        return 'zh';
      }
    }
    return 'zh'; // Default to Chinese
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_KEY, lang);
    }
  }, []);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return React.createElement(I18nContext.Provider, { value }, children);
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Helper to get nested translation keys
export function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return the key if not found
    }
  }

  return typeof current === 'string' ? current : path;
}

export { zh, en, type Translations };

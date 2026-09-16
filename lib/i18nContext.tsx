'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale, replaceNameForZh, replaceNameForEn } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  translateDynamicText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'ja',
  setLocale: () => {},
  t: (key: string) => key,
  translateDynamicText: (text: string) => text,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('ja');

  useEffect(() => {
    const saved = localStorage.getItem('kakyonoma_lang') as Locale;
    if (saved && (saved === 'ja' || saved === 'zh' || saved === 'en')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('kakyonoma_lang', newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[locale];
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to 'ja' if key missing
        let fallback: any = translations['ja'];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key;
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }
    return typeof current === 'string' ? current : key;
  };

  const translateDynamicText = (text: string): string => {
    if (!text) return text;
    if (locale === 'zh') {
      return replaceNameForZh(text);
    }
    if (locale === 'en') {
      return replaceNameForEn(text);
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, translateDynamicText }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

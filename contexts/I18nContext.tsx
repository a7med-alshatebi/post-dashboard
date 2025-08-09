'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Translation types
type TranslationKey = string;
type Translations = Record<string, any>;

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Available locales
export const LOCALES = {
  en: 'English',
  ar: 'العربية',
} as const;

export type Locale = keyof typeof LOCALES;

// Default translations to avoid errors
const defaultTranslations: Translations = {};

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await import(`../translations/${locale}.json`);
        setTranslations(response.default || response);
      } catch (error) {
        console.error(`Failed to load translations for locale: ${locale}`, error);
        // Fallback to English if loading fails
        if (locale !== 'en') {
          try {
            const fallback = await import('../translations/en.json');
            setTranslations(fallback.default || fallback);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations', fallbackError);
          }
        }
      }
    };

    loadTranslations();
  }, [locale]);

  // Load saved locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && LOCALES[savedLocale]) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: string) => {
    if (LOCALES[newLocale as Locale]) {
      setLocaleState(newLocale as Locale);
      localStorage.setItem('locale', newLocale);
      
      // Update HTML attributes
      document.documentElement.lang = newLocale;
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    }
  };

  // Translation function
  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return the key if translation is not found
        console.warn(`Translation missing for key: ${key} in locale: ${locale}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const isRTL = locale === 'ar';

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

// Custom hook to use internationalization
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

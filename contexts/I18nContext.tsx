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

export const I18nProvider = ({ children }: { children: ReactNode }) => {

  // Initialize with saved locale to prevent flash
  const getInitialLocale = (): string => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('locale');
        return saved && saved in LOCALES ? saved : 'en';
      } catch {
        return 'en';
      }
    }
    return 'en';
  };

  const [locale, setLocaleState] = useState<string>(getInitialLocale);
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  // Load translations when locale changes
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
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    loadTranslations();
  }, [locale]);

  // Load saved locale from localStorage (sync with pre-hydration)
  useEffect(() => {
    const savedLocale = getInitialLocale();
    if (savedLocale !== locale) {
      setLocaleState(savedLocale);
    }
    // Ensure DOM attributes are set (should already be done by pre-hydration script)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = savedLocale;
      document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.className = document.documentElement.className.replace(/\b(rtl|ltr)\b/g, '');
      document.documentElement.classList.add(savedLocale === 'ar' ? 'rtl' : 'ltr');
    }
  }, []);

  // Update document direction whenever locale changes
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const setLocale = (newLocale: string) => {
    if (newLocale in LOCALES) {
      setLocaleState(newLocale);
      localStorage.setItem('locale', newLocale);
      
      // Update HTML attributes and classes immediately
      const isRTL = newLocale === 'ar';
      document.documentElement.lang = newLocale;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      
      // Update classes for immediate styling
      document.documentElement.className = document.documentElement.className.replace(/\b(rtl|ltr)\b/g, '');
      document.documentElement.classList.add(isRTL ? 'rtl' : 'ltr');
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

  if (loading) return null;
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

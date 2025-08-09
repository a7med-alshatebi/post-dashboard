'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Extend the Window interface to include our global variables
declare global {
  interface Window {
    __INITIAL_LOCALE__?: string;
    __IS_RTL__?: boolean;
  }
}

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
  // Get initial locale from pre-hydration script or localStorage
  const getInitialLocale = (): string => {
    if (typeof window !== 'undefined') {
      // Check if we have pre-hydration values first
      if (window.__INITIAL_LOCALE__) {
        return window.__INITIAL_LOCALE__;
      }
      // Fallback to localStorage check
      try {
        return localStorage.getItem('locale') || 'en';
      } catch {
        return 'en';
      }
    }
    return 'en';
  };

  const [locale, setLocaleState] = useState<string>(getInitialLocale);
  const [translations, setTranslations] = useState<Translations>({});

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
      }
    };

    loadTranslations();
  }, [locale]);

  // Load saved locale from localStorage with pre-hydration support
  useEffect(() => {
    const initialLocale = getInitialLocale();
    if (initialLocale !== locale && initialLocale in LOCALES) {
      setLocaleState(initialLocale);
    }
    
    // Ensure DOM is in sync (should already be set by pre-hydration script)
    if (typeof document !== 'undefined' && initialLocale in LOCALES) {
      document.documentElement.lang = initialLocale;
      document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';
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
      
      // Update HTML attributes immediately
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

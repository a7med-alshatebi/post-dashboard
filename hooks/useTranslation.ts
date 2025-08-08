'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function useLocale() {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'
  
  return locale
}

export function useTranslation(namespace: string = 'common') {
  const locale = useLocale()
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setLoading(true)
        // Dynamic import of translations
        const translationsModule = await import(`../locales/${locale}/${namespace}.json`)
        setTranslations(translationsModule.default || translationsModule)
      } catch (error) {
        console.error(`Failed to load translations for ${locale}/${namespace}:`, error)
        // Fallback to English if translation fails
        try {
          const fallbackModule = await import(`../locales/en/${namespace}.json`)
          setTranslations(fallbackModule.default || fallbackModule)
        } catch (fallbackError) {
          console.error('Failed to load fallback translations:', fallbackError)
          setTranslations({})
        }
      } finally {
        setLoading(false)
      }
    }

    loadTranslations()
  }, [locale, namespace])

  const t = (key: string, variables?: Record<string, string | number>) => {
    let translation = translations[key] || key
    
    // Simple variable interpolation
    if (variables) {
      Object.entries(variables).forEach(([varKey, varValue]) => {
        translation = translation.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue))
      })
    }
    
    return translation
  }

  return { t, loading, locale }
}

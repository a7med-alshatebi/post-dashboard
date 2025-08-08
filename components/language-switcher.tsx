'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Get current locale from URL
  const currentLocale = pathname.split('/')[1] || 'en'
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  const switchLanguage = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/'
    
    // Add new locale to pathname
    const newPathname = newLocale === 'en' ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`
    
    router.push(newPathname)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="mr-2">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <svg className="w-4 h-4 ml-1 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`${
                  currentLocale === language.code
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-700 dark:text-gray-200'
                } group flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200`}
                role="menuitem"
                onClick={() => switchLanguage(language.code)}
              >
                <span className="mr-3">{language.flag}</span>
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

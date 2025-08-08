import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ar']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Try to get locale from accept-language header
    const acceptLanguage = request.headers.get('accept-language') || ''
    let locale = defaultLocale
    
    // Simple language detection
    if (acceptLanguage.includes('ar')) {
      locale = 'ar'
    }

    // Redirect to the locale version
    const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  // If we have a locale, just continue
  return NextResponse.next()
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

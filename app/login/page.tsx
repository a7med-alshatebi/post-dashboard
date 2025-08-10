'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle } = useAuth();
  const { t, isRTL } = useI18n();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      router.push('/'); // Redirect to dashboard after successful login
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : t('login.errors.signInFailed');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-2xl">📊</span>
          </div>
          <h2 className={`text-3xl font-bold text-gray-900 dark:text-white leading-tight text-center mx-auto ${isRTL ? 'font-arabic' : ''}`}> 
            {t('login.title')}
          </h2>
          <p className={`mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-center mx-auto ${isRTL ? 'font-arabic' : ''}`}> 
            {t('login.subtitle')}
          </p>
        </div>

        {/* Login Card */}
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 ${isRTL ? 'font-arabic' : ''}`}>
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <svg className={`w-5 h-5 text-red-600 dark:text-red-400 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className={`text-sm text-red-600 dark:text-red-400 ${isRTL ? 'font-arabic' : ''}`}>{error}</p>
                </div>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`w-full flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}
            >
              {loading ? (
                <>
                  <div className={`animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600 ${isRTL ? 'ml-3' : 'mr-3'}`}></div>
                  {t('login.signingIn')}
                </>
              ) : (
                <>
                  <svg className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {t('login.signInWithGoogle')}
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
                  {t('login.orContinue')}
                </span>
              </div>
            </div>

            {/* Guest Access */}
            <Link
              href="/"
              className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}
            >
              <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('login.continueAsGuest')}
            </Link>

            {/* Features List */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className={`text-sm font-medium text-gray-900 dark:text-white mb-4 ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                {t('login.features.title')}
              </h3>
              <ul className={`w-full space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 ${isRTL ? 'font-arabic text-right' : 'text-left'}`}>
                <li className={`flex ${isRTL ? 'flex-row-reverse justify-end items-end' : 'justify-start items-start'} items-center`}>
                  <svg className={`w-4 h-4 text-green-500 flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('login.features.managePosts')}</span>
                </li>
                <li className={`flex ${isRTL ? 'flex-row-reverse justify-end items-end' : 'justify-start items-start'} items-center`}>
                  <svg className={`w-4 h-4 text-green-500 flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('login.features.viewAnalytics')}</span>
                </li>
                <li className={`flex ${isRTL ? 'flex-row-reverse justify-end items-end' : 'justify-start items-start'} items-center`}>
                  <svg className={`w-4 h-4 text-green-500 flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('login.features.customizeSettings')}</span>
                </li>
                <li className={`flex ${isRTL ? 'flex-row-reverse justify-end items-end' : 'justify-start items-start'} items-center`}>
                  <svg className={`w-4 h-4 text-green-500 flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('login.features.exportData')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            {t('login.footer.agreeTo')}{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('login.footer.termsOfService')}
            </a>{' '}
            {t('login.footer.and')}{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('login.footer.privacyPolicy')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

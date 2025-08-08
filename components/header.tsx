'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from './language-switcher';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  stats?: {
    posts?: number;
    filteredPosts?: number;
    users?: number;
    postId?: number;
    comments?: number;
    author?: string;
    email?: string;
    website?: string;
  };
}

export function Header({ title, subtitle, showStats = false, stats }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { t, locale } = useTranslation('common');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  
  const navigation = [
    { name: t('siteName'), href: `/${locale}`, icon: '🏠', key: 'dashboard' },
    { name: 'Posts', href: `/${locale}/posts`, icon: '📝', key: 'posts' },
    { name: 'Users', href: `/${locale}/users`, icon: '👥', key: 'users' },
    { name: 'Analytics', href: `/${locale}/analytics`, icon: '📊', key: 'analytics' },
    { name: t('settings'), href: `/${locale}/settings`, icon: '⚙️', key: 'settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showUserMenu]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target) &&
          mobileButtonRef.current && !mobileButtonRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMobileMenuOpen]);

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Navigation Bar */}
        <nav className="py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-200">
                <span className="text-lg sm:text-xl">📊</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white hidden sm:block">{t('siteName')}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    pathname === item.href
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* User Menu (Desktop) */}
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors duration-200"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm font-medium hidden lg:block">
                        {user.displayName?.split(' ')[0] || 'User'}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.displayName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          {t('logout')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center">
                  <Link
                    href={`/${locale}/login`}
                    className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors duration-200 text-sm font-medium"
                  >
                    {t('login')}
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                ref={mobileButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Button clicked, current state:', isMobileMenuOpen);
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="md:hidden p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors duration-200 relative z-50 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
                type="button"
              >
                <svg
                  className="w-5 h-5 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div 
              ref={mobileMenuRef} 
              className="md:hidden mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 relative z-30"
            >
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 items-center gap-3 ${
                      pathname === item.href
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile User Menu */}
                <div className="pt-2 mt-2 border-t border-white/20">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-4 py-2 text-white/80">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="w-6 h-6 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.displayName}
                          </p>
                          <p className="text-xs text-white/60">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {t('logout')}
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={`/${locale}/login`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('login')}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Header Content */}
        <div className="py-6 sm:py-8 lg:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 tracking-tight leading-tight">
              {title || t('siteName')}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto px-2">
                {subtitle}
              </p>
            )}
          </div>
          
          {showStats && stats && (
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-4 sm:mt-6">
              {stats.posts !== undefined && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  📊 {stats.posts} Posts
                </div>
              )}
              {stats.filteredPosts !== undefined && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  🔍 {stats.filteredPosts} Filtered
                </div>
              )}
              {stats.users !== undefined && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  👥 {stats.users} {typeof stats.users === 'number' ? 'Authors' : ''}
                </div>
              )}
              {stats.postId !== undefined && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  🆔 Post #{stats.postId}
                </div>
              )}
              {stats.comments !== undefined && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  💬 {stats.comments} Comments
                </div>
              )}
              {stats.author && typeof stats.author === 'string' && stats.author !== 'Loading...' && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  ✍️ {stats.author}
                </div>
              )}
              {stats.email && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  📧 {stats.email}
                </div>
              )}
              {stats.website && stats.website !== 'N/A' && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  🌐 {stats.website}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

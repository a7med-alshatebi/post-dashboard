'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  stats?: {
    posts: number;
    filteredPosts?: number;
    users: number;
  };
}

export function Header({ title = 'Dashboard', subtitle, showStats = false, stats }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠' },
    { name: 'Posts', href: '/posts', icon: '📝' },
    { name: 'Users', href: '/users', icon: '👥' },
    { name: 'Analytics', href: '/analytics', icon: '📊' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Navigation Bar */}
        <nav className="py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-200">
                <span className="text-lg sm:text-xl">📊</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white hidden sm:block">Post Dashboard</span>
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

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
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
              </div>
            </div>
          )}
        </nav>

        {/* Header Content */}
        <div className="py-6 sm:py-8 lg:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto px-2">
                {subtitle}
              </p>
            )}
          </div>
          
          {showStats && stats && (
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-4 sm:mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                📊 {stats.posts} Posts
              </div>
              {stats.filteredPosts !== undefined && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  🔍 {stats.filteredPosts} Filtered
                </div>
              )}
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                👥 {stats.users} Authors
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

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

export function Header({ 
  title = "Post Dashboard", 
  subtitle = "Manage and explore posts from JSONPlaceholder API with modern interface",
  showStats = false,
  stats
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Posts', href: '/posts', icon: '📝' },
    { name: 'Users', href: '/users', icon: '👥' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
  ];

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Navigation Bar */}
      <nav className="relative border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">📋</span>
                </div>
                <span className="text-white font-bold text-lg hidden sm:block group-hover:text-blue-100 transition-colors">
                  PostDash
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2
                      ${isActive 
                        ? 'bg-white/20 text-white backdrop-blur-sm border border-white/30 shadow-lg' 
                        : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent'
                      }
                    `}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right side - Theme Toggle & Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1.5 border border-white/20">
                <ThemeToggle />
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                <svg 
                  className={`w-5 h-5 text-white transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
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
            <div className="md:hidden border-t border-white/20 py-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3
                        ${isActive 
                          ? 'bg-white/20 text-white backdrop-blur-sm border border-white/30' 
                          : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent'
                        }
                      `}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header Content */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Title Section */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto px-2">
              {subtitle}
            </p>
          </div>
          
          {/* Stats Section */}
          {showStats && stats && (
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                📊 {stats.filteredPosts !== undefined ? `${stats.filteredPosts}/${stats.posts}` : stats.posts} Posts
              </div>
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

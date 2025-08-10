'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`}
      style={{
        animation: 'shimmer 2s ease-in-out infinite',
      }}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          {/* Author skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
        {/* Actions skeleton */}
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      
      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    </div>
  );
}

export function PostActionSkeleton() {
  return (
    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  );
}

export function ButtonSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}></div>
  );
}

import { useI18n } from '../contexts/I18nContext';

export function DashboardSkeleton() {
  const { isRTL } = useI18n();
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header skeleton */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Navigation Bar skeleton */}
          <nav className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded w-32 animate-pulse hidden sm:block"></div>
              </div>
              <div className="hidden md:flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-white/20 rounded-xl w-24 animate-pulse"></div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 bg-white/20 rounded-xl w-20 animate-pulse hidden md:block"></div>
                <div className="w-8 h-8 bg-white/20 rounded-xl animate-pulse md:hidden"></div>
              </div>
            </div>
          </nav>
          
          {/* Header Content skeleton */}
          <div className="py-6 sm:py-8 lg:py-12 text-center">
            <div className="h-8 sm:h-10 lg:h-12 bg-white/20 rounded mx-auto w-64 sm:w-80 lg:w-96 mb-4 animate-pulse"></div>
            <div className="h-4 sm:h-6 bg-white/20 rounded mx-auto w-96 sm:w-[500px] animate-pulse"></div>
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-4 sm:mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 sm:h-8 bg-white/20 rounded-full w-20 sm:w-24 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        
        {/* Filters skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Posts grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset">
      {/* Header skeleton */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Navigation Bar skeleton */}
          <nav className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl animate-pulse"></div>
                <div className="h-6 bg-white/20 rounded w-32 animate-pulse hidden sm:block"></div>
              </div>
              <div className="hidden md:flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 bg-white/20 rounded-xl w-24 animate-pulse"></div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 bg-white/20 rounded-xl w-20 animate-pulse hidden md:block"></div>
                <div className="w-8 h-8 bg-white/20 rounded-xl animate-pulse md:hidden"></div>
              </div>
            </div>
          </nav>
          
          {/* Header Content skeleton */}
          <div className="py-6 sm:py-8 lg:py-12 text-center">
            <div className="h-8 sm:h-10 lg:h-12 bg-white/20 rounded mx-auto w-64 sm:w-80 lg:w-96 mb-4 animate-pulse"></div>
            <div className="h-4 sm:h-6 bg-white/20 rounded mx-auto w-96 sm:w-[500px] animate-pulse"></div>
            <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-4 sm:mt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 sm:h-8 bg-white/20 rounded-full w-20 sm:w-24 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb skeleton */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 -mt-3 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10 space-y-6">
        
        {/* Overview Stats Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
                <div className="text-right">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Analytics Content skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          {/* Header section skeleton */}
          <div className="px-6 sm:px-8 lg:px-12 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="text-center animate-pulse">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-3xl mx-auto mb-6"></div>
              <div className="h-8 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-80 mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mx-auto w-96 sm:w-[500px]"></div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-12">
            {/* Detailed Analytics Sections skeleton */}
            <div className="mt-12 space-y-8">
              
              {/* Post View Analytics skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <div className="h-6 bg-white/20 rounded w-48 animate-pulse"></div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-3"></div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-48 mb-1"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Tracking skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                  <div className="h-6 bg-white/20 rounded w-40 animate-pulse"></div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="text-center animate-pulse">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto mb-1"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Insights skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                  <div className="h-6 bg-white/20 rounded w-36 animate-pulse"></div>
                </div>
                <div className="p-6">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-36 mb-4"></div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                              <div className="flex items-center space-x-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Journey & Behavior Analytics skeleton */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* User Journey Mapping skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <div className="h-6 bg-white/20 rounded w-40 animate-pulse"></div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4 animate-pulse">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            </div>
                          </div>
                          {i < 4 && <div className="ml-4 w-0.5 h-6 bg-gray-200 dark:bg-gray-700 mt-2"></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Click-through Analysis & Session Duration skeleton */}
                <div className="space-y-6">
                  
                  {/* Click-through Analysis skeleton */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
                      <div className="h-5 bg-white/20 rounded w-36 animate-pulse"></div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3 animate-pulse">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex justify-between items-center">
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Session Duration skeleton */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
                      <div className="h-5 bg-white/20 rounded w-32 animate-pulse"></div>
                    </div>
                    <div className="p-4">
                      <div className="text-center animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-1"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mx-auto mb-3"></div>
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between">
                              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-8"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Advanced Features skeleton */}
              <div className="grid lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
                      <div className="h-5 bg-white/20 rounded w-32 animate-pulse"></div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4 animate-pulse">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl mx-auto mb-3"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <div className="space-y-1">
                            {[1, 2, 3, 4].map((j) => (
                              <div key={j} className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Navigation Buttons skeleton */}
        <div className="text-center">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-40 mx-auto animate-pulse"></div>
        </div>
      </div>

      {/* Back to Top Button skeleton */}
      <div className="fixed bottom-6 right-6">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

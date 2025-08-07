'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Header } from '../../components/header';
import { BackToTop } from '../../components/back-to-top';
import { AnalyticsSkeleton } from '../../components/analytics-skeleton';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for analytics data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AnalyticsSkeleton />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset">
      <Header 
        title="Analytics Dashboard"
        subtitle="Insights and metrics for your content and user engagement"
        showStats={true}
        stats={{
          posts: 100,
          users: 10,
          comments: 542
        }}
      />

      {/* Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 -mt-3 relative z-10">
        <nav className="flex items-center space-x-2 text-sm">
          <Link 
            href="/" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Dashboard
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-500 dark:text-gray-400">Analytics</span>
        </nav>
      </div>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10 space-y-6">
        
        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2,543</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Page Views</p>
              </div>
              <div className="text-right">
                <span className="text-green-500 text-sm font-medium">+12.5%</span>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1,247</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active Users</p>
              </div>
              <div className="text-right">
                <span className="text-green-500 text-sm font-medium">+8.3%</span>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">87.2%</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Engagement Rate</p>
              </div>
              <div className="text-right">
                <span className="text-green-500 text-sm font-medium">+2.1%</span>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Analytics Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          <div className="px-6 sm:px-8 lg:px-12 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Analytics Dashboard
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Comprehensive analytics and reporting tools to understand your content performance, 
                user behavior, and platform engagement metrics.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-12">
            {/* Detailed Analytics Sections */}
            <div className="mt-12 space-y-8">
              
              {/* Post View Analytics */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Post View Analytics
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">View Metrics</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-700 dark:text-gray-300">Total Post Views</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">45,328</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-700 dark:text-gray-300">Unique Views</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">38,291</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-700 dark:text-gray-300">Average Time on Post</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">2m 34s</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Top Performing Posts</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">Getting Started with React</p>
                          <p className="text-green-600 dark:text-green-400 text-xs">12,457 views</p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">Advanced JavaScript Concepts</p>
                          <p className="text-blue-600 dark:text-blue-400 text-xs">9,823 views</p>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-700">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">CSS Grid Layout Guide</p>
                          <p className="text-purple-600 dark:text-purple-400 text-xs">8,394 views</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Tracking */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Engagement Tracking
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white">1,247</h4>
                      <p className="text-gray-600 dark:text-gray-300">Total Likes</p>
                      <p className="text-green-500 text-sm">+15.3% this week</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white">832</h4>
                      <p className="text-gray-600 dark:text-gray-300">Comments</p>
                      <p className="text-green-500 text-sm">+8.7% this week</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white">456</h4>
                      <p className="text-gray-600 dark:text-gray-300">Shares</p>
                      <p className="text-green-500 text-sm">+12.1% this week</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Performance Insights
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Performance Indicators</h4>
                      <div className="space-y-4">
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 dark:text-gray-300">Bounce Rate</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">23.4%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '76.6%'}}></div>
                          </div>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 dark:text-gray-300">Page Load Speed</span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">1.2s</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                          </div>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 dark:text-gray-300">Conversion Rate</span>
                            <span className="text-purple-600 dark:text-purple-400 font-medium">4.7%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '47%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trends</h4>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">This Month</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-500 text-sm">↗ +12.5%</span>
                              <span className="text-lg font-bold text-gray-900 dark:text-white">94.2%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Last Month</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-green-500 text-sm">↗ +8.3%</span>
                              <span className="text-lg font-bold text-gray-900 dark:text-white">83.7%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">3 Months Ago</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-red-500 text-sm">↘ -2.1%</span>
                              <span className="text-lg font-bold text-gray-900 dark:text-white">77.3%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Journey & Behavior Analytics */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* User Journey Mapping */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      User Journey Mapping
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Landing Page</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">45% entry point</p>
                        </div>
                      </div>
                      <div className="ml-4 border-l-2 border-gray-300 dark:border-gray-600 h-6"></div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Post Browse</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">78% continue here</p>
                        </div>
                      </div>
                      <div className="ml-4 border-l-2 border-gray-300 dark:border-gray-600 h-6"></div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">Post Detail</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">62% engage here</p>
                        </div>
                      </div>
                      <div className="ml-4 border-l-2 border-gray-300 dark:border-gray-600 h-6"></div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">User Profile</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">34% visit profile</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Click-through Analysis & Session Duration */}
                <div className="space-y-6">
                  
                  {/* Click-through Analysis */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
                      <h3 className="text-lg font-bold text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        Click-through Analysis
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">CTA Buttons</span>
                          <span className="text-pink-600 dark:text-pink-400 font-medium">8.4%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Navigation Links</span>
                          <span className="text-pink-600 dark:text-pink-400 font-medium">12.7%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 dark:text-gray-300">External Links</span>
                          <span className="text-pink-600 dark:text-pink-400 font-medium">3.2%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Session Duration */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
                      <h3 className="text-lg font-bold text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Session Duration
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">4m 32s</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">Average Session</div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">&lt; 1 min</span>
                            <span className="text-gray-600 dark:text-gray-400">23%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">1-3 min</span>
                            <span className="text-gray-600 dark:text-gray-400">34%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">3+ min</span>
                            <span className="text-gray-600 dark:text-gray-400">43%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Advanced Features */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Custom Dashboards */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                      </svg>
                      Custom Dashboards
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Create personalized dashboards with drag-and-drop widgets</p>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <div>• Custom widget layouts</div>
                          <div>• Real-time data updates</div>
                          <div>• Multiple dashboard views</div>
                          <div>• Shareable configurations</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Export */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Data Export
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Export analytics data in multiple formats</p>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <div>• CSV spreadsheet format</div>
                          <div>• PDF reports with charts</div>
                          <div>• JSON data exports</div>
                          <div>• Custom date ranges</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scheduled Reports */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Scheduled Reports
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Automated reports delivered to your inbox</p>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <div>• Daily, weekly, monthly</div>
                          <div>• Email delivery options</div>
                          <div>• Custom report templates</div>
                          <div>• Multiple recipients</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

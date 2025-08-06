'use client';

import { Header } from '../../components/header';
import { BackToTop } from '../../components/back-to-top';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header 
        title="Analytics Dashboard"
        subtitle="Insights and metrics for your content and user engagement"
      />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">📈</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Analytics Dashboard
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive analytics and reporting tools to understand your content performance, 
              user behavior, and platform engagement metrics.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Content Metrics</h3>
                <p className="text-gray-600 dark:text-gray-300">Track post views, engagement, and performance</p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-xl p-6 border border-pink-200 dark:border-pink-700">
                <div className="text-3xl mb-4">👁️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">User Behavior</h3>
                <p className="text-gray-600 dark:text-gray-300">Analyze user interactions and journey patterns</p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
                <div className="text-3xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Custom Reports</h3>
                <p className="text-gray-600 dark:text-gray-300">Generate detailed reports and export data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

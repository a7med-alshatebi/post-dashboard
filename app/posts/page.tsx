'use client';

import { Header } from '../../components/header';
import { BackToTop } from '../../components/back-to-top';

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header 
        title="Posts Management"
        subtitle="Create, edit, and manage all your posts in one place"
      />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Posts Management
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              This page will contain advanced post management features including creating new posts, 
              editing existing ones, bulk operations, and detailed post analytics.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <div className="text-3xl mb-4">✍️</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create Posts</h3>
                <p className="text-gray-600 dark:text-gray-300">Write and publish new posts with rich text editor</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border border-green-200 dark:border-green-700">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300">Track post performance and engagement metrics</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Bulk Actions</h3>
                <p className="text-gray-600 dark:text-gray-300">Manage multiple posts efficiently with bulk operations</p>
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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { BackToTop } from '../../components/back-to-top';
import AddPostForm from '../../components/add-pst-form';
import { useI18n } from '../../contexts/I18nContext';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function AddPostPage() {
  const { t, isRTL } = useI18n();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // Load existing posts (this would typically come from a shared state or API)
  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.slice(0, 20)); // Show first 20 posts for demo
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new post optimistically
  const addPost = (newPost: Omit<Post, 'id'>) => {
    const optimisticPost: Post = {
      ...newPost,
      id: Math.max(...posts.map(p => p.id), 100) + 1, // Generate optimistic ID
    };
    
    // Add to beginning of list for visibility
    setPosts(prev => [optimisticPost, ...prev]);
    
    return optimisticPost;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Header 
        title={t('addPost.title')}
        subtitle={t('addPost.subtitle')}
        showStats={true}
        stats={{
          posts: posts.length,
          users: 10 // We know there are 10 users in JSONPlaceholder
        }}
      />

      {/* Navigation Breadcrumb */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-2 -mt-3 relative z-10">
        <nav className={`flex items-center space-x-2 text-sm ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <Link 
            href="/" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            {t('navigation.dashboard')}
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l7-7-7-7" : "M9 5l7 7-7 7"} />
          </svg>
          <Link 
            href="/posts" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            {t('navigation.posts')}
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l7-7-7-7" : "M9 5l7 7-7 7"} />
          </svg>
          <span className="text-gray-500 dark:text-gray-400">{t('addPost.title')}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Add Post Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
              <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse text-right w-full justify-end' : ''}`}> 
                {isRTL ? (
                  <>
                    {t('addPost.createNewPost')}
                    <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></span>
                    {t('addPost.createNewPost')}
                  </>
                )}
              </h2>
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8">
              <AddPostForm onAddPost={addPost} onLoadPosts={loadPosts} />
            </div>
          </div>

          {/* Recent Posts Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                  {t('addPost.recentPostsTitle')} ({posts.length})
                </h2>
                <button
                  onClick={loadPosts}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className={`animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                      {t('addPost.loadingText')}
                    </>
                  ) : (
                    <>
                      <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {t('addPost.loadPostsButton')}
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8 max-h-[600px] overflow-y-auto">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('addPost.noPostsYet')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('addPost.noPostsDesc')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post, index) => (
                    <Link 
                      key={post.id}
                      href={`/post/${post.id}`}
                      className={`block p-4 border rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
                        index === 0 && post.id > 100 
                          ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20 hover:border-green-400 dark:hover:border-green-500' 
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                            index === 0 && post.id > 100
                              ? 'bg-gradient-to-br from-green-500 to-blue-500'
                              : 'bg-gradient-to-br from-blue-500 to-purple-500'
                          }`}>
                            #{post.id}
                          </div>
                          {index === 0 && post.id > 100 && (
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">
                              {t('addPost.newLabel')}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                          {t('addPost.user')} {post.userId}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                        {post.body}
                      </p>
                      
                      <div className={`flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {t('addPost.clickToView')}
                        </span>
                        <span className={`text-blue-500 dark:text-blue-400 font-medium ${isRTL ? 'rotate-180' : ''}`}>
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="text-center mt-6">
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link
              href="/posts"
              className={`inline-flex items-center justify-center text-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="w-full text-center">{t('addPost.backToPosts')}</span>
            </Link>
            <Link
              href="/"
              className={`inline-flex items-center justify-center text-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="w-full text-center">{t('addPost.backToDashboard')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

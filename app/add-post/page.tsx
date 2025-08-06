'use client';

import { useState } from 'react';
import { Header } from '../../components/header';
import { BackToTop } from '../../components/back-to-top';
import { AddPostForm } from '../../components/add-post-form';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function AddPostPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset">
      {/* Header */}
      <Header 
        title="Add New Post"
        subtitle="Create and publish new posts to the JSONPlaceholder API"
        showStats={true}
        stats={{
          posts: posts.length,
          users: 10 // We know there are 10 users in JSONPlaceholder
        }}
      />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Add Post Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></span>
                Create New Post
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
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                  <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                  Recent Posts ({posts.length})
                </h2>
                <button
                  onClick={loadPosts}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Load Posts
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
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Posts Yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create your first post or load existing posts to see them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post, index) => (
                    <div 
                      key={post.id} 
                      className={`p-4 border rounded-xl transition-all duration-300 hover:shadow-md ${
                        index === 0 && post.id > 100 
                          ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20' 
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                            index === 0 && post.id > 100
                              ? 'bg-gradient-to-br from-green-500 to-blue-500'
                              : 'bg-gradient-to-br from-blue-500 to-purple-500'
                          }`}>
                            #{post.id}
                          </div>
                          {index === 0 && post.id > 100 && (
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">
                              ✨ New
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                          User {post.userId}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 capitalize line-clamp-2">
                        {post.title}
                      </h4>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {post.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '../components/theme-toggle';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default function PostDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPostsAndUsers();
  }, []);

  const fetchPostsAndUsers = async () => {
    try {
      setLoading(true);
      const [postsResponse, usersResponse] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/users')
      ]);

      if (!postsResponse.ok || !usersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();

      setPosts(postsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    try {
      setDeletingIds(prev => new Set(prev).add(id));
      
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Remove the post from the local state
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `User ${userId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 safe-area-inset">
        <div className="text-center p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4 sm:mb-6"></div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Loading Posts</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Fetching data from JSONPlaceholder API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset">
      {/* Header with gradient overlay */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 tracking-tight leading-tight">
                Post Dashboard
              </h1>
              <p className="text-sm sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto px-2">
                Manage and explore posts from JSONPlaceholder API with modern interface
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-start">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  📊 {posts.length} Posts
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-white text-xs sm:text-sm font-medium">
                  👥 {users.length} Authors
                </div>
              </div>
              
              <div className="flex justify-center sm:justify-end">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-white/20">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                <span className="truncate">All Posts ({posts.length})</span>
              </h2>
              <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Live Data
              </div>
            </div>
          </div>

          {/* Mobile view */}
          <div className="block lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                className="group bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                      #{post.id}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full whitespace-nowrap">
                        Post ID: {post.id}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deletePost(post.id)}
                    disabled={deletingIds.has(post.id)}
                    className="min-touch-target group-hover:scale-110 transition-transform inline-flex items-center px-2.5 sm:px-3 py-1.5 sm:py-2 border border-transparent text-xs font-medium rounded-lg sm:rounded-xl text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 shadow-sm flex-shrink-0"
                  >
                    {deletingIds.has(post.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-red-300 border-t-red-600 mr-1.5"></div>
                        <span className="hidden xs:inline">Deleting...</span>
                        <span className="xs:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden xs:inline">Delete</span>
                        <span className="xs:hidden sr-only">Delete</span>
                      </>
                    )}
                  </button>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 sm:mb-3 capitalize leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {getUserName(post.userId).charAt(0)}
                  </div>
                  <span className="truncate">Author: <span className="font-medium">{getUserName(post.userId)}</span></span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden lg:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                  <tr>
                    <th className="px-4 lg:px-8 py-3 lg:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        ID
                      </div>
                    </th>
                    <th className="px-4 lg:px-8 py-3 lg:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Title
                      </div>
                    </th>
                    <th className="px-4 lg:px-8 py-3 lg:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Author
                      </div>
                    </th>
                    <th className="px-4 lg:px-8 py-3 lg:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Actions
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                  {posts.map((post, index) => (
                    <tr 
                      key={post.id} 
                      className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 hover:shadow-sm"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform">
                            #{post.id}
                          </div>
                          <span className="text-xs lg:text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                            {post.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-8 py-4 lg:py-6 max-w-md">
                        <div className="group-hover:translate-x-1 transition-transform">
                          <h3 className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white capitalize leading-relaxed group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={post.title}>
                            {post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {post.title.length} characters
                          </p>
                        </div>
                      </td>
                      <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 lg:gap-3 group-hover:translate-x-1 transition-transform">
                          <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {getUserName(post.userId).charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
                              {getUserName(post.userId)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              User ID: {post.userId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                        <button
                          onClick={() => deletePost(post.id)}
                          disabled={deletingIds.has(post.id)}
                          className="min-touch-target group-hover:scale-110 transition-all duration-200 inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 border border-transparent text-xs lg:text-sm font-medium rounded-xl text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 shadow-sm hover:shadow-md"
                        >
                          {deletingIds.has(post.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-2 border-red-300 border-t-red-600 mr-1.5 lg:mr-2"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {posts.length === 0 && !loading && (
            <div className="text-center py-12 sm:py-20 px-4 sm:px-8">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">No Posts Available</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-4 sm:mb-6">
                  There are currently no posts to display. Posts will appear here once they are loaded from the API.
                </p>
                <button 
                  onClick={fetchPostsAndUsers}
                  className="min-touch-target inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Posts
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

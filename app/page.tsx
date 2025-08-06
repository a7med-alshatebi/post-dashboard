'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../components/header';
import { BackToTop } from '../components/back-to-top';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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

  // Filter posts based on search term and selected user
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = selectedUserId === null || post.userId === selectedUserId;
    return matchesSearch && matchesUser;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUserId(null);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm.length > 0 || selectedUserId !== null;

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
      {/* Header */}
      <Header 
        title="Post Dashboard"
        subtitle="Manage and explore posts from JSONPlaceholder API with modern interface"
        showStats={true}
        stats={{
          posts: posts.length,
          filteredPosts: hasActiveFilters ? filteredPosts.length : undefined,
          users: users.length
        }}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                  <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                  <span className="truncate">All Posts ({filteredPosts.length})</span>
                </h2>
                <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live Data
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search posts by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <svg className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* User Filter Dropdown */}
                <div className="relative min-w-0 sm:min-w-[200px]">
                  <select
                    value={selectedUserId || ''}
                    onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
                    className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm appearance-none cursor-pointer"
                  >
                    <option value="">All Authors</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} (ID: {user.id})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="min-touch-target inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Filter Summary */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {searchTerm && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-blue-800 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                      Search: &quot;{searchTerm}&quot;
                    </span>
                  )}
                  {selectedUserId && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-purple-800 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                      Author: {getUserName(selectedUserId)}
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    {filteredPosts.length} of {posts.length} posts
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile view */}
          <div className="block lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
            {filteredPosts.map((post, index) => (
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
                <Link href={`/post/${post.id}`}>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 sm:mb-3 capitalize leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer">
                    {searchTerm ? (
                      <span dangerouslySetInnerHTML={{
                        __html: post.title.replace(
                          new RegExp(`(${searchTerm})`, 'gi'),
                          '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
                        )
                      }} />
                    ) : (
                      post.title
                    )}
                  </h3>
                </Link>
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
                  {filteredPosts.map((post, index) => (
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
                          <Link href={`/post/${post.id}`}>
                            <h3 className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white capitalize leading-relaxed hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" title={post.title}>
                              {searchTerm ? (
                                <span dangerouslySetInnerHTML={{
                                  __html: (post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title).replace(
                                    new RegExp(`(${searchTerm})`, 'gi'),
                                    '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
                                  )
                                }} />
                              ) : (
                                post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title
                              )}
                            </h3>
                          </Link>
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

          {/* Empty States */}
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

          {/* No Filtered Results */}
          {posts.length > 0 && filteredPosts.length === 0 && !loading && (
            <div className="text-center py-12 sm:py-20 px-4 sm:px-8">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-200 to-orange-300 dark:from-yellow-600 dark:to-orange-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-600 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">No Posts Found</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-4 sm:mb-6">
                  No posts match your current filters. Try adjusting your search criteria or clearing the filters.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={clearFilters}
                    className="min-touch-target inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
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
            </div>
          )}
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

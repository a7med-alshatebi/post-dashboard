'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { BackToTop } from '../../components/back-to-top';
import { useI18n } from '../../contexts/I18nContext';

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

export default function PostsPage() {
  const { t, isRTL } = useI18n();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'id' | 'title' | 'author'>('id');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

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

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.body.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUser = selectedUserId === null || post.userId === selectedUserId;
      return matchesSearch && matchesUser;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return getUserName(a.userId).localeCompare(getUserName(b.userId));
        default:
          return a.id - b.id;
      }
    });

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredAndSortedPosts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedUserId, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUserId(null);
    setSortBy('id');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm.length > 0 || selectedUserId !== null || sortBy !== 'id';

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <Header 
          title={t('posts.title')}
          subtitle={t('posts.subtitle')}
          showStats={true}
          stats={{
            posts: 0,
            users: 0
          }}
        />

        {/* Main Content Skeleton */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {/* Header Controls Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
                  <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl shimmer"></div>
                </div>

                {/* Filter Controls Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="lg:col-span-2 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl shimmer"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl shimmer"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl shimmer"></div>
                </div>
              </div>
            </div>

            {/* Posts Grid Skeleton matching actual post cards */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <div 
                    key={i} 
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6"
                  >
                    {/* Post Header Skeleton */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg shimmer"></div>
                        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-600 rounded-full shimmer"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg shimmer"></div>
                    </div>

                    {/* Post Title Skeleton */}
                    <div className="space-y-2 mb-3">
                      <div className="h-7 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                      <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                    </div>

                    {/* Post Body Skeleton */}
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                      <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                    </div>

                    {/* Post Footer Skeleton */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full shimmer"></div>
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                      </div>
                      <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="mt-6 sm:mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
                <div className="hidden sm:flex sm:items-center sm:justify-between">
                  <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                  <div className="flex gap-1">
                    {Array.from({ length: 7 }, (_, i) => (
                      <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Pagination Skeleton */}
                <div className="sm:hidden">
                  <div className="text-center mb-4">
                    <div className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded shimmer mb-2"></div>
                    <div className="h-3 w-32 mx-auto bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
                    <div className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Header 
        title={t('posts.title')}
        subtitle={t('posts.subtitle')}
        showStats={true}
        stats={{
          posts: posts.length,
          filteredPosts: hasActiveFilters ? filteredAndSortedPosts.length : undefined,
          users: users.length
        }}
      />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          
          {/* Posts Header with Controls */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="flex flex-col gap-4">
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                  <span className="truncate">{t('posts.allPosts')} ({filteredAndSortedPosts.length})</span>
                  {totalPages > 1 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t('common.page')} {currentPage} {t('common.of')} {totalPages}
                    </span>
                  )}
                </h2>
                
                {/* New Post Button */}
                <Link
                  href="/add-post"
                  className={`min-touch-target inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">{t('posts.createNew')}</span>
                  <span className="sm:hidden">{t('posts.newPost')}</span>
                </Link>
              </div>

              {/* Filter and Sort Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Bar */}
                <div className={`lg:col-span-2 relative ${isRTL ? 'direction-rtl' : ''}`}>
                  <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                    <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={t('posts.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`block w-full ${isRTL ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'} py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm`}
                  />
                </div>

                {/* User Filter */}
                <div className="relative">
                  <select
                    value={selectedUserId || ''}
                    onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
                    className={`block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm appearance-none cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value="">{t('posts.allAuthors')}</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'id' | 'title' | 'author')}
                    className={`block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm appearance-none cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value="id">{t('posts.sortById')}</option>
                    <option value="title">{t('posts.sortByTitle')}</option>
                    <option value="author">{t('posts.sortByAuthor')}</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex flex-wrap gap-2 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {searchTerm && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-blue-800 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                        {t('posts.search')}: &ldquo;{searchTerm}&rdquo;
                      </span>
                    )}
                    {selectedUserId && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-purple-800 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300">
                        {t('posts.author')}: {getUserName(selectedUserId)}
                      </span>
                    )}
                    {sortBy !== 'id' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                        {t('posts.sortedBy')}: {sortBy}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    {t('posts.clearFilters')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="p-4 sm:p-6 lg:p-8">
            {currentPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {currentPosts.map((post, index) => (
                    <div 
                      key={post.id}
                      className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            #{post.id}
                          </div>
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                            Post {post.id}
                          </span>
                        </div>
                        <button
                          onClick={() => deletePost(post.id)}
                          disabled={deletingIds.has(post.id)}
                          className="min-touch-target group-hover:scale-110 transition-transform inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                        >
                          {deletingIds.has(post.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-300 border-t-red-600"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Post Title */}
                      <Link href={`/post/${post.id}`}>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 capitalize leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer">
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

                      {/* Post Body */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                        {searchTerm ? (
                          <span dangerouslySetInnerHTML={{
                            __html: post.body.replace(
                              new RegExp(`(${searchTerm})`, 'gi'),
                              '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
                            )
                          }} />
                        ) : (
                          post.body
                        )}
                      </p>

                      {/* Post Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {getUserName(post.userId).charAt(0)}
                          </div>
                          <Link 
                            href={`/user/${post.userId}`}
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {getUserName(post.userId)}
                          </Link>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {post.body.length} chars
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-b-2xl sm:rounded-b-3xl -mx-4 sm:-mx-6 lg:-mx-8 px-3 sm:px-6 lg:px-8 pb-4 sm:pb-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      {/* Mobile pagination */}
                      <div className="flex flex-col gap-2 sm:hidden">
                        <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                          <p className={`text-xs text-gray-600 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('common.page')} <span className="font-medium">{currentPage}</span> {t('common.of')} <span className="font-medium">{totalPages}</span>
                          </p>
                          <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                            ({indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredAndSortedPosts.length)} {t('common.of')} {filteredAndSortedPosts.length})
                          </p>
                        </div>
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm min-h-[40px]"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          {/* Mobile page numbers - show max 3 pages for better mobile fit */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                              let pageNumber;
                              if (totalPages <= 3) {
                                pageNumber = i + 1;
                              } else if (currentPage <= 2) {
                                pageNumber = i + 1;
                              } else if (currentPage >= totalPages - 1) {
                                pageNumber = totalPages - 2 + i;
                              } else {
                                pageNumber = currentPage - 1 + i;
                              }
                              
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    pageNumber === currentPage
                                      ? 'bg-blue-500 text-white shadow-md'
                                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm min-h-[40px]"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Desktop pagination */}
                      <div className={`hidden sm:flex sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('posts.showing')}{' '}
                            <span className="font-medium">{indexOfFirstPost + 1}</span>
                            {' '}{t('common.to')}{' '}
                            <span className="font-medium">
                              {Math.min(indexOfLastPost, filteredAndSortedPosts.length)}
                            </span>
                            {' '}{t('common.of')}{' '}
                            <span className="font-medium">{filteredAndSortedPosts.length}</span>
                            {' '}{t('common.results')}
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            
                            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                              let pageNumber;
                              if (totalPages <= 7) {
                                pageNumber = i + 1;
                              } else if (currentPage <= 4) {
                                pageNumber = i + 1;
                              } else if (currentPage >= totalPages - 3) {
                                pageNumber = totalPages - 6 + i;
                              } else {
                                pageNumber = currentPage - 3 + i;
                              }
                              
                              return (
                                <button
                                  key={pageNumber}
                                  onClick={() => handlePageChange(pageNumber)}
                                  className={`relative inline-flex items-center px-3 md:px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                                    pageNumber === currentPage
                                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600'
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              );
                            })}

                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t('posts.noPostsFound')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {hasActiveFilters ? t('posts.noPostsMatchFilters') : t('posts.noPostsAvailable')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {hasActiveFilters && (
                    <button 
                      onClick={clearFilters}
                      className="min-touch-target inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      {t('posts.clearFilters')}
                    </button>
                  )}
                  <Link
                    href="/add-post"
                    className={`min-touch-target inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {t('posts.createFirst')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

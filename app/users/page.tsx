'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '../../components/header';
import { BackToTop } from '../../components/back-to-top';
import { useToast } from '../../components/toast';
import { useI18n } from '../../contexts/I18nContext';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function UsersPage() {
  const { t, isRTL } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);

  const { addToast } = useToast();

  const fetchUsersAndPosts = useCallback(async () => {
    try {
      setLoading(true);
      const [usersResponse, postsResponse] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/users'),
        fetch('https://jsonplaceholder.typicode.com/posts')
      ]);

      if (!usersResponse.ok || !postsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const usersData = await usersResponse.json();
      const postsData = await postsResponse.json();

      setUsers(usersData);
      setPosts(postsData);
      
      // Remove success toast to prevent spam during navigation/refreshes
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast({
        type: 'error',
        title: t('users.loadDataFailed'),
        message: t('users.checkConnection')
      });
    } finally {
      setLoading(false);
    }
  }, [addToast, t]);

  useEffect(() => {
    fetchUsersAndPosts();
  }, [fetchUsersAndPosts]);

  const getUserPostCount = (userId: number) => {
    return posts.filter(post => post.userId === userId).length;
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <Header 
          title={t('users.title')}
          subtitle={t('users.subtitle')}
          showStats={true}
          stats={{
            users: 0,
            posts: 0
          }}
        />
        
        {/* Main content skeleton */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
            
            {/* Search and Filter Controls Skeleton */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full shimmer"></div>
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                  </div>
                </div>

                {/* Search Bar Skeleton */}
                <div className="flex-1 relative max-w-md">
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-xl shimmer"></div>
                </div>
              </div>
            </div>

            {/* Users Grid Skeleton */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }, (_, i) => (
                  <div 
                    key={i}
                    className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600"
                  >
                    {/* User Avatar and Info Skeleton */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full shimmer flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded shimmer mb-2"></div>
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                      </div>
                    </div>

                    {/* User Stats Skeleton */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                        <div className="h-6 w-8 bg-gray-200 dark:bg-gray-600 rounded-full shimmer"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                    </div>

                    {/* User Location Skeleton */}
                    <div className="border-t border-gray-100 dark:border-gray-600 pt-3">
                      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                    </div>

                    {/* Hover indicator skeleton */}
                    <div className="mt-4">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="hidden sm:flex sm:items-center sm:justify-between">
                  <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                    ))}
                  </div>
                </div>
                
                {/* Mobile Pagination Skeleton */}
                <div className="flex justify-between sm:hidden">
                  <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-md shimmer"></div>
                  <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-md shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl dashboard-rtl' : 'ltr dashboard-ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Header 
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        showStats={true}
        stats={{
          users: users.length,
          posts: posts.length
        }}
      />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className={`bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm ${isRTL ? 'dashboard-card-rtl' : 'dashboard-card-ltr'}`}>
          
          {/* Search and Filter Controls */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="flex flex-col gap-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3 w-full ${isRTL ? 'flex-row-reverse justify-end text-right' : ''}`}>
                  <span className={`w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-green-500 to-teal-500 rounded-full ${isRTL ? 'order-2 ml-2' : 'order-1 mr-2'}`}></span>
                  <span className={`truncate w-full ${isRTL ? 'text-right' : ''}`}>{t('users.allUsers')} ({filteredUsers.length})</span>
                  {totalPages > 1 && (
                    <span className={`text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right w-full' : ''}`}>
                      {t('common.page')} {currentPage} {t('common.of')} {totalPages}
                    </span>
                  )}
                </h2>
                <div className={`hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  {t('users.liveData')}
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 relative max-w-md">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t('users.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`block w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Search Summary */}
              {searchTerm && (
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                    Search: &ldquo;{searchTerm}&rdquo;
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                    {filteredUsers.length} of {users.length} users
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Users Grid */}
          <div className="p-4 sm:p-6 lg:p-8">
            {currentUsers.length === 0 ? (
              <div className={`text-center py-12 ${isRTL ? 'font-arabic' : ''}`}>
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('users.noUsersFound')}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? t('users.noUsersMatchSearch') : t('users.noUsersAvailable')}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  >
                    {t('users.clearSearch')}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {currentUsers.map((user, index) => (
                  <Link
                    key={user.id}
                    href={`/user/${user.id}`}
                    className={`group bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:border-green-300 dark:hover:border-green-500 ${isRTL ? 'dashboard-usercard-rtl' : 'dashboard-usercard-ltr'}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse gap-4' : 'gap-4'}`}>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <div className={`space-y-3 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                      <div className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-gray-600 dark:text-gray-400">{t('users.posts')}</span>
                        <span className="font-medium text-gray-900 dark:text-white bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                          {getUserPostCount(user.id)}
                        </span>
                      </div>
                      <div className={`text-sm text-gray-600 dark:text-gray-400 truncate ${isRTL ? 'text-right' : ''}`}>
                        📧 {user.email}
                      </div>
                      <div className={`text-sm text-gray-600 dark:text-gray-400 truncate ${isRTL ? 'text-right' : ''}`}>
                        🏢 {user.company.name}
                      </div>
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-600 pt-3 ${isRTL ? 'text-right font-arabic' : ''}`}>
                      📍 {user.address.city}, {user.address.zipcode}
                    </div>
                    <div className={`mt-4 flex items-center text-green-600 dark:text-green-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t('users.viewProfile')}
                      <svg className={`w-4 h-4 ${isRTL ? 'mr-1 transform group-hover:-translate-x-1' : 'ml-1 transform group-hover:translate-x-1'} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-1 flex justify-between sm:hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('users.pagination.previous')}
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('users.pagination.next')}
                  </button>
                </div>
                <div className={`hidden sm:flex-1 sm:flex sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse font-arabic' : ''}`}>
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {t('users.pagination.showing')}{' '}
                      <span className="font-medium">{indexOfFirstUser + 1}</span>
                      {' '}{t('users.pagination.to')}{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastUser, filteredUsers.length)}
                      </span>
                      {' '}{t('users.pagination.of')}{' '}
                      <span className="font-medium">{filteredUsers.length}</span>
                      {' '}{t('users.pagination.users')}
                    </p>
                  </div>
                  <div>
                    <nav className={`relative z-0 inline-flex rounded-md shadow-sm ${isRTL ? 'space-x-reverse -space-x-px' : '-space-x-px'}`}>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 ${isRTL ? 'rounded-r-md' : 'rounded-l-md'} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={isRTL ? "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" : "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"} clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-green-50 border-green-500 text-green-600 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 ${isRTL ? 'rounded-l-md' : 'rounded-r-md'} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={isRTL ? "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"} clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
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

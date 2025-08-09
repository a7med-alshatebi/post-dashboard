'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/header';
import { BackToTop } from '../../../components/back-to-top';
import { ShareEmailModal } from '../../../components/share-email-modal';
import { ConfirmDialog } from '../../../components/confirm-dialog';
import { EditPostModal } from '../../../components/edit-post-modal';
import { useToast } from '../../../components/toast';
import { useI18n } from '../../../contexts/I18nContext';

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
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default function UserPage({ params }: UserPageProps) {
  const { t, isRTL } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  
  // Modals and interactions
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<Post | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    postId: number | null;
    title: string;
    message: string;
  }>({
    isOpen: false,
    postId: null,
    title: '',
    message: ''
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    post: Post | null;
  }>({
    isOpen: false,
    post: null
  });

  const { addToast } = useToast();

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [userResponse, postsResponse] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
        fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      ]);

      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to fetch user');
      }

      if (!postsResponse.ok) {
        throw new Error('Failed to fetch posts');
      }

      const userData = await userResponse.json();
      const postsData = await postsResponse.json();

      setUser(userData);
      setPosts(postsData);
      
      // Remove toast notification to prevent spam during navigation
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching user data:', error);
      setError(errorMessage);
      addToast({
        type: 'error',
        title: t('userProfile.toast.failedToLoad'),
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [userId]); // Remove addToast from dependencies

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!userId) return;
    fetchUserData();
  }, [userId, fetchUserData]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Post management functions
  const deletePost = async (postId: number) => {
    setConfirmDialog({
      isOpen: true,
      postId,
      title: t('userProfile.confirmDialog.deleteTitle'),
      message: `${t('userProfile.confirmDialog.deleteMessage')} #${postId}? ${t('userProfile.confirmDialog.cannotUndone')}`
    });
  };

  const confirmDelete = async () => {
    const postId = confirmDialog.postId;
    if (!postId) return;

    try {
      setDeletingIds(prev => new Set(prev).add(postId));
      
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
        addToast({
          type: 'success',
          title: t('userProfile.toast.postDeleted'),
          message: `${t('userProfile.toast.postDeletedMessage')} #${postId}.`
        });
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      addToast({
        type: 'error',
        title: t('userProfile.toast.deleteFailed'),
        message: t('userProfile.toast.deleteFailedMessage')
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      setConfirmDialog({ isOpen: false, postId: null, title: '', message: '' });
    }
  };

  const handleSharePost = (post: Post) => {
    setPostToShare(post);
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
    setPostToShare(null);
  };

  const handleEditPost = (post: Post) => {
    setEditModal({ isOpen: true, post });
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, post: null });
  };

  const handleSavePost = async (updatedPost: Post) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPost),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response.ok) {
        const savedPost = await response.json();
        setPosts(posts.map(post => 
          post.id === savedPost.id ? savedPost : post
        ));
        addToast({
          type: 'success',
          title: t('userProfile.toast.postUpdated'),
          message: `${t('userProfile.toast.postUpdatedMessage')} #${savedPost.id}.`
        });
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      addToast({
        type: 'error',
        title: t('userProfile.toast.updateFailed'),
        message: t('userProfile.toast.updateFailedMessage')
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className={`text-center ${isRTL ? 'font-arabic' : ''}`}>
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4 sm:mb-6"></div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('userProfile.loading')}</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{t('userProfile.loadingMessage')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Header 
          title={t('userProfile.userNotFound')}
          subtitle={t('userProfile.userNotFoundSubtitle')}
        />
        
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className={`p-6 sm:p-8 lg:p-12 text-center ${isRTL ? 'font-arabic' : ''}`}>
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {error || t('userProfile.userNotFound')}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {t('userProfile.errorMessage')}
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <button
                  onClick={() => router.back()}
                  className={`inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                  </svg>
                  {t('common.goBack')}
                </button>
                
                <Link
                  href="/"
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t('userProfile.backToDashboard')}
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <BackToTop />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Header 
        title={`${user.name} (@${user.username})`}
        subtitle={`${t('userProfile.userIdPrefix')}${userId} • ${posts.length} ${t('userProfile.postsCount')}`}
        showStats={true}
        stats={{
          posts: posts.length,
          email: user.email,
          website: user.website || 'N/A'
        }}
      />

      {/* Navigation Breadcrumb */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 -mt-3 relative z-10">
        <nav className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 flex-row-reverse font-arabic' : 'space-x-2'} text-sm`}>
          <Link 
            href="/" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            {t('userProfile.breadcrumbDashboard')}
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
          <Link 
            href="/users" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            {t('userProfile.breadcrumbUsers')}
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
          <span className="text-gray-500 dark:text-gray-400">{t('userProfile.userIdPrefix')}{userId}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10 space-y-6">
        
        {/* User Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          <div className="px-6 sm:px-8 lg:px-12 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  @{user.username}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">{user.phone}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                      <a 
                        href={`https://${user.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                  {user.company && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">{user.company.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                <span>{t('userProfile.postsBy')} {user.name} ({posts.length})</span>
                {totalPages > 1 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t('userProfile.pageOf')} {currentPage} {t('userProfile.of')} {totalPages}
                  </span>
                )}
              </h2>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className={`text-center py-12 sm:py-20 px-4 sm:px-8 ${isRTL ? 'font-arabic' : ''}`}>
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{t('userProfile.noPostsYet')}</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t('userProfile.noPostsMessage')}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table view */}
              <div className="hidden lg:block overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                      <tr>
                        <th className={`px-4 lg:px-8 py-3 lg:py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {t('userProfile.tableHeaders.id')}
                          </div>
                        </th>
                        <th className={`px-4 lg:px-8 py-3 lg:py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            {t('userProfile.tableHeaders.title')}
                          </div>
                        </th>
                        <th className={`px-4 lg:px-8 py-3 lg:py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {t('userProfile.tableHeaders.actions')}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                      {currentPosts.map((post, index) => (
                        <tr 
                          key={post.id} 
                          className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 hover:shadow-sm cursor-pointer"
                          style={{ animationDelay: `${index * 30}ms` }}
                          onClick={() => router.push(`/post/${post.id}`)}
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
                              <h3 className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-white capitalize leading-relaxed hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title={post.title}>
                                {post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {post.title.length} characters
                              </p>
                            </div>
                          </td>
                          <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleEditPost(post)}
                                className="min-touch-target group-hover:scale-110 transition-all duration-200 inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 border border-transparent text-xs lg:text-sm font-medium rounded-xl text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 shadow-sm hover:shadow-md"
                              >
                                <svg className={`w-3 h-3 lg:w-4 lg:h-4 ${isRTL ? 'ml-1 lg:ml-2' : 'mr-1 lg:mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {t('userProfile.actions.edit')}
                              </button>
                              <button
                                onClick={() => handleSharePost(post)}
                                className="min-touch-target group-hover:scale-110 transition-all duration-200 inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 border border-transparent text-xs lg:text-sm font-medium rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 shadow-sm hover:shadow-md"
                              >
                                <svg className={`w-3 h-3 lg:w-4 lg:h-4 ${isRTL ? 'ml-1 lg:ml-2' : 'mr-1 lg:mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {t('userProfile.actions.share')}
                              </button>
                              <button
                                onClick={() => deletePost(post.id)}
                                disabled={deletingIds.has(post.id)}
                                className="min-touch-target group-hover:scale-110 transition-all duration-200 inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 border border-transparent text-xs lg:text-sm font-medium rounded-xl text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 shadow-sm hover:shadow-md"
                              >
                                {deletingIds.has(post.id) ? (
                                  <>
                                    <div className={`animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-2 border-red-300 border-t-red-600 ${isRTL ? 'ml-1.5 lg:ml-2' : 'mr-1.5 lg:mr-2'}`}></div>
                                    {t('userProfile.actions.deleting')}
                                  </>
                                ) : (
                                  <>
                                    <svg className={`w-3 h-3 lg:w-4 lg:h-4 ${isRTL ? 'ml-1 lg:ml-2' : 'mr-1 lg:mr-2'}`} fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {t('userProfile.actions.delete')}
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={`px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'font-arabic' : ''}`}>
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex-1 flex justify-between sm:hidden ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('userProfile.pagination.previous')}
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('userProfile.pagination.next')}
                        </button>
                      </div>
                      <div className={`hidden sm:flex-1 sm:flex sm:items-center sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                        <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {t('userProfile.pagination.showing')}{' '}
                            <span className="font-medium">{indexOfFirstPost + 1}</span>
                            {' '}{t('userProfile.pagination.to')}{' '}
                            <span className="font-medium">
                              {Math.min(indexOfLastPost, posts.length)}
                            </span>
                            {' '}{t('userProfile.pagination.of')}{' '}
                            <span className="font-medium">{posts.length}</span>
                            {' '}{t('userProfile.pagination.posts')}
                          </p>
                        </div>
                        <div>
                          <nav className={`relative z-0 inline-flex rounded-md shadow-sm ${isRTL ? 'space-x-reverse -space-x-px' : '-space-x-px'}`} aria-label="Pagination">
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
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400'
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
                  </div>
                )}
              </div>

              {/* Mobile card view */}
              <div className="block lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
                {currentPosts.map((post, index) => (
                  <div 
                    key={post.id} 
                    className="group bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => router.push(`/post/${post.id}`)}
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
                      <div className="flex gap-1.5 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEditPost(post)}
                          className="min-touch-target group-hover:scale-110 transition-transform inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-transparent text-xs font-medium rounded-lg sm:rounded-xl text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 shadow-sm flex-shrink-0"
                          title="Edit Post"
                        >
                          <svg className="w-3 h-3 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleSharePost(post)}
                          className="min-touch-target group-hover:scale-110 transition-transform inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-transparent text-xs font-medium rounded-lg sm:rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 shadow-sm flex-shrink-0"
                          title="Share Post"
                        >
                          <svg className="w-3 h-3 sm:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden sm:inline">Share</span>
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          disabled={deletingIds.has(post.id)}
                          className="min-touch-target group-hover:scale-110 transition-transform inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 border border-transparent text-xs font-medium rounded-lg sm:rounded-xl text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 shadow-sm flex-shrink-0"
                          title="Delete Post"
                        >
                          {deletingIds.has(post.id) ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-2 border-red-300 border-t-red-600 sm:mr-1"></div>
                          ) : (
                            <svg className="w-3 h-3 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white mb-2 sm:mb-3 capitalize leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                ))}

                {/* Mobile Pagination */}
                {totalPages > 1 && (
                  <div className={`flex justify-center pt-4 ${isRTL ? 'font-arabic' : ''}`}>
                    <nav className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('userProfile.pagination.previous')}
                      </button>
                      
                      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 text-sm font-medium rounded ${
                              page === currentPage
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('userProfile.pagination.next')}
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className={`text-center ${isRTL ? 'font-arabic' : ''}`}>
          <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Link
              href="/users"
              className={`inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              {t('userProfile.backToUsers')}
            </Link>
            <Link
              href="/"
              className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t('userProfile.backToDashboard')}
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Share Email Modal */}
      {shareModalOpen && postToShare && (
        <ShareEmailModal
          post={postToShare}
          author={user.name}
          isOpen={shareModalOpen}
          onClose={handleCloseShareModal}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, postId: null, title: '', message: '' })}
        onConfirm={confirmDelete}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={t('userProfile.confirmDialog.delete')}
        cancelText={t('userProfile.confirmDialog.cancel')}
        type="danger"
        loading={confirmDialog.postId ? deletingIds.has(confirmDialog.postId) : false}
      />

      {/* Edit Post Modal */}
      {editModal.isOpen && editModal.post && (
        <EditPostModal
          isOpen={editModal.isOpen}
          onClose={handleCloseEditModal}
          onSave={handleSavePost}
          post={editModal.post}
          users={[user]}
        />
      )}
    </div>
  );
}

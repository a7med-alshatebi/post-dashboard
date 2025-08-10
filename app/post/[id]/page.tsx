'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/header';
import { BackToTop } from '../../../components/back-to-top';
import { ShareEmailModal } from '../../../components/share-email-modal';
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
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
  };
}

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [postId, setPostId] = useState<string>('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Pagination for comments
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage, setCommentsPerPage] = useState(5);

  const handleSharePost = () => {
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
  };

  // Calculate comments per page based on post ID
  const getCommentsPerPage = (postId: string) => {
    const id = parseInt(postId);
    if (isNaN(id)) return 5; // Default fallback
    
    // Different pagination for different posts
    const paginationMap: { [key: number]: number } = {
      1: 8,   // Post 1: 8 comments per page
      2: 3,   // Post 2: 3 comments per page
      3: 6,   // Post 3: 6 comments per page
      4: 4,   // Post 4: 4 comments per page
      5: 7,   // Post 5: 7 comments per page
      6: 2,   // Post 6: 2 comments per page
      7: 9,   // Post 7: 9 comments per page
      8: 5,   // Post 8: 5 comments per page
      9: 3,   // Post 9: 3 comments per page
      10: 10, // Post 10: 10 comments per page
    };
    
    // For posts beyond 10, use a formula to generate different values
    if (id > 10) {
      const calculatedValue = ((id % 7) + 2); // This will give values between 2-8
      return calculatedValue;
    }
    
    return paginationMap[id] || 5; // Default to 5 if not in map
  };

  // Pagination logic for comments
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to comments section
    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
      // Set different comments per page based on post ID
      setCommentsPerPage(getCommentsPerPage(resolvedParams.id));
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!postId) return;
    
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch post details
        const postResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        if (!postResponse.ok) {
          if (postResponse.status === 404) {
            throw new Error('Post not found');
          }
          throw new Error('Failed to fetch post');
        }
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch author details
        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${postData.userId}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setAuthor(userData);
        }

        // Fetch comments
        setCommentsLoading(true);
        const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }
        setCommentsLoading(false);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Header 
          title={t('postDetail.loadingTitle')}
          subtitle={t('postDetail.loadingSubtitle')}
          showStats={false}
        />
        
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <BackToTop />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <Header 
          title={t('postDetail.notFoundTitle')}
          subtitle={t('postDetail.notFoundSubtitle')}
          showStats={false}
        />
        
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className="p-6 sm:p-8 lg:p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {error}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {t('postDetail.postNotFound')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('postDetail.goBack')}
                </button>
                
                <Link
                  href="/posts"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('postDetail.backToPosts')}
                </Link>
                
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t('postDetail.backToDashboard')}
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
        title={post?.title || t('postDetail.title')}
        subtitle={`${t('posts.title')} #${postId} ${t('postDetail.postBy')} ${author?.name || 'Unknown Author'}`}
        showStats={true}
        stats={{
          postId: Number(postId),
          comments: comments.length,
          author: author?.name || t('common.loading')
        }}
      />

      {/* Navigation Breadcrumb */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-2 -mt-3 relative z-10">
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
          <span className="text-gray-500 dark:text-gray-400">{t('posts.title')} #{postId}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10 space-y-6">
        
        {/* Post Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          {/* Post Header */}
          <div className="px-6 sm:px-8 lg:px-12 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                    #{post?.id}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white capitalize leading-tight">
                      {post?.title}
                    </h1>
                  </div>
                </div>
                
                {/* Author Info */}
                {author && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {author.name}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span>@{author.username}</span>
                        <span>•</span>
                        <span>{author.email}</span>
                        {author.company && (
                          <>
                            <span>•</span>
                            <span>{author.company.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`flex gap-2 ${isRTL ? 'ml-auto mr-4' : 'ml-4'}`}>
                <button
                  onClick={handleSharePost}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('posts.share')}
                </button>
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('postDetail.goBack')}
                </button>
              </div>
            </div>
          </div>
          
          {/* Post Body */}
          <div className="px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {post?.body}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div id="comments-section" className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          <div className="px-6 sm:px-8 lg:px-12 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                {t('postDetail.comments')} ({comments.length})
              </h2>
              {totalPages > 1 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('common.page')} {currentPage} {t('common.of')} {totalPages}
                </span>
              )}
            </div>
          </div>
          
          <div className="px-6 sm:px-8 lg:px-12 py-6">
            {commentsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('postDetail.noCommentsTitle')}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('postDetail.noCommentsDesc')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentComments.map((comment, index) => (
                  <div 
                    key={comment.id}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 pb-6 last:pb-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                            {comment.name}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            •
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {comment.email}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {comment.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Pagination */}
          {totalPages > 1 && (
            <div className="px-6 sm:px-8 lg:px-12 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-3">
                {/* Mobile pagination */}
                <div className={`flex flex-col gap-4 sm:hidden ${isRTL ? 'font-arabic' : ''}`}>
                  <div className="text-center space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t('common.page')} <span className="font-medium">{currentPage}</span> {t('common.of')} <span className="font-medium">{totalPages}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ({indexOfFirstComment + 1}-{Math.min(indexOfLastComment, comments.length)} {t('common.of')} {comments.length})
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {commentsPerPage} {t('postDetail.commentsPerPage')} #{postId}
                    </p>
                  </div>
                  <div className={`flex justify-center items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm min-h-[40px] min-w-0 flex-shrink-0"
                      aria-label="Previous page"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={isRTL ? "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" : "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"} clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Smart mobile page numbers with ellipsis */}
                    <div className={`flex items-center gap-1 overflow-x-auto max-w-[240px] px-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {(() => {
                        const pages = [];
                        const showEllipsis = totalPages > 7;
                        
                        if (!showEllipsis) {
                          // Show all pages if 7 or fewer
                          for (let i = 1; i <= totalPages; i++) {
                            pages.push(i);
                          }
                        } else {
                          // Show smart pagination with ellipsis
                          if (currentPage <= 4) {
                            // Near beginning: 1 2 3 4 5 ... last
                            pages.push(1, 2, 3, 4, 5);
                            if (totalPages > 6) pages.push('ellipsis1');
                            pages.push(totalPages);
                          } else if (currentPage >= totalPages - 3) {
                            // Near end: 1 ... last-4 last-3 last-2 last-1 last
                            pages.push(1);
                            if (totalPages > 6) pages.push('ellipsis1');
                            for (let i = totalPages - 4; i <= totalPages; i++) {
                              pages.push(i);
                            }
                          } else {
                            // In middle: 1 ... current-1 current current+1 ... last
                            pages.push(1);
                            pages.push('ellipsis1');
                            pages.push(currentPage - 1, currentPage, currentPage + 1);
                            pages.push('ellipsis2');
                            pages.push(totalPages);
                          }
                        }
                        
                        return pages.map((page, index) => {
                          if (typeof page === 'string') {
                            return (
                              <span key={page} className="px-1 text-gray-400 dark:text-gray-500 text-xs">
                                ...
                              </span>
                            );
                          }
                          
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-8 h-8 rounded-lg text-xs font-medium flex-shrink-0 transition-all duration-200 ${
                                page === currentPage
                                  ? 'bg-blue-500 text-white shadow-md'
                                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        });
                      })()}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm min-h-[40px] min-w-0 flex-shrink-0"
                      aria-label="Next page"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={isRTL ? "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" : "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"} clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Desktop pagination */}
                <div className="hidden sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {t('posts.showing')}{' '}
                      <span className="font-medium">{indexOfFirstComment + 1}</span>
                      {' '}{t('common.to')}{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastComment, comments.length)}
                      </span>
                      {' '}{t('common.of')}{' '}
                      <span className="font-medium">{comments.length}</span>
                      {' '}{t('postDetail.comments').toLowerCase()}
                      <span className="text-blue-600 dark:text-blue-400 ml-2">
                        ({commentsPerPage} {t('postDetail.commentsPerPage')} #{postId})
                      </span>
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
        </div>

        {/* Navigation Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/posts"
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('postDetail.backToPosts')}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t('postDetail.backToDashboard')}
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />

      {/* Share Email Modal */}
      {shareModalOpen && post && author && (
        <ShareEmailModal
          post={post}
          author={author.name}
          isOpen={shareModalOpen}
          onClose={handleCloseShareModal}
        />
      )}
    </div>
  );
}

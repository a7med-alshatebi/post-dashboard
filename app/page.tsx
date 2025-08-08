'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '../components/header';
import { BackToTop } from '../components/back-to-top';
import { ShareEmailModal } from '../components/share-email-modal';
import { ConfirmDialog } from '../components/confirm-dialog';
import { EditPostModal } from '../components/edit-post-modal';
import { useToast } from '../components/toast';
import { DashboardSkeleton } from '../components/analytics-skeleton';

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
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<Post | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);
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

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.postsPerPage) {
          setPostsPerPage(settings.postsPerPage);
        }
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchPostsAndUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      
      addToast({
        type: 'success',
        title: 'Data loaded successfully',
        message: `Loaded ${postsData.length} posts and ${usersData.length} users`
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast({
        type: 'error',
        title: 'Failed to load data',
        message: 'Please check your connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: number) => {
    setConfirmDialog({
      isOpen: true,
      postId,
      title: 'Delete Post',
      message: `Are you sure you want to delete post #${postId}? This action cannot be undone.`
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
          title: 'Post deleted',
          message: `Post #${postId} has been successfully deleted.`
        });
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      addToast({
        type: 'error',
        title: 'Delete failed',
        message: 'Failed to delete the post. Please try again.'
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
          title: 'Post updated',
          message: `Post #${savedPost.id} has been successfully updated.`
        });
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      addToast({
        type: 'error',
        title: 'Update failed',
        message: 'Failed to update the post. Please try again.'
      });
      throw error;
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

  // Pagination logic
  const shouldShowPagination = postsPerPage < 100 && filteredPosts.length > postsPerPage;
  const indexOfLastPost = shouldShowPagination ? currentPage * postsPerPage : filteredPosts.length;
  const indexOfFirstPost = shouldShowPagination ? indexOfLastPost - postsPerPage : 0;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = shouldShowPagination ? Math.ceil(filteredPosts.length / postsPerPage) : 1;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedUserId, postsPerPage]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedUserId(null);
    setCurrentPage(1);  
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm.length > 0 || selectedUserId !== null;

  if (loading) {
    return <DashboardSkeleton />;
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
                  {totalPages > 1 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                  )}
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
              <div className="flex flex-wrap gap-2 text-xs">
                {hasActiveFilters && (
                  <>
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
                  </>
                )}
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-300">
                  {postsPerPage === 100 ? 'All posts' : `${postsPerPage} per page`}
                  {shouldShowPagination && (
                    <span className="ml-1">• Page {currentPage} of {totalPages}</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile view */}
          <div className="block lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
            {currentPosts.map((post, index) => (
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
                  <div className="flex gap-1.5 sm:gap-2">
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
                        <>
                          <div className="w-3 h-3 sm:mr-1.5 bg-red-400 dark:bg-red-500 rounded animate-pulse"></div>
                          <span className="hidden sm:inline">Deleting...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 sm:mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="hidden sm:inline">Delete</span>
                        </>
                      )}
                    </button>
                  </div>
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
                  <span className="truncate">Author: 
                    <Link 
                      href={`/user/${post.userId}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {getUserName(post.userId)}
                    </Link>
                  </span>
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
                  {currentPosts.map((post, index) => (
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
                            <Link
                              href={`/user/${post.userId}`}
                              className="text-xs lg:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            >
                              {getUserName(post.userId)}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              User ID: {post.userId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-8 py-4 lg:py-6 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="min-touch-target group-hover:scale-110 transition-all duration-200 inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 border border-transparent text-xs lg:text-sm font-medium rounded-xl text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleSharePost(post)}
                            className="min-touch-target group-hover:scale-110 transition-all duration-200 inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 border border-transparent text-xs lg:text-sm font-medium rounded-xl text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Share
                          </button>
                          <button
                            onClick={() => deletePost(post.id)}
                            disabled={deletingIds.has(post.id)}
                            className="min-touch-target group-hover:scale-110 transition-all duration-200 inline-flex items-center px-3 lg:px-4 py-1.5 lg:py-2 border border-transparent text-xs lg:text-sm font-medium rounded-xl text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 shadow-sm hover:shadow-md"
                          >
                            {deletingIds.has(post.id) ? (
                              <>
                                <div className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 lg:mr-2 bg-red-400 dark:bg-red-500 rounded animate-pulse"></div>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {shouldShowPagination && (
              <div className="px-3 sm:px-6 lg:px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                <div className="flex flex-col gap-3">
                  {/* Mobile pagination */}
                  <div className="flex flex-col gap-2 sm:hidden">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ({indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length})
                      </p>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm min-h-[40px]"
                        aria-label="Previous page"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Mobile page numbers - show max 3 pages for better fit */}
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
                        aria-label="Next page"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Desktop pagination */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing{' '}
                        <span className="font-medium">{indexOfFirstPost + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastPost, filteredPosts.length)}
                        </span>
                        {' '}of{' '}
                        <span className="font-medium">{filteredPosts.length}</span>
                        {' '}results
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
                        
                        {/* Show limited page numbers on desktop too for better UX */}
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

      {/* Share Email Modal */}
      {shareModalOpen && postToShare && (
        <ShareEmailModal
          post={postToShare}
          author={getUserName(postToShare.userId)}
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
        confirmText="Delete"
        cancelText="Cancel"
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
          users={users}
        />
      )}
    </div>
  );
}

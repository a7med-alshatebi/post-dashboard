'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', userId: '1' });
  const [formError, setFormError] = useState<{ title?: string; body?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    setDeletingIds(prev => new Set([...prev, postId]));
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // Unique userIds for dropdown
  const userIds = useMemo(
    () => Array.from(new Set(posts.map(p => p.userId))).sort((a, b) => a - b),
    [posts]
  );

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesTitle = post.title.toLowerCase().includes(search.toLowerCase());
      const matchesUser = userId === '' || post.userId === Number(userId);
      return matchesTitle && matchesUser;
    });
  }, [posts, search, userId]);

  const clearFilters = () => {
    setSearch('');
    setUserId('');
  };

  // Modal form handlers
  const openModal = () => {
    setShowModal(true);
    setForm({ title: '', body: '', userId: '1' });
    setFormError({});
  };
  const closeModal = () => {
    setShowModal(false);
    setFormError({});
  };
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError({ ...formError, [e.target.name]: undefined });
  };
  const validateForm = () => {
    const errors: { title?: string; body?: string } = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.body.trim()) errors.body = 'Body is required';
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    // Optimistic UI update
    const newPost: Post = {
      id: Math.max(0, ...posts.map(p => p.id)) + 1,
      title: form.title,
      body: form.body,
      userId: Number(form.userId),
    };
    setPosts([newPost, ...posts]);
    closeModal();
    setSubmitting(false);
    // Optionally, you could POST to API here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Posts Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your posts from JSONPlaceholder API</p>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg text-gray-600">Loading posts...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Posts Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your posts from JSONPlaceholder API</p>
          </div>
          <button
            onClick={openModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            + New Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>
          <div>
            <select
              value={userId}
              onChange={e => setUserId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 "
            >
              <option value="">All Authors</option>
              {userIds.map(id => (
                <option key={id} value={id}>
                  User {id}
                </option>
              ))}
            </select>
          </div>
          {(search || userId) && (
            <div>
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Modal for new post */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative animate-fade-in">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl text-blue-600 font-semibold mb-4">Create New Post</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title<span className="text-red-500">*</span></label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-md text-gray-700 focus:ring-blue-500 focus:border-blue-500 ${formError.title ? 'border-red-500' : 'border-gray-300'}`}
                    maxLength={100}
                  />
                  {formError.title && <p className="text-red-500 text-xs mt-1">{formError.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body<span className="text-red-500">*</span></label>
                  <textarea
                    name="body"
                    value={form.body}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-md  text-gray-700 focus:ring-blue-500 focus:border-blue-500 ${formError.body ? 'border-red-500' : 'border-gray-300'}`}
                    rows={4}
                    maxLength={500}
                  />
                  {formError.body && <p className="text-red-500 text-xs mt-1">{formError.body}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <select
                    name="userId"
                    value={form.userId}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Post'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ...existing code for table, cards, and empty state... */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {post.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs lg:max-w-md truncate" title={post.title}>
                        <Link href={`/post/${post.id}`} className="text-blue-600 hover:underline">
                          {post.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      User {post.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingIds.has(post.id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                      >
                        {deletingIds.has(post.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <div key={post.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          ID: {post.id}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          User {post.userId}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                        <Link href={`/post/${post.id}`} className="text-blue-600 hover:underline">
                          {post.title}
                        </Link>
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingIds.has(post.id)}
                      className="ml-4 text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center text-sm"
                    >
                      {deletingIds.has(post.id) ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 && !loading && (
            <div className="px-6 py-8 text-center">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
                {(search || userId) && (
                  <div className="mt-4">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredPosts.length} of {posts.length} posts from JSONPlaceholder API
        </div>
      </div>
    </div>
  );
}
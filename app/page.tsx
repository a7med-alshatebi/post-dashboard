'use client';

import { useState, useEffect } from 'react';

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Post Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage and view posts from JSONPlaceholder API
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Posts ({posts.length})
            </h2>
          </div>

          {/* Mobile view */}
          <div className="block sm:hidden">
            {posts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    ID: {post.id}
                  </span>
                  <button
                    onClick={() => deletePost(post.id)}
                    disabled={deletingIds.has(post.id)}
                    className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700"
                  >
                    {deletingIds.has(post.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-current mr-1"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1 capitalize">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Author: {getUserName(post.userId)}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {post.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-md">
                      <div className="truncate capitalize" title={post.title}>
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {getUserName(post.userId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deletePost(post.id)}
                        disabled={deletingIds.has(post.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700"
                      >
                        {deletingIds.has(post.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b border-current mr-2"></div>
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

          {posts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">No posts</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No posts available to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

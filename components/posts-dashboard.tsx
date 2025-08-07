'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Header } from '../components/header';
import { BackToTop } from '../components/back-to-top';
import { ShareEmailModal } from '../components/share-email-modal';
import { ConfirmDialog } from '../components/confirm-dialog';
import { EditPostModal } from '../components/edit-post-modal';
import { useToast } from '../components/toast';
import { DashboardSkeleton, PostCardSkeleton } from '../components/skeleton';

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

// Posts content component wrapped in Suspense
function PostsContent() {
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

  // Fetch posts and users
  useEffect(() => {
    const fetchData = async () => {
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
          title: 'Data loaded successfully!'
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        addToast({
          type: 'error',
          title: 'Failed to load data. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [addToast]);

  // Rest of your component logic would go here...
  // For now, let me just return a skeleton or loading state
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }, (_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Return your main content here
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
      {/* Your existing content would go here */}
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Posts Content</h2>
        <p className="text-gray-600 dark:text-gray-300">Found {posts.length} posts from {users.length} users</p>
      </div>
    </div>
  );
}

export default function PostDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset">
      {/* Header */}
      <Header 
        title="Post Dashboard"
        subtitle="Manage and explore posts from JSONPlaceholder API with modern interface"
        showStats={true}
        stats={{
          posts: 100,
          users: 10
        }}
      />

      {/* Main Content with Suspense */}
      <Suspense fallback={<DashboardSkeleton />}>
        <PostsContent />
      </Suspense>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

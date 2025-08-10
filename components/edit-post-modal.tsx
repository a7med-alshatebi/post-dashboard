'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';

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

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Post) => Promise<void>;
  post: Post;
  users: User[];
}

export function EditPostModal({ isOpen, onClose, onSave, post, users }: EditPostModalProps) {
  const { t, isRTL } = useI18n();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: 1
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && post) {
      setFormData({
        title: post.title,
        body: post.body,
        userId: post.userId
      });
      setErrors({});
    }
  }, [isOpen, post]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('addPost.validation.titleRequired');
    } else if (formData.title.length < 3) {
      newErrors.title = t('addPost.validation.titleMinLength');
    }

    if (!formData.body.trim()) {
      newErrors.body = t('addPost.validation.bodyRequired');
    } else if (formData.body.length < 10) {
      newErrors.body = t('addPost.validation.bodyMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const updatedPost = {
        ...post,
        title: formData.title.trim(),
        body: formData.body.trim(),
        userId: formData.userId
      };
      
      await onSave(updatedPost);
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      setErrors({ general: t('addPost.errorMessages.createFailed') });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : `User ${userId}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal panel */}
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
          <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-0 ${isRTL ? 'pl-4' : 'pr-4'} pt-4`}>
            <button
              type="button"
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={`sm:flex sm:items-start ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 ${isRTL ? 'sm:ml-4' : 'sm:mx-0 sm:mr-4'} sm:h-10 sm:w-10`}>
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className={`mt-3 text-center sm:mt-0 flex-1 ${isRTL ? 'sm:text-right font-arabic' : 'sm:text-left'}`}>
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                {t('posts.editPost')} #{post.id}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('posts.updatePostDetails')}
                </p>
              </div>
            </div>
          </div>

          {errors.general && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Author Selection */}
            <div>
              <label htmlFor="userId" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {t('posts.author')}
              </label>
              <select
                id="userId"
                value={formData.userId}
                onChange={(e) => handleChange('userId', Number(e.target.value))}
                className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${isRTL ? 'text-right font-arabic' : ''}`}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} (@{user.username})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {t('addPost.fields.title')} *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.title
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right font-arabic' : ''}`}
                placeholder={t('addPost.placeholders.title')}
              />
              {errors.title && (
                <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right font-arabic' : ''}`}>{errors.title}</p>
              )}
              <p className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {formData.title.length}/100 {t('addPost.charactersLabel')}
              </p>
            </div>

            {/* Body */}
            <div>
              <label htmlFor="body" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {t('addPost.fields.content')} *
              </label>
              <textarea
                id="body"
                rows={6}
                value={formData.body}
                onChange={(e) => handleChange('body', e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.body
                    ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isRTL ? 'text-right font-arabic' : ''}`}
                placeholder={t('addPost.placeholders.content')}
              />
              {errors.body && (
                <p className={`mt-1 text-sm text-red-600 dark:text-red-400 ${isRTL ? 'text-right font-arabic' : ''}`}>{errors.body}</p>
              )}
              <p className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {formData.body.length}/500 {t('addPost.charactersLabel')}
              </p>
            </div>

            {/* Actions */}
            <div className={`mt-6 flex ${isRTL ? 'flex-col-reverse sm:flex-row-reverse sm:justify-start' : 'flex-col-reverse sm:flex-row sm:justify-end'} sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0`}>
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isRTL ? 'font-arabic' : ''}`}
                disabled={loading}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'font-arabic' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className={`animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                    {t('common.loading')}
                  </>
                ) : (
                  t('common.save')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

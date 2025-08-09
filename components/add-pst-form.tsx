'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/contexts/I18nContext'

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface FormData {
  title: string;
  body: string;
  userId: number;
}

interface FormErrors {
  title?: string;
  body?: string;
  userId?: string;
}

interface AddPostFormProps {
  onAddPost: (post: Omit<Post, 'id'>) => Post;
  onLoadPosts: () => void;
}

export default function AddPostForm({ onAddPost, onLoadPosts }: AddPostFormProps) {
  const { t, isRTL } = useI18n()
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: 1
  })

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showModal, setShowModal] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t('addPost.validation.titleRequired');
    } else if (formData.title.trim().length < 3) {
      newErrors.title = t('addPost.validation.titleMinLength');
    } else if (formData.title.trim().length > 100) {
      newErrors.title = t('addPost.validation.titleMaxLength');
    }

    if (!formData.body.trim()) {
      newErrors.body = t('addPost.validation.bodyRequired');
    } else if (formData.body.trim().length < 10) {
      newErrors.body = t('addPost.validation.bodyMinLength');
    } else if (formData.body.trim().length > 500) {
      newErrors.body = t('addPost.validation.bodyMaxLength');
    }

    if (!formData.userId || formData.userId < 1 || formData.userId > 10) {
      newErrors.userId = t('addPost.validation.userIdRange');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Optimistic UI update - add to local state immediately
      onAddPost({
        title: formData.title.trim(),
        body: formData.body.trim(),
        userId: formData.userId,
      });

      // Simulate API call to JSONPlaceholder
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          body: formData.body.trim(),
          userId: formData.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(t('addPost.errorMessages.createFailed'));
      }

      const result = await response.json();
      console.log('Post created successfully:', result);

      // Reset form
      setFormData({
        title: '',
        body: '',
        userId: 1,
      });
      
      setErrors({});
      setSubmitStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);

    } catch (error) {
      console.error('Error creating post:', error);
      setSubmitStatus('error');
      
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      userId: 1,
    });
    setErrors({});
    setSubmitStatus('idle');
  };

  return (
    <>
      {/* Quick Add Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowModal(true)}
          className={`w-full min-touch-target inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('addPost.quickAddButton')}
        </button>
      </div>

      {/* Regular Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Messages */}
        {submitStatus !== 'idle' && (
          <div className={`p-4 rounded-lg ${
            submitStatus === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300' 
              : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
          }`}>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              {submitStatus === 'success' ? (
                <>
                  <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('addPost.successMessage')}
                </>
              ) : (
                <>
                  <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {t('addPost.errorMessage')}
                </>
              )}
            </div>
          </div>
        )}

        {/* Title Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('addPost.fields.title')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder={t('addPost.placeholders.title')}
            className={`block w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.title 
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            } ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
            maxLength={100}
          />
          {errors.title && (
            <p className={`text-sm text-red-600 dark:text-red-400 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <svg className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.title}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formData.title.length}/100 {t('addPost.charactersLabel')}
          </p>
        </div>

        {/* Body Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('addPost.fields.content')} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            placeholder={t('addPost.placeholders.content')}
            rows={6}
            className={`block w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
              errors.body 
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            } ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
            maxLength={500}
          />
          {errors.body && (
            <p className={`text-sm text-red-600 dark:text-red-400 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <svg className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.body}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formData.body.length}/500 {t('addPost.charactersLabel')}
          </p>
        </div>

        {/* User ID Dropdown */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('addPost.fields.author')} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.userId}
            onChange={(e) => handleInputChange('userId', Number(e.target.value))}
            className={`block w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.userId 
                ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            } ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => (
              <option key={id} value={id}>
                {t('addPost.user')} {id}
              </option>
            ))}
          </select>
          {errors.userId && (
            <p className={`text-sm text-red-600 dark:text-red-400 flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <svg className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.userId}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-3 pt-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={resetForm}
            className={`w-full sm:w-auto min-touch-target inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('addPost.resetButton')}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto min-touch-target inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className={`animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                {t('addPost.creatingButton')}
              </>
            ) : (
              <>
                <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {t('addPost.createButton')}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80"
              onClick={() => setShowModal(false)}
            ></div>

            <div className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('addPost.quickAddButton')}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => { handleSubmit(e); setShowModal(false); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('addPost.fields.title')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={t('addPost.placeholders.title')}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('addPost.fields.content')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => handleInputChange('body', e.target.value)}
                    placeholder={t('addPost.placeholders.content')}
                    rows={4}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('addPost.fields.author')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.userId}
                    onChange={(e) => handleInputChange('userId', Number(e.target.value))}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => (
                      <option key={id} value={id}>{t('addPost.user')} {id}</option>
                    ))}
                  </select>
                </div>

                <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    {t('addPost.cancelButton')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? t('addPost.creatingButton') : t('addPost.createButton')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

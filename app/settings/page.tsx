'use client';

import { useState, useEffect } from 'react';
import { Header } from '../../components/header';
import { BackToTop } from '../../components/back-to-top';

interface Settings {
  postsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number;
  notifications: boolean;
  compactView: boolean;
  showAnimations: boolean;
  defaultSort: 'id' | 'title' | 'author';
  language: string;
  timezone: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    postsPerPage: 20,
    autoRefresh: false,
    refreshInterval: 30,
    notifications: true,
    compactView: false,
    showAnimations: true,
    defaultSort: 'id',
    language: 'en',
    timezone: 'UTC',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('dashboardSettings', JSON.stringify(settings));
      setSaveStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default settings
  const resetToDefaults = () => {
    setSettings({
      postsPerPage: 20,
      autoRefresh: false,
      refreshInterval: 30,
      notifications: true,
      compactView: false,
      showAnimations: true,
      defaultSort: 'id',
      language: 'en',
      timezone: 'UTC',
    });
  };

  // Handle setting changes
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset">
      {/* Header */}
      <Header 
        title="Settings"
        subtitle="Customize your dashboard experience and preferences"
        showStats={false}
      />

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 -mt-3 sm:-mt-6 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm">
          
          {/* Settings Header */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
                <span className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                Dashboard Settings
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={resetToDefaults}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset to Defaults
                </button>
                <button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 sm:px-6 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Save Status */}
            {saveStatus !== 'idle' && (
              <div className={`mt-4 p-3 rounded-lg ${
                saveStatus === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300' 
                  : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
              }`}>
                <div className="flex items-center">
                  {saveStatus === 'success' ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Settings saved successfully!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Failed to save settings. Please try again.
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings Content */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            
            {/* Display Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                Display Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Posts per Page */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Posts per Page
                  </label>
                  <select
                    value={settings.postsPerPage}
                    onChange={(e) => updateSetting('postsPerPage', Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value={10}>10 posts</option>
                    <option value={20}>20 posts</option>
                    <option value={50}>50 posts</option>
                    <option value={100}>100 posts</option>
                  </select>
                </div>

                {/* Default Sort */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Default Sort Order
                  </label>
                  <select
                    value={settings.defaultSort}
                    onChange={(e) => updateSetting('defaultSort', e.target.value as 'id' | 'title' | 'author')}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="id">Sort by ID</option>
                    <option value="title">Sort by Title</option>
                    <option value="author">Sort by Author</option>
                  </select>
                </div>

                {/* Compact View Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Compact View
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Show more posts in less space
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('compactView', !settings.compactView)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.compactView ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                        settings.compactView ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Show Animations Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Animations
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Enable smooth transitions and effects
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('showAnimations', !settings.showAnimations)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.showAnimations ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                        settings.showAnimations ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-Refresh Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                Auto-Refresh Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Auto Refresh Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Auto Refresh
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Automatically refresh posts data
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('autoRefresh', !settings.autoRefresh)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.autoRefresh ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                        settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Refresh Interval */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Refresh Interval (seconds)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={settings.refreshInterval}
                    onChange={(e) => updateSetting('refreshInterval', Number(e.target.value))}
                    disabled={!settings.autoRefresh}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Minimum 10 seconds, maximum 300 seconds
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19l-7-7 7-7m0 14l7-7-7-7" />
                  </svg>
                </div>
                Notifications
              </h3>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Notifications
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Show notifications for new posts and updates
                  </p>
                </div>
                <button
                  onClick={() => updateSetting('notifications', !settings.notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.notifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Localization Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                Localization
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                    <option value="Asia/Dubai">Dubai</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

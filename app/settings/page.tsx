'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Header } from '../../components/header';
import { BackToTop } from '../../components/back-to-top';
import { useI18n, LOCALES } from '../../contexts/I18nContext';

interface Settings {
  theme: 'light' | 'dark' | 'system';
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
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t, isRTL } = useI18n();
  const [mounted, setMounted] = useState(false);
  
  const [settings, setSettings] = useState<Settings>({
    theme: 'system',
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

  const [originalSettings, setOriginalSettings] = useState<Settings>({
    theme: 'system',
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

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if there are unsaved changes
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  // Load settings from localStorage on component mount
  useEffect(() => {
    if (!mounted) return;
    
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setOriginalSettings(parsed);
        // Sync theme with next-themes only on initial load
        if (parsed.theme && parsed.theme !== theme) {
          setTheme(parsed.theme);
        }
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    } else if (theme) {
      // If no saved settings but theme exists, sync initial theme
      setSettings(prev => ({ ...prev, theme: theme as 'light' | 'dark' | 'system' }));
      setOriginalSettings(prev => ({ ...prev, theme: theme as 'light' | 'dark' | 'system' }));
    }
  }, [mounted]); // Only run when mounted

  // Sync settings theme with next-themes when it changes (for system theme changes)
  useEffect(() => {
    if (theme && theme !== settings.theme) {
      setSettings(prev => ({ ...prev, theme: theme as 'light' | 'dark' | 'system' }));
    }
  }, [theme]);

  // Save settings to localStorage
  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('dashboardSettings', JSON.stringify(settings));
      setOriginalSettings(settings); // Update original settings after successful save
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
      theme: 'system',
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
    
    // Special handling for language changes - update i18n context
    if (key === 'language') {
      setLocale(value as string);
    }
    
    // Special handling for theme changes - apply immediately and save to localStorage
    if (key === 'theme') {
      setTheme(value as string);
      // Save theme immediately to localStorage to prevent conflicts
      const currentSettings = JSON.parse(localStorage.getItem('dashboardSettings') || '{}');
      localStorage.setItem('dashboardSettings', JSON.stringify({
        ...currentSettings,
        theme: value
      }));
      // Also update the theme storage key used by next-themes
      localStorage.setItem('theme-preference', value as string);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 safe-area-inset ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Header 
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
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
                {t('settings.title')}
              </h2>
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={resetToDefaults}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('settings.resetToDefaults')}
                </button>
                <button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 sm:px-6 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSaving ? (
                    <>
                      <div className={`animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                      {t('common.loading')}...
                    </>
                  ) : (
                    <>
                      <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t('settings.saveChanges')}
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
                      {t('settings.changesSaved')}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {t('common.failed')}. {t('common.tryAgain')}.
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
              <h3 className={`text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                {t('settings.displaySettings')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme Selection */}
                <div className="space-y-3 md:col-span-2">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('settings.themePreference')}
                  </label>
                  {mounted ? (
                    <div className={`grid grid-cols-3 gap-3 ${isRTL ? 'direction-rtl' : ''}`}>
                      {[
                        { value: 'light', label: t('settings.lightMode'), icon: '☀️', desc: t('settings.lightModeDesc') },
                        { value: 'dark', label: t('settings.darkMode'), icon: '🌙', desc: t('settings.darkModeDesc') },
                        { value: 'system', label: t('settings.systemMode'), icon: '💻', desc: t('settings.systemModeDesc') }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateSetting('theme', option.value as 'light' | 'dark' | 'system')}
                          className={`p-4 border-2 rounded-xl transition-all duration-200 text-center ${
                            settings.theme === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-lg'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                          }`}
                        >
                          <div className="text-2xl mb-2">{option.icon}</div>
                          <div className={`font-medium text-sm ${isRTL ? 'text-center' : ''}`}>{option.label}</div>
                          <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isRTL ? 'text-center' : ''}`}>{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700">
                          <div className="animate-pulse">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 mx-auto mb-1"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16 mx-auto"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Posts per Page */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('settings.postsPerPage')}
                  </label>
                  <select
                    value={settings.postsPerPage}
                    onChange={(e) => updateSetting('postsPerPage', Number(e.target.value))}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value={10}>10 posts</option>
                    <option value={20}>20 posts</option>
                    <option value={50}>50 posts</option>
                    <option value={100}>100 posts</option>
                  </select>
                </div>

                {/* Default Sort */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('settings.defaultSortOrder')}
                  </label>
                  <select
                    value={settings.defaultSort}
                    onChange={(e) => updateSetting('defaultSort', e.target.value as 'id' | 'title' | 'author')}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value="id">{t('settings.sortById')}</option>
                    <option value="title">{t('settings.sortByTitle')}</option>
                    <option value="author">{t('settings.sortByAuthor')}</option>
                  </select>
                </div>

                {/* Compact View Toggle */}
                <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    <label className={`block text-sm font-semibold text-gray-800 dark:text-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('settings.compactView')}
                    </label>
                    <p className={`text-xs text-gray-600 dark:text-gray-400 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('settings.compactViewDesc')}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 ${isRTL ? 'mr-0' : 'ml-0'}`}>
                    <button
                      onClick={() => updateSetting('compactView', !settings.compactView)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-0.5 ${
                        settings.compactView 
                          ? 'bg-blue-600' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      role="switch"
                      aria-checked={settings.compactView}
                      aria-labelledby="compact-view-label"
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                          settings.compactView 
                            ? (isRTL ? '-translate-x-5' : 'translate-x-5')
                            : (isRTL ? 'translate-x-0' : 'translate-x-0')
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Show Animations Toggle */}
                <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    <label className={`block text-sm font-semibold text-gray-800 dark:text-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('settings.showAnimations')}
                    </label>
                    <p className={`text-xs text-gray-600 dark:text-gray-400 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('settings.showAnimationsDesc')}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 ${isRTL ? 'mr-0' : 'ml-0'}`}>
                    <button
                      onClick={() => updateSetting('showAnimations', !settings.showAnimations)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-0.5 ${
                        settings.showAnimations 
                          ? 'bg-blue-600' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      role="switch"
                      aria-checked={settings.showAnimations}
                      aria-labelledby="animations-label"
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                          settings.showAnimations 
                            ? (isRTL ? '-translate-x-5' : 'translate-x-5')
                            : (isRTL ? 'translate-x-0' : 'translate-x-0')
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Refresh Settings */}
            <div className="space-y-6">
              <h3 className={`text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                {t('settings.autoRefreshSettings')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Auto Refresh Toggle */}
                <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-1 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                    <label className={`block text-sm font-semibold text-gray-800 dark:text-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('settings.autoRefresh')}
                    </label>
                    <p className={`text-xs text-gray-600 dark:text-gray-400 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('settings.autoRefreshDesc')}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 ${isRTL ? 'mr-0' : 'ml-0'}`}>
                    <button
                      onClick={() => updateSetting('autoRefresh', !settings.autoRefresh)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-0.5 ${
                        settings.autoRefresh 
                          ? 'bg-green-600' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      role="switch"
                      aria-checked={settings.autoRefresh}
                      aria-labelledby="auto-refresh-label"
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                          settings.autoRefresh 
                            ? (isRTL ? '-translate-x-5' : 'translate-x-5')
                            : (isRTL ? 'translate-x-0' : 'translate-x-0')
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Refresh Interval */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('settings.refreshInterval')}
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={settings.refreshInterval}
                    onChange={(e) => updateSetting('refreshInterval', Number(e.target.value))}
                    disabled={!settings.autoRefresh}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                  <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('settings.refreshIntervalDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-6">
              <h3 className={`text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19l-7-7 7-7m0 14l7-7-7-7" />
                  </svg>
                </div>
                {t('settings.notifications')}
              </h3>

              <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-1 ${isRTL ? 'ml-4' : 'mr-4'}`}>
                  <label className={`block text-sm font-semibold text-gray-800 dark:text-gray-200 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('settings.notifications')}
                  </label>
                  <p className={`text-xs text-gray-600 dark:text-gray-400 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('settings.notificationsDesc')}
                  </p>
                </div>
                <div className={`flex-shrink-0 ${isRTL ? 'mr-0' : 'ml-0'}`}>
                  <button
                    onClick={() => updateSetting('notifications', !settings.notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 p-0.5 ${
                      settings.notifications 
                        ? 'bg-yellow-600' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    role="switch"
                    aria-checked={settings.notifications}
                    aria-labelledby="notifications-label"
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                        settings.notifications 
                          ? (isRTL ? '-translate-x-5' : 'translate-x-5')
                          : (isRTL ? 'translate-x-0' : 'translate-x-0')
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Localization Settings */}
            <div className="space-y-6">
              <h3 className={`text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                {t('settings.localization')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('common.language')}
                  </label>
                  <select
                    value={locale}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    className={`block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
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

          {/* Action Buttons - Mobile Responsive */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 lg:gap-4 xs:justify-end max-w-full">
              <button
                onClick={resetToDefaults}
                className="w-full xs:w-auto min-touch-target inline-flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="xs:hidden">Reset</span>
                <span className="hidden xs:inline sm:hidden">Reset Default</span>
                <span className="hidden sm:inline">Reset to Defaults</span>
              </button>
              
              <button
                onClick={saveSettings}
                disabled={!hasChanges || isSaving}
                className="w-full xs:w-auto min-touch-target inline-flex items-center justify-center px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 border border-transparent text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-1.5 sm:mr-2"></div>
                    <span className="xs:hidden">Saving...</span>
                    <span className="hidden xs:inline sm:hidden">Saving...</span>
                    <span className="hidden sm:inline">Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="xs:hidden">Save</span>
                    <span className="hidden xs:inline sm:hidden">Save Changes</span>
                    <span className="hidden sm:inline">Save All Changes</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Status Indicators */}
            <div className="mt-2 sm:mt-3 text-center xs:text-right space-y-0.5">
              {hasChanges && !isSaving && (
                <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  <span className="xs:hidden">• Unsaved changes</span>
                  <span className="hidden xs:inline">• You have unsaved changes</span>
                </p>
              )}
              {saveStatus === 'success' && (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  <span className="xs:hidden">✓ Saved!</span>
                  <span className="hidden xs:inline">✓ Settings saved successfully</span>
                </p>
              )}
              {saveStatus === 'error' && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  <span className="xs:hidden">✗ Save failed</span>
                  <span className="hidden xs:inline">✗ Failed to save settings</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}

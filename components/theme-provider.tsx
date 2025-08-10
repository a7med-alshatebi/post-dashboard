'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect } from 'react';
import { useTimeBasedTheme } from '../hooks/useTimeBasedTheme';

function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const timeBasedTheme = useTimeBasedTheme();

  useEffect(() => {
    // Check if user has system theme selected
    const savedTheme = localStorage.getItem('theme-preference');
    
    if (savedTheme === 'system') {
      // Apply time-based theme when system is selected
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(timeBasedTheme);
      
      // Also update the data-theme attribute for next-themes compatibility
      document.documentElement.setAttribute('data-theme', timeBasedTheme);
    }
  }, [timeBasedTheme]);

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={false} // Disable built-in system detection
      disableTransitionOnChange={false}
      storageKey="theme-preference"
    >
      {children}
    </NextThemesProvider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <CustomThemeProvider>
      {children}
    </CustomThemeProvider>
  );
}

'use client';

import { useEffect, useState } from 'react';

export function useTimeBasedTheme() {
  const [timeBasedTheme, setTimeBasedTheme] = useState<'light' | 'dark'>('light');

  const updateTimeBasedTheme = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Light mode from 7 AM (7) to 7 PM (19)
    // Dark mode from 7 PM (19) to 7 AM (7)
    const isLightTime = hour >= 7 && hour < 19;
    setTimeBasedTheme(isLightTime ? 'light' : 'dark');
  };

  useEffect(() => {
    // Set initial theme based on current time
    updateTimeBasedTheme();

    // Update theme every minute to catch time changes
    const interval = setInterval(updateTimeBasedTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return timeBasedTheme;
}

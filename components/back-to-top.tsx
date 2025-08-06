'use client';

import { useState, useEffect } from 'react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 group p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-blue-500/25 focus:outline-none focus:ring-4 focus:ring-blue-500/30 min-touch-target"
          aria-label="Back to top"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
          
          {/* Arrow icon */}
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>

          {/* Tooltip */}
          <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg backdrop-blur-sm">
              Back to top
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
            </div>
          </div>

          {/* Ripple effect on click */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
        </button>
      )}
    </>
  );
}

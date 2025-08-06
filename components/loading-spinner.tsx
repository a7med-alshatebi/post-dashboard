'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'md':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      default:
        return 'h-8 w-8';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${getSizeClasses()}`}></div>
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
        )}
      </div>
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-sm mx-auto">
        <LoadingSpinner size="lg" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-4">{text}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Please wait while we fetch the data...</p>
      </div>
    </div>
  );
}

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fill?: boolean;
}

function LoadingSpinner({ 
  size = 'md', 
  className = '',
  fill = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex justify-center items-center ${fill ? 'min-h-[60vh] w-full' : ''} ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600`}
      />
    </div>
  );
}

export default LoadingSpinner; 
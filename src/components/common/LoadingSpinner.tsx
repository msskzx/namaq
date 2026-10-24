'use client';

import React from 'react';
import { LoaderCircle } from 'lucide-react';
import { useLanguage } from '../language/LanguageContext';

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
  const { language } = useLanguage();
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex justify-center items-center ${fill ? 'min-h-[60vh] w-full' : ''} ${className}`}>
      <span role="status" className="text-[var(--home-accent)]">
        <LoaderCircle aria-hidden className={`${sizeClasses[size]} motion-safe:animate-spin`} />
        <span className="sr-only">{language === 'ar' ? 'جارٍ التحميل' : 'Loading'}</span>
      </span>
    </div>
  );
}

export default LoadingSpinner; 
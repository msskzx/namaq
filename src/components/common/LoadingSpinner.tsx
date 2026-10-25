'use client';

import React from 'react';
import { useLanguage } from '../language/LanguageContext';
import InkLoader, { type InkLoaderVariant } from './InkLoader';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fill?: boolean;
  variant?: InkLoaderVariant;
}

function LoadingSpinner({ 
  size = 'md', 
  className = '',
  fill = false,
  variant = 'tree',
}: LoadingSpinnerProps) {
  const { language } = useLanguage();
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-24',
    lg: 'h-32',
  };

  return (
    <div className={`flex justify-center items-center ${fill ? 'min-h-[60vh] w-full' : ''} ${className}`}>
      <span role="status">
        <InkLoader variant={variant} className={fill ? 'h-56 w-auto' : `${sizeClasses[size]} w-auto`} />
        <span className="sr-only">{language === 'ar' ? 'جارٍ التحميل' : 'Loading'}</span>
      </span>
    </div>
  );
}

export default LoadingSpinner; 

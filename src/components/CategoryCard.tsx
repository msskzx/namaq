import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: IconDefinition | string;
  color: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  color,
  href,
  onClick,
  className = ""
}) => {
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      indigo: 'text-indigo-600 dark:text-indigo-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
      blue: 'text-blue-600 dark:text-blue-400',
      orange: 'text-orange-600 dark:text-orange-400',
      red: 'text-red-600 dark:text-red-400'
    };
    return colorMap[color] || colorMap.indigo;
  };

  const renderIcon = () => {
    if (typeof icon === 'string') {
      return <i className={`${icon} text-2xl mr-3 text-gray-700`}></i>;
    } else {
      return <FontAwesomeIcon icon={icon} className={`w-6 h-6 mr-3 ${getColorClasses(color)}`} />;
    }
  };

  const cardContent = (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-center cursor-pointer h-28 sm:h-32 flex flex-col justify-center hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 ${className}`}>
      <div className="flex items-center justify-center mb-2 sm:mb-4">
        {renderIcon()}
        <h4 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {title}
        </h4>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 px-2">
        {description}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick}>
        {cardContent}
      </div>
    );
  }

  return cardContent;
};

export default CategoryCard; 
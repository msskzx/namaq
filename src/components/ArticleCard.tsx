import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
  language: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, language }) => {
  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
      green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
      red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
    };
    return colorMap[color] || colorMap.indigo;
  };

  return (
    article.available ? (
      <Link href={article.href} className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <div className="p-4 sm:p-6">
          {/* Title with Icon */}
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${getColorClasses(article.color)}`}>
              <FontAwesomeIcon icon={article.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              {language === 'ar' ? article.titleAr : article.title}
            </h3>
          </div>
          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
            {language === 'ar' ? article.descriptionAr : article.description}
          </p>
        </div>
      </Link>
    ) : (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed">
        <div className="p-4 sm:p-6">
          {/* Title with Icon */}
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${getColorClasses(article.color)}`}>
              <FontAwesomeIcon icon={article.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              {language === 'ar' ? article.titleAr : article.title}
            </h3>
          </div>
          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
            {language === 'ar' ? article.descriptionAr : article.description}
          </p>
        </div>
      </div>
    )
  );
};

export default ArticleCard; 
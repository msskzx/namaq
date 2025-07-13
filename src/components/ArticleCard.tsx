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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
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

        {/* Action Button */}
        {article.available ? (
          <Link
            href={article.href}
            className="inline-flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base"
          >
            {language === 'ar' ? 'ابدأ التعلم' : 'Start Learning'}
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center w-full bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-medium py-2 px-4 rounded-lg cursor-not-allowed text-sm sm:text-base"
          >
            {language === 'ar' ? 'قريباً' : 'Coming Soon'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ArticleCard; 
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';

function ArticleCard({ article }: { article: any }) {
  const { language } = useLanguage();
  if (!article || !article.slug) {
    return null;
  }
  return (
    <Link href={`/articles/${article.slug}`} className="block">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{language === 'ar' ? article.title : article.titleEn}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-0">{language === 'ar' ? article.summary : article.summaryEn}</p>
      </div>
    </Link>
  );
}

export default ArticleCard; 
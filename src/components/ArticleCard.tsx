import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { ArticleBase } from '@/types/article';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

function ArticleCard({ article }: { article: ArticleBase }) {
  const { language } = useLanguage();
  if (!article || !article.slug) {
    return null;
  }
  
  const href = article.special ? `/specials/${article.slug}` : `/articles/${article.slug}`;
  
  return (
    <Link href={href} className="block h-full">
      <div className="bg-gray-50 dark:bg-gray-900 border-l-4 border-amber-400 rounded-lg p-6 shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer h-full flex flex-col">
        {article.img && (
          <div className="overflow-hidden rounded-lg mb-4">
            <Image src={article.img} alt={article.title} className="w-full h-auto object-cover" />
          </div>
        )} 
        {article.special && (
          <div className="bg-amber-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 mb-3 self-start">
            <FontAwesomeIcon icon={faStar} className="w-3 h-3" />
            {language === 'ar' ? 'مميز' : 'Special'}
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4 text-amber-400 dark:text-amber-400">{language === 'ar' ? article.title : article.titleEn}</h2>
        <p className="text-gray-600 dark:text-gray-200 flex-grow">{language === 'ar' ? article.summary : article.summaryEn}</p>
      </div>
    </Link>
  );
}

export default ArticleCard; 
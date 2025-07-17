"use client";

import { useLanguage } from '@/components/LanguageContext';
import useSWR from 'swr';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useParams } from 'next/navigation';
import translations from '@/components/translations';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/types/article';

const fetcher = (url: string) => fetch(url).then(res => res.ok ? res.json() : null);

export default function CategoryDetailPage() {
  const { language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const { data: category, error, isLoading } = useSWR(slug ? `/api/categories/${slug}` : null, fetcher);

  return (
    <div className="container mx-auto py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {isLoading ? (
        <LoadingSpinner />
      ) : error || !category ? (
        <div className="text-red-600 dark:text-red-400 text-center my-8">
          {translations[language].categoriesLoadError}
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">{language === 'ar' ? category.name : category.nameEn || category.name}</h1>
          <p className="mb-6">{language === 'ar' ? category.description : category.descriptionEn || category.description}</p>
          {category.articles && category.articles.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">{translations[language].articlesInCategory}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {category.articles.map((article: Article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

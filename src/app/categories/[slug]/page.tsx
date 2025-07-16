"use client";

import { useLanguage } from '@/components/LanguageContext';
import useSWR from 'swr';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';
import { notFound } from 'next/navigation';
import translations from '@/components/translations';

const fetcher = (url: string) => fetch(url).then(res => res.ok ? res.json() : null);

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const { language } = useLanguage();
  const { data: category, error, isLoading } = useSWR(`/api/categories/${params.slug}`, fetcher);

  if (isLoading) return <LoadingSpinner />;
  if (error || !category) return notFound();

  return (
    <div className="container mx-auto py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold mb-4">{language === 'ar' ? category.name : category.nameEn || category.name}</h1>
      <p className="mb-6">{language === 'ar' ? category.description : category.descriptionEn || category.description}</p>
      {category.articles && category.articles.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{translations[language].articlesInCategory || (language === 'ar' ? 'المقالات في هذا التصنيف:' : 'Articles in this category:')}</h2>
          <ul className="list-disc pl-6">
            {category.articles.map((article: any) => (
              <li key={article.id}>
                <Link href={`/articles/${article.slug}`}>{language === 'ar' ? article.title : article.titleEn || article.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 
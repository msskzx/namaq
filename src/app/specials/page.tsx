"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import { Article } from "@/types/article";
import ArticleCard from "@/components/articles/ArticleCard";
import useSWR from 'swr';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SpecialsPage() {
  const { language } = useLanguage();
  const { data: specialArticles, error, isLoading } = useSWR<Article[]>("/api/articles?special=true", fetcher);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-arabicDisplay text-amber-400 text-3xl sm:text-4xl font-bold mb-4 text-center">
          {language === 'ar' ? 'مقالات مميزة' : 'Special Articles'}
        </h1>
        <p className="text-center text-black dark:text-gray-400 mb-8 text-base sm:text-lg font-arabic max-w-3xl mx-auto">
          {language === 'ar'
            ? 'في هذا القسم نقدم مقالات تفاعلية مصممة خصيصاً لتجربة تعلم فريدة. ستجد محتوى غني بالرسوم المتحركة، الإحصائيات، الأشكال التوضيحية، والتصاميم المبتكرة التي تساعدك على الفهم والتفاعل بشكل أفضل.'
            : 'In this section, we present custom-made articles focused on building interactive content for a unique learning experience. You will find content rich with animations, statistics, figures, and creative designs to help you understand and engage more deeply.'}
        </p>
        {/* Special Articles Section */}
        <div className="mt-8">
          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4">
              {language === 'ar' ? 'حدث خطأ في تحميل المقالات' : 'Error loading articles'}
            </div>
          )}
          {isLoading || !specialArticles ? (
            <LoadingSpinner />
          ) : (
            <>
              {Array.isArray(specialArticles) && specialArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {specialArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 font-arabic">
                    {language === 'ar' ? 'لا توجد مقالات مميزة حالياً' : 'No special articles available at the moment'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
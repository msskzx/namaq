"use client";

import useSWR from "swr";
import ArticleCard from "@/components/articles/ArticleCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Article } from "@/types/article";
import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";
import Link from "next/link";
import ErrorMessage from "@/components/common/ErrorMessage";
import { fetcher } from "@/lib/swr";

export default function SpecialsHighlights() {
  const { data: specialArticles, error: specialArticlesError, isLoading: specialArticlesLoading } = useSWR<Article[]>("/api/articles?special=true&limit=4", fetcher);
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="mx-auto my-12">
      <h2 className="font-arabicDisplay text-gray-900 dark:text-gray-200 text-2xl sm:text-3xl font-bold mb-6 text-center">
        {t.specialArticles}
      </h2>
      <p className="text-center text-gray-800 dark:text-gray-200 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto leading-relaxed">
        {language === 'ar'
          ? 'في هذا القسم نقدم مقالات تفاعلية مصممة خصيصاً لتجربة تعلم فريدة. ستجد محتوى غني بالرسوم المتحركة، الإحصائيات، الأشكال التوضيحية، والتصاميم المبتكرة التي تساعدك على الفهم والتفاعل بشكل أفضل.'
          : 'In this section, we present custom-made articles focused on building interactive content for a unique learning experience. You will find content rich with animations, statistics, figures, and creative designs to help you understand and engage more deeply.'}
      </p>
      <div className="text-center mb-8">
        <Link href="/specials" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
          {language === 'ar' ? 'عرض جميع المقالات المميزة' : 'View All Special Articles'}
        </Link>
      </div>
      {specialArticlesError && <ErrorMessage title={translations[language].articlesLoadError} />}
      {specialArticlesLoading || !specialArticles ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.isArray(specialArticles) && specialArticles.length > 0 ? (
              specialArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <div className="col-span-full text-center py-4 text-gray-400 font-arabic text-base md:text-lg">
                {t.noArticles}
              </div>
            )}
          </div>
        </>
      )}
    </div>

  );
}
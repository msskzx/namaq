"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import ArticleCard from '@/components/ArticleCard';
import useSWR from 'swr';
import LoadingSpinner from '../components/LoadingSpinner';
import { Article } from '@/types/article';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import NamaqSlider from '@/components/homepage/NamaqSlider';
import Image from 'next/image';
import TheTen from "@/components/people/TheTen";
import Exploration from "@/components/homepage/Exploration";
import PersonCard from "@/components/people/PersonCard";
import GraphCanvas from "@/components/graph/GraphCanvas";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];
  // Add ?limit=3 to the API request
  const { data: specialArticles, error: specialArticlesError, isLoading: specialArticlesLoading } = useSWR<Article[]>("/api/articles?special=true&limit=4", fetcher);
  const { data: prophet, error: prophetError, isLoading: prophetLoading } = useSWR('/api/people/prophet-muhammad', (url) => fetch(url).then(res => res.json()));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-x-hidden">
      {/* Geometric SVG background overlay (add your SVG in public/arabesque-pattern.svg) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'url(/gemini-arabesque.png)', backgroundRepeat: 'repeat' }} />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-gray-900 dark:text-gray-200 flex flex-col justify-center">
            <h1 className="text-5xl text-center font-Cairo">
              {language === 'ar' ? (
                <>
                  <span className="text-indigo-300">تعلَّم</span> من خلال المقالات{' '}<br></br>
                  <span className="text-blue-300">التفاعلية</span> والاستكشافات{' '}<br></br>
                  <span>المعتمدة على</span>{' '}
                  <span className="text-amber-400">البيانات</span>
                </>
              ) : (
                <>
                  <span className="text-indigo-300">Learn</span> Through{' '}
                  <br></br>
                  <span className="text-blue-300">Interactive</span> Visual Articles{' '}
                  <br></br>
                  &amp; <span className="text-amber-300">Data-Driven</span> Explorations
                </>
              )}
            </h1>
            <p className="text-center text-gray-800 dark:text-gray-200 text-2xl mt-8">{t.intro}</p>
            <div className="text-center mt-8">
              <Link href="/articles?special=true" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
                {language === 'ar' ? 'المقالات المميزة' : 'Special Articles'}
              </Link>
            </div> 
          </div>
          <div className="w-full h-full min-h-[500px]">
            <Image src="/arabic_language.png" alt="Arabic Language" className="w-full h-full rounded-2xl" width={500} height={500} />
          </div>
        </div>


        {/* Namaq Definition Section */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 my-12 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-3 lg:grid-cols-3 gap-8">

            <div className="col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border-l-4 border-rose-800 p-6 h-full flex flex-col">
                <h4 className="font-arabicDisplay text-amber-400 text-xl md:text-2xl font-bold mb-3 text-center" dir="rtl">
                  {t.verbNammaq.verb}
                </h4>
                <p className="font-arabic text-gray-900 dark:text-gray-200 text-base md:text-lg leading-relaxed text-center mb-4 flex-grow" dir="rtl">
                  {t.verbNammaq.definition}
                </p>
                <div className="space-y-2 mt-2">
                  {t.verbNammaq.forms.map((form, index) => (
                    <p key={index} className="font-arabic text-gray-700 dark:text-gray-200 text-sm md:text-base text-center" dir="rtl">
                      {form}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <NamaqSlider />
            </div>

            <div className="col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border-l-4 border-rose-800 p-6 h-full flex flex-col">
                <h4 className="font-arabicDisplay text-amber-400 text-xl md:text-2xl font-bold mb-3 text-center" dir="rtl">
                  {t.verbNamaq.verb}
                </h4>
                <p className="font-arabic text-gray-900 dark:text-gray-200 text-base md:text-lg leading-relaxed text-center mb-4 flex-grow" dir="rtl">
                  {t.verbNamaq.definition}
                </p>
                <div className="space-y-2 mt-2">
                  {t.verbNamaq.forms.map((form, index) => (
                    <p key={index} className="font-arabic text-gray-700 dark:text-gray-200 text-sm md:text-base text-center" dir="rtl">
                      {form}
                    </p>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Special Articles Section */}
        <div className="mx-auto my-12">
          <h2 className="font-arabicDisplay text-gray-900 dark:text-gray-200 text-2xl sm:text-3xl font-bold mb-6 text-center">
            {t.specialArticles}
          </h2>
          <p className="text-center text-gray-800 dark:text-gray-200 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'في هذا القسم نقدم مقالات تفاعلية مصممة خصيصاً لتجربة تعلم فريدة. ستجد محتوى غني بالرسوم المتحركة، الإحصائيات، الأشكال التوضيحية، والتصاميم المبتكرة التي تساعدك على الفهم والتفاعل بشكل أفضل.'
              : 'In this section, we present custom-made articles focused on building interactive content for a unique learning experience. You will find content rich with animations, statistics, figures, and creative designs to help you understand and engage more deeply.'}
          </p>
          {specialArticlesError && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4 text-sm md:text-base">
              {translations[language].articlesLoadError}
            </div>
          )}
          {specialArticlesLoading || !specialArticles ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              {Array.isArray(specialArticles) && specialArticles.length > 0 && (
                <div className="text-center">
                  <Link href="/articles?special=true" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
                    {language === 'ar' ? 'عرض جميع المقالات المميزة' : 'View All Special Articles'}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Notable People Section */}
        <div>
          <h2 className="font-arabicDisplay text-gray-900 dark:text-gray-200 text-2xl sm:text-3xl font-bold mb-6 text-center">
            {t.notablePeople}
          </h2>
          <p className="text-center text-gray-800 dark:text-gray-200 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'استكشف حياة النبي محمد ﷺ والصحابة الكرام من خلال الجداول الزمنية والرسوم المتحركة والشخصيات التوضيحية، مما يجعل من التعلم تجربة فريدة.'
              : 'Explore the lives and events of the Prophet Muhammad and his noble Companions through clear timelines, animations, and interactive figures, making learning a unique experience.'}
          </p>
          {prophetError && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4 text-sm md:text-base">
              {language === 'ar' ? 'حدث خطأ في تحميل بيانات النبي' : 'Error loading Prophet data'}
            </div>
          )}
          {prophetLoading ? (
            <LoadingSpinner />
          ) : (
          
          <div className="mx-auto">
            <PersonCard person={prophet} language={language} />
          </div>
          )}
          <TheTen />
        </div>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Relation Graph Feature Section */}
        <div className="mx-auto my-12">
          <h2 className="font-arabicDisplay text-gray-900 dark:text-gray-200 text-2xl sm:text-3xl font-bold mb-6 text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {t.familyRelations}
          </h2>
          <p className="text-center text-gray-800 dark:text-indigo-100 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {language === 'ar'
              ? 'استكشف العلاقات العائلية للنبي محمد ﷺ وجميع الصحابة والأنبياء من خلال رسم بياني تفاعلي يوضح الأبناء، البنات، الأزواج، الأقارب وغيرهم. هذه الميزة متوفرة لكل شخصية في الموقع.'
              : 'Explore the family and relation graph of Prophet Muhammad ﷺ and all companions and prophets through an interactive diagram showing children, d more. This feature is available for every person on the site.'}
          </p>
          <GraphCanvas url="/api/graph" />
        </div>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Exploration Section */}
        <Exploration />

        {/* Disclaimer Badge */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border-l-4 border-rose-800 p-6 flex flex-col items-center" role="alert">
            <div className="flex">
              <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-rose-800 dark:text-rose-800" />
              <div className="mr-3 rtl:mr-0 rtl:ml-3">
                <p className="text-sm">
                  {language === 'ar' 
                    ? 'هذا المشروع قيد التطوير والبيانات المعروضة غير مراجعة بالكامل وهي لأغراض توضيحية فقط!' 
                    : 'This project is a work in progress. The data shown is not thoroughly reviewed and is only for demonstration purposes!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
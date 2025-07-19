"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import CategoryCard from '@/components/CategoryCard';
import ArticleCard from '@/components/ArticleCard';
import useSWR from 'swr';
import LoadingSpinner from '../components/LoadingSpinner';
import { Category } from '@/types/category';
import { Article } from '@/types/article';
import MotivationCard from '@/components/MotivationCard';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMosque, faUsers, faShieldAlt, faFileAlt, faThLarge, faPenNib, faCrown, faBook, faQuoteRight } from '@fortawesome/free-solid-svg-icons';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { language } = useLanguage();
  // Add ?limit=3 to the API request
  const { data: categories, error, isLoading } = useSWR<Category[]>("/api/categories?limit=3", fetcher);
  const { data: articles, error: articlesError, isLoading: articlesLoading } = useSWR<Article[]>("/api/articles?limit=3", fetcher);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-x-hidden">
      {/* Geometric SVG background overlay (add your SVG in public/arabesque-pattern.svg) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'url(/gemini-arabesque.png)', backgroundRepeat: 'repeat' }} />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Name Section */}
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="font-arabicDisplay text-amber-400 text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 drop-shadow-lg tracking-wide">
            {translations[language].title}
          </h1>
          <p className="font-arabic text-gray-100 text-lg sm:text-2xl mb-4">
            {translations[language].intro}
          </p>
        </header>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Definition Section */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Noun Card */}
          <div className="bg-gray-100 dark:bg-indigo-950 rounded-2xl shadow-lg border-r-4 border-rose-800 p-6 flex flex-col items-center">
            <h4 className="font-arabicDisplay text-amber-400 text-2xl mb-3 text-center" dir="rtl">
              {translations[language].nounTitle}
            </h4>
            <p className="font-arabic text-gray-800 dark:text-gray-100 text-lg leading-relaxed text-center" dir="rtl">
              {translations[language].nounDefinition}
            </p>
          </div>
          {/* Verb Card */}
          <div className="bg-gray-100 dark:bg-indigo-950 rounded-2xl shadow-lg border-l-4 border-rose-800 p-6 flex flex-col items-center">
            <h4 className="font-arabicDisplay text-amber-400 text-2xl mb-3 text-center" dir="rtl">
              {translations[language].verbTitle}
            </h4>
            <p className="font-arabic text-gray-800 dark:text-gray-100 text-lg leading-relaxed text-center mb-3" dir="rtl">
              {translations[language].verbDefinition}
            </p>
            <div className="space-y-2">
              {translations[language].verbForms.map((form, index) => (
                <p key={index} className="font-arabic text-gray-700 dark:text-gray-200 text-center text-base" dir="rtl">
                  {form}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Motivation Section */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
          <h2 className="font-arabicDisplay text-amber-400 text-3xl font-bold mb-6 text-center">
            {language === 'ar' ? 'ابدأ رحلتك التعليمية' : 'Start Your Learning Journey'}
          </h2>
          <p className="text-center text-gray-200 mb-8 text-base sm:text-lg font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'استكشف هذه الأقسام المتنوعة لتبدأ رحلتك الشاملة في تعلم اللغة العربية وفهم التاريخ الإسلامي والثقافة الإسلامية. من دراسة حياة النبي محمد ﷺ وأصحابه الكرام إلى استكشاف المعارك التاريخية المهمة، ومن قراءة المقالات التعليمية إلى التعمق في الشعر العربي والأدب الإسلامي. كل قسم مصمم لمساعدتك على بناء أساس قوي في اللغة والثقافة الإسلامية بطريقة تفاعلية وممتعة.'
              : 'Explore these diverse sections to begin your comprehensive journey in learning Arabic and understanding Islamic history and culture. From studying the life of Prophet Muhammad ﷺ and his noble companions to exploring important historical battles, from reading educational articles to delving into Arabic poetry and Islamic literature. Each section is designed to help you build a strong foundation in Arabic language and Islamic culture in an interactive and enjoyable way.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <MotivationCard
              icon={<FontAwesomeIcon icon={faMosque} className="w-10 h-10 text-cyan-500" />}
              title={translations[language].motivation.prophet.title}
              desc={translations[language].motivation.prophet.desc}
              url="/people/prophet-muhammad"
              color="text-cyan-500"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faUsers} className="w-10 h-10 text-indigo-400" />}
              title={translations[language].motivation.companions.title}
              desc={translations[language].motivation.companions.desc}
              url="/people?title=companion"
              color="text-indigo-400"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faShieldAlt} className="w-10 h-10 text-red-400" />}
              title={translations[language].motivation.battles.title}
              desc={translations[language].motivation.battles.desc}
              url="/battles"
              color="text-red-400"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faFileAlt} className="w-10 h-10 text-blue-600" />}
              title={translations[language].motivation.articles.title}
              desc={translations[language].motivation.articles.desc}
              url="/articles"
              color="text-blue-600"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faThLarge} className="w-10 h-10 text-green-600" />}
              title={translations[language].motivation.categories.title}
              desc={translations[language].motivation.categories.desc}
              url="/categories"
              color="text-green-600"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faPenNib} className="w-10 h-10 text-purple-600" />}
              title={translations[language].motivation.poems.title}
              desc={translations[language].motivation.poems.desc}
              url="/poems"
              color="text-purple-600"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faCrown} className="w-10 h-10 text-yellow-600" />}
              title={translations[language].motivation.titles.title}
              desc={translations[language].motivation.titles.desc}
              url="/titles"
              color="text-yellow-600"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faBook} className="w-10 h-10 text-emerald-600" />}
              title={translations[language].motivation.quran.title}
              desc={translations[language].motivation.quran.desc}
              url="/quran"
              color="text-emerald-600"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faQuoteRight} className="w-10 h-10 text-rose-600" />}
              title={translations[language].motivation.hadith.title}
              desc={translations[language].motivation.hadith.desc}
              url="/hadith"
              color="text-rose-600"
            />
          </div>
        </div>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Category Cards Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="font-arabicDisplay text-amber-400 text-2xl font-bold mb-6 text-center">
            {translations[language].categories}
          </h2>
          <p className="text-center text-gray-200 mb-8 text-base sm:text-lg font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'تصفح مقالاتنا المنظمة حسب الموضوعات المختلفة لتسهيل رحلتك التعليمية. اختر التصنيف الذي يهمك لاستكشاف المحتوى المرتبط باللغة العربية والنحو والصرف والتاريخ الإسلامي والثقافة. كل تصنيف يحتوي على مجموعة من المقالات المختارة بعناية لمساعدتك على التعلم بطريقة منظمة ومتسلسلة.'
              : 'Browse our articles organized by different topics to facilitate your learning journey. Choose the category that interests you to explore content related to Arabic language, grammar, morphology, Islamic history, and culture. Each category contains a carefully selected collection of articles to help you learn in an organized and sequential manner.'}
          </p>
          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4">
              {translations[language].categoriesLoadError}
            </div>
          )}
          {isLoading || !categories ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-4 text-gray-400 font-arabic">
                    {translations[language].categoriesNotFound}
                  </div>
                )}
              </div>
              <div className="text-center">
                <Link href="/categories" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl">
                  {language === 'ar' ? 'عرض جميع التصنيفات' : 'View All Categories'}
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Articles Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="font-arabicDisplay text-amber-400 text-2xl font-bold mb-6 text-center">
            {translations[language].articles}
          </h2>
          <p className="text-center text-gray-200 mb-8 text-base sm:text-lg font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'اقرأ أحدث المقالات المكتوبة بعناية فائقة حول اللغة العربية والنحو والصرف والتاريخ الإسلامي والثقافة الإسلامية. اكتشف رؤى جديدة وتعمق في معرفتك من خلال محتوى غني ومتنوع يغطي مواضيع مختلفة من أساسيات اللغة العربية إلى القصص التاريخية العميقة. كل مقال مصمم لمساعدتك على فهم أفضل للغة والثقافة الإسلامية.'
              : 'Read our latest carefully crafted articles about Arabic language, grammar, morphology, Islamic history, and Islamic culture. Discover new insights and deepen your knowledge through rich and diverse content covering various topics from Arabic language fundamentals to deep historical narratives. Each article is designed to help you gain a better understanding of the language and Islamic culture.'}
          </p>
          {articlesError && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4">
              {translations[language].articlesLoadError}
            </div>
          )}
          {articlesLoading || !articles ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Array.isArray(articles) && articles.length > 0 ? (
                  articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-4 text-gray-400 font-arabic">
                    {translations[language].articlesNotFound}
                  </div>
                )}
              </div>
              <div className="text-center">
                <Link href="/articles" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl">
                  {language === 'ar' ? 'عرض جميع المقالات' : 'View All Articles'}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

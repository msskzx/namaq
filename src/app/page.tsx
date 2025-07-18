"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import CategoryCard from '@/components/CategoryCard';
import useSWR from 'swr';
import LoadingSpinner from '../components/LoadingSpinner';
import { Category } from '@/types/category';
import MotivationCard from '@/components/MotivationCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMosque, faUsers, faShieldAlt, faFileAlt, faThLarge, faPenNib } from '@fortawesome/free-solid-svg-icons';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { language } = useLanguage();
  // Add ?limit=3 to the API request
  const { data: categories, error, isLoading } = useSWR<Category[]>("/api/categories?limit=3", fetcher);

  return (
    <div className="min-h-screen bg-indigo-950 relative overflow-x-hidden">
      {/* Geometric SVG background overlay (add your SVG in public/arabesque-pattern.svg) */}
      {/* <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'url(/arabesque-pattern.svg)', backgroundRepeat: 'repeat' }} /> */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Hero Section */}
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

        {/* Definition Cards */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Noun Card */}
          <div className="bg-gray-100 dark:bg-indigo-800 rounded-2xl shadow-lg border-l-4 border-amber-400 p-6 flex flex-col items-center">
            <h4 className="font-arabicDisplay text-amber-400 text-2xl mb-3 text-center" dir="rtl">
              {translations[language].nounTitle}
            </h4>
            <p className="font-arabic text-gray-800 dark:text-gray-100 text-lg leading-relaxed text-center" dir="rtl">
              {translations[language].nounDefinition}
            </p>
          </div>
          {/* Verb Card */}
          <div className="bg-gray-100 dark:bg-indigo-800 rounded-2xl shadow-lg border-l-4 border-amber-400 p-6 flex flex-col items-center">
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
          <p className="text-center text-gray-200 mb-6 text-base sm:text-lg font-arabic">
            {language === 'ar'
              ? 'استكشف هذه الأقسام لتبدأ رحلتك في تعلم العربية وفهم التاريخ والثقافة الإسلامية.'
              : 'Explore these sections to begin your journey learning Arabic and understanding Islamic history and culture.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <MotivationCard
              icon={<FontAwesomeIcon icon={faMosque} className="w-10 h-10 text-amber-400" />}
              title={translations[language].motivation.prophet.title}
              desc={translations[language].motivation.prophet.desc}
              url="/people/prophet-muhammad"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faUsers} className="w-10 h-10 text-amber-400" />}
              title={translations[language].motivation.companions.title}
              desc={translations[language].motivation.companions.desc}
              url="/people?title=companion"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faShieldAlt} className="w-10 h-10 text-amber-400" />}
              title={translations[language].motivation.battles.title}
              desc={translations[language].motivation.battles.desc}
              url="/battles"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faFileAlt} className="w-10 h-10 text-amber-400" />}
              title={translations[language].motivation.articles.title}
              desc={translations[language].motivation.articles.desc}
              url="/articles"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faThLarge} className="w-10 h-10 text-amber-400" />}
              title={translations[language].motivation.categories.title}
              desc={translations[language].motivation.categories.desc}
              url="/categories"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faPenNib} className="w-10 h-10 text-amber-400" />}
              title={translations[language].motivation.poems.title}
              desc={translations[language].motivation.poems.desc}
              url="/poems"
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
          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4">
              {translations[language].categoriesLoadError}
            </div>
          )}
          {isLoading || !categories ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      </div>
    </div>
  );
}

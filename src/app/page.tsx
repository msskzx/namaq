"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import { faBook, faMosque, faPen, faLandmark, faDove, faFilm } from '@fortawesome/free-solid-svg-icons';
import CategoryCard from '@/components/CategoryCard';

export default function Home() {
  const { language } = useLanguage();

  const cards = [
    {
      title: translations[language].arabicLanguage,
      description: translations[language].arabicLanguageDesc,
      icon: faBook,
      iconColor: 'indigo',
      href: '/arabic'
    },
    {
      title: translations[language].islamicHistory,
      description: translations[language].islamicHistoryDesc,
      icon: faMosque,
      iconColor: 'green',
      href: '/history'
    },
    {
      title: translations[language].grammarMastery,
      description: translations[language].grammarMasteryDesc,
      icon: faPen,
      iconColor: 'purple',
      href: '/grammar'
    },
    {
      title: translations[language].culturalHeritage,
      description: translations[language].culturalHeritageDesc,
      icon: faLandmark,
      iconColor: 'orange',
      href: '/about'
    },
    {
      title: translations[language].spiritualGrowth,
      description: translations[language].spiritualGrowthDesc,
      icon: faDove,
      iconColor: 'blue',
      href: '/prophet'
    },
    {
      title: translations[language].interactiveLearning,
      description: translations[language].interactiveLearningDesc,
      icon: faFilm,
      iconColor: 'red',
      href: '/practice'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header with Namaq in English and Arabic */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4">
            {translations[language].title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 px-4">
            {translations[language].intro}
          </p>
        </header>

        {/* Definition Cards */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Noun Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 text-center" dir="rtl">
                {translations[language].nounTitle}
              </h4>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center" dir="rtl">
                {translations[language].nounDefinition}
              </p>
            </div>

            {/* Verb Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 text-center" dir="rtl">
                {translations[language].verbTitle}
              </h4>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center mb-3 sm:mb-4" dir="rtl">
                {translations[language].verbDefinition}
              </p>
              <div className="space-y-1 sm:space-y-2">
                {translations[language].verbForms.map((form, index) => (
                  <p key={index} className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center" dir="rtl">
                    {form}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Categories */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6 sm:mb-8 px-4">
            {translations[language].whyLearn}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cards.map((card, index) => (
              <CategoryCard
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                color={card.iconColor}
                href={card.href}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

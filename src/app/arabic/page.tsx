"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";

export default function LearnPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-indigo-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 dark:text-white mb-3 sm:mb-4">
            {translations[language].learn}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto px-4">
            {translations[language].arabicLanguageDesc}
          </p>
        </header>

        {/* TODO get Articles with arabic category */}

        {/* Coming Soon Notice */}
        <div className="max-w-4xl mx-auto mt-8 sm:mt-12">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 sm:p-6 border border-amber-400 dark:border-indigo-900">
            <h3 className="text-base sm:text-lg font-semibold text-amber-400 dark:text-indigo-200 mb-2">
              {language === 'ar' ? 'المزيد من المحتوى قادم' : 'More Content Coming Soon'}
            </h3>
            <p className="text-sm sm:text-base text-indigo-600 dark:text-indigo-300">
              {language === 'ar' 
                ? 'نحن نعمل على إضافة المزيد من الدروس والتمارين التفاعلية لمساعدتك في تعلم العربية'
                : 'We are working on adding more lessons and interactive exercises to help you learn Arabic'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
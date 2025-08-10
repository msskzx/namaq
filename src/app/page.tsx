"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import TheTen from "@/components/people/TheTen";
import Exploration from "@/components/homepage/Exploration";
import GraphCanvas from "@/components/graph/GraphCanvas";
import SpecialsHighlights from "@/components/articles/SpecialsHighlights";
import Hero from "@/components/homepage/Hero";
import NamaqDefinition from "@/components/homepage/NamaqDefinition";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-x-hidden">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>

        <Hero />

        <NamaqDefinition />

        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />
        <SpecialsHighlights />

        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />
        <TheTen />

        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />
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

        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />
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
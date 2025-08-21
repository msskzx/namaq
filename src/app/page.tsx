"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Exploration from "@/components/homepage/Exploration";
import Hero from "@/components/homepage/Hero";

export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-x-hidden">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>

        <Hero />

        <Exploration />

        {/* Disclaimer Badge */}
        <div className="z-10 mt-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
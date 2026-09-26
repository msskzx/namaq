"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/common/Button";
import { useLanguage } from "@/components/language/LanguageContext";
import NamaqDefinition from "@/components/homepage/NamaqDefinition";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-4">
          {language === 'ar' ? 'عن نمَق' : 'About Namaq'}
        </h1>
        <p className="text-center text-gray-800 dark:text-gray-200 text-lg max-w-3xl mx-auto mb-10">
          {language === 'ar'
            ? 'نمَق تطبيق تعليمي يركز على اللغة العربية لفهم الشخصيات والعلاقات والأحداث الكبرى في التاريخ الإسلامي المبكر من خلال استكشاف بصري.'
            : 'Namaq is an Arabic-first historical learning application for understanding the people, relationships, and major events of early Islamic history through visual exploration.'}
        </p>

        <NamaqDefinition />

        <section className="mt-12 rounded-lg border border-gray-200 p-6 dark:border-white/10">
          <h2 className="mb-2 text-3xl text-gray-900 dark:text-gray-100">
            <FontAwesomeIcon icon={faBookmark} className="w-7 h-7 text-amber-500 me-2" />
            {language === 'ar' ? 'المراجع' : 'References'}
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {language === 'ar'
              ? 'المصادر التي اعتمدنا عليها في بناء نمق ومحتواه التاريخي.'
              : 'Sources used to build Namaq and its historical content.'}
          </p>
          <Button href="/references">
            <FontAwesomeIcon icon={faBookmark} />
            {language === 'ar' ? 'عرض المراجع' : 'View references'}
          </Button>
        </section>
      </div>
    </div>
  );
}

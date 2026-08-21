"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import NamaqDefinition from "@/components/homepage/NamaqDefinition";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
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
      </div>
    </div>
  );
}

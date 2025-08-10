"use client";

import GraphCanvas from "@/components/graph/GraphCanvas";
import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";

export default function GraphPage() {
    const { language } = useLanguage();
    const t = translations[language];
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center my-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>{t.familyRelations}</h1>
            <p className="text-center text-gray-800 dark:text-indigo-100 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {language === 'ar'
              ? 'استكشف العلاقات العائلية للنبي محمد ﷺ وجميع الصحابة والأنبياء من خلال رسم بياني تفاعلي يوضح الأبناء، البنات، الأزواج، الأقارب وغيرهم. هذه الميزة متوفرة لكل شخصية في الموقع.'
              : 'Explore the family and relation graph of Prophet Muhammad ﷺ and all companions and prophets through an interactive diagram showing children, d more. This feature is available for every person on the site.'}
            </p>
            <GraphCanvas url="/api/graph" />
        </div>
    );
}
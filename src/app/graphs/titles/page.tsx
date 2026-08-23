"use client";

import GraphCanvas from "@/components/graph/GraphCanvas";
import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";

export default function TitlesGraphPage() {
    const { language } = useLanguage();
    const t = translations[language];
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center my-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>{t.titlesGraph}</h1>
            <p className="text-center text-gray-800 dark:text-indigo-100 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {language === 'ar'
                    ? 'استكشف الألقاب التي حملها الصحابة من خلال رسم بياني تفاعلي يربط كل لقب بمن حمله من الشخصيات.'
                    : 'Explore the titles held by companions through an interactive diagram linking every title to the people who carried it.'}
            </p>
            <GraphCanvas url="/api/graph/titles" showSearch={false} nodeSearch targetSlug="" nodesLabel="titles & people" />
        </div>
    );
}

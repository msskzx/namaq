"use client";

import GraphCanvas from "@/components/graph/GraphCanvas";
import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";

// One page, one dataset (GET /api/graph), one set of controls. "People
// only" / "titles" / "battles" / "everything" aren't separate views or
// routes -- they're just the node-kind filter (see GraphCanvas's Node
// Kinds toggles) narrowed to whichever kinds you want, via `kind` in the
// URL (e.g. ?kind=person&kind=battle). /graphs/people, /graphs/titles, and
// /graphs/battles redirect here with the equivalent `kind` filter already
// applied, for old links/bookmarks.
export default function GraphPage() {
    const { language } = useLanguage();
    const t = translations[language];
    const isArabic = language === "ar";

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center my-4" dir={isArabic ? "rtl" : "ltr"}>{t.allGraph}</h1>
            <p className="text-center text-gray-800 dark:text-indigo-100 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto" dir={isArabic ? "rtl" : "ltr"}>
                {isArabic
                    ? "استكشف شبكة الموقع من خلال رسم بياني تفاعلي واحد يجمع الأشخاص والألقاب والمعارك والأحداث وكل العلاقات بينها. استخدم أدوات البحث والتصفية أدناه لعرض ما تريد بالضبط."
                    : "Explore the site's network in one interactive diagram, combining people, titles, battles, and events together with every relationship between them. Use the search and filters below to narrow it down to exactly what you want."}
            </p>
            <GraphCanvas url="/api/graph" showSearch targetSlug="prophet-muhammad" nodesLabel="nodes" />
        </div>
    );
}

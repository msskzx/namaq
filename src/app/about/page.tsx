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
          <div className="mb-4 space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              {language === 'ar'
                ? 'المصادر التي اعتمدنا عليها في بناء نمق ومحتواه التاريخي. نستمد الشخصيات والأحداث من كتاب «سير أعلام النبلاء» للذهبي، ونحفظ نص كل ترجمة صفحةً صفحةً من نسخ رقمية منشورة، فيُحال كل ما يُعرض في الصفحة الشخصية إلى الصفحة التي أُخذ منها.'
                : 'The sources used to build Namaq and its historical content. People and events are drawn from Siyar A‘lam al-Nubala’ by al-Dhahabi. The text of each entry is kept page by page from published digital editions, and every fact on a profile points to the page it was taken from.'}
            </p>
            <p>
              {language === 'ar'
                ? 'تُضاف المعلومات على دفعات، ولا تُنشر الدفعة إلا بعد اعتمادها. ويحمل كل ادعاء حالة مراجعة (لم يُراجع، قيد المراجعة، تمت مراجعته) ليعرف القارئ مدى التحقق منه. وبعض القيم جاءت من ملاحظات سابقة بلا إحالات، فهي موسومة وتُطابَق مع نص الكتاب كلما بلغتها دفعة جديدة.'
                : 'Information is added in batches, and a batch is published only after it is approved. Each claim carries a review status (Not reviewed, In review or Reviewed), so readers can see how far it has been checked. Some values came from earlier notes with no citations; they are marked, and they are checked against the book as new batches reach them.'}
            </p>
          </div>
          <Button href="/references">
            <FontAwesomeIcon icon={faBookmark} />
            {language === 'ar' ? 'عرض المراجع' : 'View references'}
          </Button>
        </section>
      </div>
    </div>
  );
}

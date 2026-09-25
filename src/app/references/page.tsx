"use client";

import { useLanguage } from "@/components/language/LanguageContext";

export default function ReferencesPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 className="mb-4 text-center text-3xl font-bold text-amber-400">
          {language === 'ar' ? 'المراجع' : 'References'}
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-center text-lg text-gray-800 dark:text-gray-200">
          {language === 'ar'
            ? 'المصادر التي اعتمدنا عليها في بناء نمق ومحتواه التاريخي.'
            : 'Sources used to build Namaq and its historical content.'}
        </p>

        <section className="mx-auto max-w-3xl rounded-lg border border-gray-200 p-6 dark:border-white/10">
          <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-100" dir="rtl" lang="ar">
            سير أعلام النبلاء
          </h2>
          <dl className="space-y-2 text-gray-700 dark:text-gray-300">
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'المؤلف: ' : 'Author: '}</dt>
              <dd className="inline" dir="rtl" lang="ar">شمس الدين الذهبي</dd>
            </div>
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'النسخة الرقمية: ' : 'Digital edition: '}</dt>
              <dd className="inline">
                <a className="underline" href="https://shamela.ws/index.php/book/10906" target="_blank" rel="noreferrer">
                  {language === 'ar' ? 'المكتبة الشاملة' : 'Shamela Library'}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </main>
    </div>
  );
}

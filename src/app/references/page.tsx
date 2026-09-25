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
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'النسخة المصورة: ' : 'Scanned edition: '}</dt>
              <dd className="inline">
                <a className="underline" href="https://archive.org/details/sanbz" target="_blank" rel="noreferrer">
                  {language === 'ar' ? 'Archive.org، الطبعة الثالثة، ١٤٠٥/١٩٨٥' : 'Archive.org, third edition, 1405/1985'}
                </a>
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">{language === 'ar' ? 'نص OCR للبحث: ' : 'Searchable OCR text: '}</dt>
              <dd className="inline">
                <a className="underline" href="https://archive.org/download/sanbz/sansera1_djvu.txt" target="_blank" rel="noreferrer">
                  {language === 'ar' ? 'السيرة النبوية، المجلد الأول' : 'Prophet’s Sira, volume 1'}
                </a>
                {' · '}
                <a className="underline" href="https://archive.org/download/sanbz/sansera2_djvu.txt" target="_blank" rel="noreferrer">
                  {language === 'ar' ? 'السيرة النبوية، المجلد الثاني' : 'Prophet’s Sira, volume 2'}
                </a>
              </dd>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar'
                ? 'ملفات النص ناتجة عن التعرف الضوئي على الحروف، وهي للبحث والمقارنة. تُراجع الحواشي على صفحات النسخة المصورة.'
                : 'The text files are OCR aids for searching and comparison. Check footnotes against the scanned pages.'}
            </p>
          </dl>
        </section>
      </main>
    </div>
  );
}

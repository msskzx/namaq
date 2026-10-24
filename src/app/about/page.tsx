"use client";

import { Bookmark } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguage } from "@/components/language/LanguageContext";
import NamaqDefinition from "@/components/homepage/NamaqDefinition";
import styles from "@/components/common/PaperPage.module.css";

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className={`${styles.page} mx-auto w-full max-w-4xl px-4 py-8 sm:px-6`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className={styles.heading}>
        <h1>
          {language === 'ar' ? 'عن نمَق' : 'About Namaq'}
        </h1>
        <p className="mt-3 text-lg">
          {language === 'ar'
            ? 'نَمَق تطبيق تعليمي موجّه للمسلمين وطلاب العلم، والعربية لغته الأساسية. يعين على دراسة القرآن الكريم والحديث النبوي وتاريخ صدر الإسلام من خلال نصوص المصادر والمقارنة بينها، واستكشاف الشخصيات والعلاقات بينها بصريًا.'
            : 'Namaq is an Arabic-first learning application for Muslims and students of Islamic knowledge. It helps readers study the Quran, Hadith, and early Islamic history through source texts, comparisons, and visual exploration of people and their relationships.'}
        </p>
      </header>

      <section className="space-y-4" aria-labelledby="about-references">
        <h2 id="about-references" className="text-2xl">
          {language === 'ar' ? 'المراجع' : 'References'}
        </h2>
        <div className="space-y-3 leading-loose">
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
        <Button href="/attributions">
          <Bookmark size={16} aria-hidden />
          {language === 'ar' ? 'العزو' : 'Attributions'}
        </Button>
      </section>
      <NamaqDefinition />
    </div>
  );
}

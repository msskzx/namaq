"use client";

import { useLanguage } from "@/components/LanguageContext";
import Link from "next/link";

export default function SpecialsPage() {
  const { language } = useLanguage();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-arabicDisplay text-amber-400 text-3xl sm:text-4xl font-bold mb-4 text-center">
          {language === 'ar' ? 'مقالات مميزة' : 'Special Articles'}
        </h1>
        <p className="text-center text-black dark:text-gray-400 mb-8 text-base sm:text-lg font-arabic max-w-3xl mx-auto">
          {language === 'ar'
            ? 'في هذا القسم نقدم مقالات تفاعلية مصممة خصيصاً لتجربة تعلم فريدة. ستجد محتوى غني بالرسوم المتحركة، الإحصائيات، الأشكال التوضيحية، والتصاميم المبتكرة التي تساعدك على الفهم والتفاعل بشكل أفضل.'
            : 'In this section, we present custom-made articles focused on building interactive content for a unique learning experience. You will find content rich with animations, statistics, figures, and creative designs to help you understand and engage more deeply.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-stretch">
          {/* Arabic Letters Card */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-lg border-l-4 border-amber-400 p-8 flex flex-col items-center max-w-md mx-auto">
            <h3 className="font-arabicDisplay text-amber-400 text-xl font-bold mb-3 text-center">
              {language === 'ar' ? 'تعلم الحروف العربية' : 'Learn the Arabic Letters'}
            </h3>
            <p className="text-center text-black dark:text-gray-400 mb-6 text-base sm:text-lg font-arabic">
              {language === 'ar'
                ? 'إتقان الحروف العربية هو الخطوة الأولى لفهم اللغة وقراءة القرآن الكريم. ابدأ رحلتك مع الأبجدية العربية وتعرف على أشكال الحروف وأصواتها من خلال أمثلة تفاعلية ومبسطة.'
                : 'Mastering the Arabic letters is the first step to understanding the language and reading the Holy Quran. Start your journey with the Arabic alphabet and discover the shapes and sounds of the letters through interactive and simple examples.'}
            </p>
            <Link href="/arabic-letters" className="inline-block px-8 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-lg">
              {language === 'ar' ? 'ابدأ تعلم الحروف' : 'Start Learning the Letters'}
            </Link>
          </div>
          {/* Upcoming Content Card */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-lg border-l-4 border-indigo-400 p-8 flex flex-col items-center max-w-md mx-auto opacity-70">
            <h3 className="font-arabicDisplay text-indigo-900 dark:text-indigo-400 text-xl font-bold mb-3 text-center">
              {language === 'ar' ? 'قريباً: محتوى جديد' : 'Coming Soon: New Content'}
            </h3>
            <p className="text-center text-gray-800 dark:text-gray-400 mb-6 text-base sm:text-lg font-arabic">
              {language === 'ar'
                ? 'ترقبوا إضافة مقالات ومواد تفاعلية جديدة قريباً ضمن هذا القسم المميز.'
                : 'Stay tuned for new articles and interactive materials coming soon to this special section.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import { faBook, faPlay, faGraduationCap, faUsers, faMosque, faScroll } from '@fortawesome/free-solid-svg-icons';
import { Article } from "@/types/article";
import ArticleCard from "@/components/ArticleCard";

const articles: Article[] = [
  {
    id: 'arabic-letters',
    title: 'Arabic Letters',
    titleAr: 'الحروف العربية',
    description: 'Learn the 28 letters of the Arabic alphabet with pronunciation and examples',
    descriptionAr: 'تعلم الحروف الـ 28 من الأبجدية العربية مع النطق والأمثلة',
    icon: faBook,
    color: 'indigo',
    href: '/arabic/arabic-letters',
    available: true
  },
  {
    id: 'basic-grammar',
    title: 'Basic Grammar',
    titleAr: 'النحو الأساسي',
    description: 'Learn fundamental Arabic grammar rules and sentence structure',
    descriptionAr: 'تعلم قواعد النحو العربية الأساسية وتركيب الجمل',
    icon: faGraduationCap,
    color: 'green',
    href: '/arabic/basic-grammar',
    available: false
  },
  {
    id: 'quranic-arabic',
    title: 'Quranic Arabic',
    titleAr: 'عربية القرآن',
    description: 'Study Arabic through Quranic verses and Islamic texts',
    descriptionAr: 'ادرس العربية من خلال آيات القرآن والنصوص الإسلامية',
    icon: faScroll,
    color: 'purple',
    href: '/arabic/quranic-arabic',
    available: false
  },
  {
    id: 'conversation',
    title: 'Daily Conversation',
    titleAr: 'المحادثة اليومية',
    description: 'Learn common phrases and expressions for daily communication',
    descriptionAr: 'تعلم العبارات الشائعة والتعبيرات للتواصل اليومي',
    icon: faUsers,
    color: 'blue',
    href: '/arabic/conversation',
    available: false
  },
  {
    id: 'islamic-terms',
    title: 'Islamic Terms',
    titleAr: 'المصطلحات الإسلامية',
    description: 'Master important Islamic vocabulary and religious terms',
    descriptionAr: 'أتقن المفردات الإسلامية المهمة والمصطلحات الدينية',
    icon: faMosque,
    color: 'orange',
    href: '/arabic/islamic-terms',
    available: false
  },
  {
    id: 'writing-practice',
    title: 'Writing Practice',
    titleAr: 'تدريب الكتابة',
    description: 'Practice Arabic writing and calligraphy with interactive exercises',
    descriptionAr: 'تدرب على الكتابة العربية والخط مع تمارين تفاعلية',
    icon: faPlay,
    color: 'red',
    href: '/arabic/writing-practice',
    available: false
  }
];

export default function LearnPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
            {translations[language].learn}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto px-4">
            {translations[language].arabicLanguageDesc}
          </p>
        </header>

        {/* Articles Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                language={language}
              />
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="max-w-4xl mx-auto mt-8 sm:mt-12">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 sm:p-6 border border-indigo-200 dark:border-indigo-800">
            <h3 className="text-base sm:text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
              {language === 'ar' ? 'المزيد من المحتوى قادم' : 'More Content Coming Soon'}
            </h3>
            <p className="text-sm sm:text-base text-indigo-600 dark:text-indigo-300">
              {language === 'ar' 
                ? 'نحن نعمل على إضافة المزيد من الدروس والتمارين التفاعلية لمساعدتك في تعلم العربية'
                : 'We are working on adding more lessons and interactive exercises to help you learn Arabic'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import CategoryCard from '@/components/CategoryCard';
import ArticleCard from '@/components/ArticleCard';
import useSWR from 'swr';
import LoadingSpinner from '../components/LoadingSpinner';
import { Category } from '@/types/category';
import { Article } from '@/types/article';
import MotivationCard from '@/components/MotivationCard';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMosque, faUsers, faShieldAlt, faFileAlt, faThLarge, faPenNib, faCrown, faBook, faQuoteRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import PersonRelationsGraph from '@/components/PersonRelationsGraph';
import NamaqSlider from '@/components/NamaqSlider';
import Timeline from "@/components/Timeline";
import type { Person } from '@/types/person';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper component to fetch and show Prophet Muhammad's relation graph
function RelationGraphPreview({ prophet, prophetError, prophetLoading, language }: { prophet: Person, prophetError: boolean, prophetLoading: boolean, language: string }) {
  if (prophetError) return <div className="text-red-400 text-center text-sm md:text-base">{language === 'ar' ? 'تعذر تحميل الرسم البياني' : 'Failed to load relation graph.'}</div>;
  if (prophetLoading || !prophet) return <div className="flex justify-center"><div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div></div>;
  return (
    <div className="w-full overflow-x-auto">
      <PersonRelationsGraph person={prophet} relationsFrom={prophet.relationsFrom} relationsTo={prophet.relationsTo} />
    </div>
  );
}

export default function Home() {
  const { language } = useLanguage();
  // Add ?limit=3 to the API request
  const { data: categories, error, isLoading } = useSWR<Category[]>("/api/categories?limit=3", fetcher);
  const { data: articles, error: articlesError, isLoading: articlesLoading } = useSWR<Article[]>("/api/articles?limit=3", fetcher);
  const { data: specialArticles, error: specialArticlesError, isLoading: specialArticlesLoading } = useSWR<Article[]>("/api/articles?special=true&limit=4", fetcher);
  const { data: prophet, error: prophetError, isLoading: prophetLoading } = useSWR('/api/people/prophet-muhammad', (url) => fetch(url).then(res => res.json()));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-x-hidden">
      {/* Geometric SVG background overlay (add your SVG in public/arabesque-pattern.svg) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'url(/gemini-arabesque.png)', backgroundRepeat: 'repeat' }} />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Sliding Cards: Namaq Forms (Slider) */}
        <NamaqSlider />
        

        {/* Definition Section */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12 flex justify-center">
          {/* Verb Card */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border-l-4 border-rose-800 p-6 flex flex-col items-center">
            <h4 className="font-arabicDisplay text-amber-400 text-xl md:text-2xl font-bold mb-3 text-center" dir="rtl">
              {translations[language].verbTitle}
            </h4>
            <p className="font-arabic text-gray-900 dark:text-gray-200 text-base md:text-lg leading-relaxed text-center mb-3" dir="rtl">
              {translations[language].verbDefinition}
            </p>
            <div className="space-y-2">
              {translations[language].verbForms.map((form, index) => (
                <p key={index} className="font-arabic text-gray-700 dark:text-gray-200 text-sm md:text-base text-center" dir="rtl">
                  {form}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Special Articles Section */}
        <div className="max-w-6xl mx-auto my-12">
          <h2 className="font-arabicDisplay text-amber-400 text-2xl sm:text-3xl font-bold mb-6 text-center">
            {language === 'ar' ? 'مقالات مميزة' : 'Special Articles'}
          </h2>
          <p className="text-center text-gray-800 dark:text-gray-200 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'في هذا القسم نقدم مقالات تفاعلية مصممة خصيصاً لتجربة تعلم فريدة. ستجد محتوى غني بالرسوم المتحركة، الإحصائيات، الأشكال التوضيحية، والتصاميم المبتكرة التي تساعدك على الفهم والتفاعل بشكل أفضل.'
              : 'In this section, we present custom-made articles focused on building interactive content for a unique learning experience. You will find content rich with animations, statistics, figures, and creative designs to help you understand and engage more deeply.'}
          </p>
          {specialArticlesError && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4 text-sm md:text-base">
              {translations[language].articlesLoadError}
            </div>
          )}
          {specialArticlesLoading || !specialArticles ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Array.isArray(specialArticles) && specialArticles.length > 0 ? (
                  specialArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-4 text-gray-400 font-arabic text-base md:text-lg">
                    {language === 'ar' ? 'لا توجد مقالات مميزة حالياً' : 'No special articles available'}
                  </div>
                )}
              </div>
              {Array.isArray(specialArticles) && specialArticles.length > 0 && (
                <div className="text-center">
                  <Link href="/articles?special=true" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
                    {language === 'ar' ? 'عرض جميع المقالات المميزة' : 'View All Special Articles'}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        <div className="max-w-6xl mx-auto my-12">
          <h2 className="font-arabicDisplay text-amber-400 text-2xl sm:text-3xl font-bold mb-6 text-center">
            {language === 'ar' ? 'شخصيات بارزة' : 'Notable People'}
          </h2>
          <p className="text-center text-gray-800 dark:text-gray-200 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'استكشف حياة النبي محمد ﷺ والصحابة الكرام من خلال الجداول الزمنية والرسوم المتحركة والشخصيات التوضيحية، مما يجعل من التعلم تجربة فريدة.'
              : 'Explore the lives and events of the Prophet Muhammad and his noble Companions through clear timelines, animations, and interactive figures, making learning a unique experience.'}
          </p>
          
          <Timeline events={prophet?.events || []} />
        </div>

        
        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Relation Graph Feature Section */}
        <div className="max-w-8xl mx-auto my-12">
          <h2 className="font-arabicDisplay text-amber-400 text-2xl sm:text-3xl font-bold mb-6 text-center">
            {language === 'ar' ? 'شبكة العلاقات العائلية' : 'Family Relation Graph'}
          </h2>
          <p className="text-center text-gray-800 dark:text-indigo-100 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-3xl mx-auto">
            {language === 'ar'
              ? 'استكشف العلاقات العائلية للنبي محمد ﷺ وجميع الصحابة والأنبياء من خلال رسم بياني تفاعلي يوضح الأبناء، البنات، الأزواج، الأقارب وغيرهم. هذه الميزة متوفرة لكل شخصية في الموقع.'
              : 'Explore the family and relation graph of Prophet Muhammad ﷺ and all companions and prophets through an interactive diagram showing children, d more. This feature is available for every person on the site.'}
          </p>
          <RelationGraphPreview prophet={prophet} prophetError={prophetError} prophetLoading={prophetLoading} language={language} />
        </div>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />
        
        {/* Ayat About People Section */}
        <div className="max-w-8xl mx-auto my-12 p-8 flex flex-col items-center">
          <h2 className="font-arabicDisplay text-amber-400 text-2xl sm:text-3xl font-bold mb-6 text-center">
            {language === 'ar' ? 'آيات نزلت في الأشخاص' : 'Quranic Verses About People'}
          </h2>
          <p className="text-center text-gray-800 dark:text-indigo-100 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-3xl mx-auto">
            {language === 'ar'
              ? 'كل صفحة شخصية في الموقع تحتوي على قسم خاص بالآيات التي نزلت فيه أو ذُكر فيها الشخص. يمكنك استكشاف هذه الآيات والتعرف على سياقها مباشرة من صفحة الشخصية.'
              : 'Each person page on Namaq features a special section with Quranic verses that were revealed about or mention that person. You can explore these verses and their context directly from the person’s page.'}
          </p>
          <div className="w-full max-w-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-amber-400 mb-4 text-center">
              {language === 'ar' ? 'نماذج من الآيات عن النبي محمد ﷺ' : 'Sample Verses About Prophet Muhammad ﷺ'}
            </h3>
            <div className="flex flex-col gap-4">
              {/* Al-Ahzab 33:40 */}
              <div className="border border-amber-300 dark:border-amber-700 rounded-lg bg-amber-100 dark:bg-gray-800 p-4 shadow-sm">
                <div className="text-base md:text-lg font-semibold mb-2 text-amber-700 dark:text-amber-400">
                  {language === 'ar' ? 'سورة الأحزاب، آية 40' : 'Surah Al-Ahzab, 33:40'}
                </div>
                <div className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 font-arabic mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                  {language === 'ar'
                    ? 'مَا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِّن رِّجَالِكُمْ وَلَـٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ'
                    : 'Muhammad is not the father of any of your men, but (he is) the Messenger of Allah and the Seal of the Prophets.'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? 'الأحزاب: 40' : 'Al-Ahzab: 40'}
                </div>
              </div>
              {/* Al-Anbiya 21:107 */}
              <div className="border border-amber-300 dark:border-amber-700 rounded-lg bg-amber-100 dark:bg-gray-800 p-4 shadow-sm">
                <div className="text-base md:text-lg font-semibold mb-2 text-amber-700 dark:text-amber-400">
                  {language === 'ar' ? 'سورة الأنبياء، آية 107' : 'Surah Al-Anbiya, 21:107'}
                </div>
                <div className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 font-arabic mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                  {language === 'ar'
                    ? 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ'
                    : 'And We have not sent you, [O Muhammad], except as a mercy to the worlds.'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? 'الأنبياء: 107' : 'Al-Anbiya: 107'}
                </div>
              </div>
              {/* At-Tawbah 9:40 */}
              <div className="border border-amber-300 dark:border-amber-700 rounded-lg bg-amber-100 dark:bg-gray-800 p-4 shadow-sm">
                <div className="text-base md:text-lg font-semibold mb-2 text-amber-700 dark:text-amber-400">
                  {language === 'ar' ? 'سورة التوبة، آية 40' : 'Surah At-Tawbah, 9:40'}
                </div>
                <div className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 font-arabic mb-2" style={{ fontFamily: 'Amiri, serif' }}>
                  {language === 'ar'
                    ? 'إِذْ يَقُولُ لِصَاحِبِهِ لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا'
                    : 'When he said to his companion, "Do not grieve; indeed Allah is with us."'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? 'التوبة: 40' : 'At-Tawbah: 40'}
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link href="/people/prophet-muhammad" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
                {language === 'ar' ? 'المزيد عن النبي محمد ﷺ' : 'More about Prophet Muhammad ﷺ'}
              </Link>
            </div>
          </div>
        </div>

        {/* Category Cards Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="font-arabicDisplay text-amber-400 text-2xl sm:text-3xl font-bold mb-6 text-center">
            {translations[language].categories}
          </h2>
          <p className="text-center text-gray-800 dark:text-gray-200 mb-8 text-base sm:text-lg font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'تصفح مقالاتنا المنظمة حسب الموضوعات المختلفة لتسهيل رحلتك التعليمية. اختر التصنيف الذي يهمك لاستكشاف المحتوى المرتبط باللغة العربية والنحو والصرف والتاريخ الإسلامي والثقافة. كل تصنيف يحتوي على مجموعة من المقالات المختارة بعناية لمساعدتك على التعلم بطريقة منظمة ومتسلسلة.'
              : 'Browse our articles organized by different topics to facilitate your learning journey. Choose the category that interests you to explore content related to Arabic language, grammar, morphology, Islamic history, and culture. Each category contains a carefully selected collection of articles to help you learn in an organized and sequential manner.'}
          </p>
          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4 text-sm md:text-base">
              {translations[language].categoriesLoadError}
            </div>
          )}
          {isLoading || !categories ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-4 text-gray-400 font-arabic text-base md:text-lg">
                    {translations[language].categoriesNotFound}
                  </div>
                )}
              </div>
              <div className="text-center">
                <Link href="/categories" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
                  {language === 'ar' ? 'عرض جميع التصنيفات' : 'View All Categories'}
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Articles Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="font-arabicDisplay text-amber-400 text-2xl sm:text-3xl font-bold mb-6 text-center">
            {translations[language].articles}
          </h2>
          <p className="text-center text-gray-800 dark:text-gray-200 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'اقرأ أحدث المقالات المكتوبة بعناية فائقة حول اللغة العربية والنحو والصرف والتاريخ الإسلامي والثقافة الإسلامية. اكتشف رؤى جديدة وتعمق في معرفتك من خلال محتوى غني ومتنوع يغطي مواضيع مختلفة من أساسيات اللغة العربية إلى القصص التاريخية العميقة. كل مقال مصمم لمساعدتك على فهم أفضل للغة والثقافة الإسلامية.'
              : 'Read our latest carefully crafted articles about Arabic language, grammar, morphology, Islamic history, and Islamic culture. Discover new insights and deepen your knowledge through rich and diverse content covering various topics from Arabic language fundamentals to deep historical narratives. Each article is designed to help you gain a better understanding of the language and Islamic culture.'}
          </p>
          {articlesError && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4 text-sm md:text-base">
              {translations[language].articlesLoadError}
            </div>
          )}
          {articlesLoading || !articles ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {Array.isArray(articles) && articles.length > 0 ? (
                  articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-4 text-gray-400 font-arabic text-base md:text-lg">
                    {translations[language].articlesNotFound}
                  </div>
                )}
              </div>
              <div className="text-center">
                <Link href="/articles" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
                  {language === 'ar' ? 'عرض جميع المقالات' : 'View All Articles'}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

        {/* Section Divider (amber-400) */}
        <hr className="border-t-2 border-amber-400 my-8 max-w-2xl mx-auto" />

        {/* Motivation Section */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
          <h2 className="font-arabicDisplay text-amber-400 text-2xl sm:text-3xl font-bold mb-8 text-center">
            {language === 'ar' ? 'ابدأ رحلتك التعليمية' : 'Start Your Learning Journey'}
          </h2>
          <p className="text-center text-black dark:text-gray-200 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'استكشف هذه الأقسام المتنوعة لتبدأ رحلتك الشاملة في تعلم اللغة العربية وفهم التاريخ الإسلامي والثقافة الإسلامية. من دراسة حياة النبي محمد ﷺ وأصحابه الكرام إلى استكشاف المعارك التاريخية المهمة، ومن قراءة المقالات التعليمية إلى التعمق في الشعر العربي والأدب الإسلامي. كل قسم مصمم لمساعدتك على بناء أساس قوي في اللغة والثقافة الإسلامية بطريقة تفاعلية وممتعة.'
              : 'Explore these diverse sections to begin your comprehensive journey in learning Arabic and understanding Islamic history and culture. From studying the life of Prophet Muhammad ﷺ and his noble companions to exploring important historical battles, from reading educational articles to delving into Arabic poetry and Islamic literature. Each section is designed to help you build a strong foundation in Arabic language and Islamic culture in an interactive and enjoyable way.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <MotivationCard
              icon={<FontAwesomeIcon icon={faMosque} className="w-8 h-8 md:w-10 md:h-10 text-sky-400" />}
              title={translations[language].motivation.prophet.title}
              desc={translations[language].motivation.prophet.desc}
              url="/people/prophet-muhammad"
              color="text-gray-900 dark:text-gray-200"
              borderColor="border-sky-400"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faUsers} className="w-8 h-8 md:w-10 md:h-10 text-sky-500" />}
              title={translations[language].motivation.companions.title}
              desc={translations[language].motivation.companions.desc}
              url="/people?title=companion"
              color="text-gray-900 dark:text-gray-200"
              borderColor="border-sky-500"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faShieldAlt} className="w-8 h-8 md:w-10 md:h-10 text-sky-600" />}
              title={translations[language].motivation.battles.title}
              desc={translations[language].motivation.battles.desc}
              url="/battles"
              color="text-gray-900 dark:text-gray-200"
              borderColor="border-sky-600"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faFileAlt} className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />}
              title={translations[language].motivation.articles.title}
              desc={translations[language].motivation.articles.desc}
              url="/articles"
              color="text-gray-900 dark:text-gray-200"
              borderColor="border-blue-400"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faThLarge} className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />}
              title={translations[language].motivation.categories.title}
              desc={translations[language].motivation.categories.desc}
              url="/categories"
              color="text-gray-900 dark:text-gray-200"
              borderColor="border-blue-500"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faPenNib} className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />}
              title={translations[language].motivation.poems.title}
              desc={translations[language].motivation.poems.desc}
              url="/poems"
              color="text-gray-900 dark:text-gray-200"
              borderColor="border-blue-600"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faBook} className="w-8 h-8 md:w-10 md:h-10 text-indigo-400" />}
              title={translations[language].motivation.quran.title}
              desc={translations[language].motivation.quran.desc}
              url="/quran"
              color="text-gray-900 dark:text-gray-200"
              borderColor="border-indigo-400"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faQuoteRight} className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" />}
              title={translations[language].motivation.hadith.title}
              desc={translations[language].motivation.hadith.desc}
              url="/hadith"
              color="text-gray-900 dark:text-gray-200"
              borderColor="border-indigo-500"
            />
            <MotivationCard
              icon={<FontAwesomeIcon icon={faCrown} className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />}
              title={translations[language].motivation.titles.title}
              desc={translations[language].motivation.titles.desc}
              url="/titles"
              color="text-gray-900 dark:text-gray-200"
              borderColor="border-indigo-600"
            />
          </div>
        </div>

      {/* Disclaimer Badge */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 z-10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg border-l-4 border-rose-800 p-6 flex flex-col items-center" role="alert">
          <div className="flex">
            <FontAwesomeIcon icon={faInfoCircle} className="w-6 h-6 mr-2 rtl:mr-0 rtl:ml-2 text-rose-800 dark:text-rose-800" />
            <div className="mr-3 rtl:mr-0 rtl:ml-3">
              <p className="text-sm">
                {language === 'ar' 
                  ? 'هذا المشروع قيد التطوير والبيانات المعروضة غير مراجعة بالكامل وهي لأغراض توضيحية فقط!' 
                  : 'This project is a work in progress. The data shown is not thoroughly reviewed and is only for demonstration purposes!'}
              </p>
            </div>
          </div>
        </div>
      </div>
        
    </div>
  );
}
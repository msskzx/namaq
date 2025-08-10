
import { useLanguage } from "../language/LanguageContext";
import translations from "../language/translations";
import MotivationCard from "./MotivationCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMosque, faUsers, faShieldAlt, faFileAlt, faThLarge, faPenNib, faCrown, faBook, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

function Exploration() {
  const { language } = useLanguage();
  return (
    <div className="mx-auto mb-8 sm:mb-12">
          <h2 className="font-arabicDisplay text-gray-900 dark:text-gray-200 text-2xl sm:text-3xl font-bold mb-8 text-center">
            {language === 'ar' ? 'ابدأ رحلتك التعليمية' : 'Start Your Learning Journey'}
          </h2>
          <p className="text-center text-gray-800 dark:text-gray-200 mb-10 text-base sm:text-lg md:text-xl font-arabic max-w-4xl mx-auto leading-relaxed">
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
  );
}

export default Exploration;

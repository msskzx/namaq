import Link from "next/link";
import { useLanguage } from "../language/LanguageContext";
import translations from "../language/translations";
import HeroGraphPreview from "./HeroGraphPreview";

export default function Hero() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="text-gray-900 dark:text-gray-200 flex flex-col justify-center">
        <h1 className="text-5xl text-center font-Cairo">
          {language === 'ar' ? (
            <>
              <span className="text-indigo-300">استكشف</span> التاريخ الإسلامي{' '}<br></br>
              من خلال <span className="text-amber-400">التعلم التفاعلي</span><br></br>
            </>
          ) : (
            <>
              <span className="text-indigo-300">Explore</span> Islamic History{' '}
              <br></br>
              Through <span className="text-amber-400">interactive learning</span>
            </>
          )}
        </h1>
        <p className="text-center text-gray-800 dark:text-gray-200 text-2xl mt-8">{t.intro}</p>
        <div className="text-center mt-8">
          <Link href="/graphs" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
            {t.familyRelations}
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <HeroGraphPreview />
      </div>

    </div>
  );
}
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../language/LanguageContext";
import translations from "../language/translations";

export default function Hero() {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="text-gray-900 dark:text-gray-200 flex flex-col justify-center">
        <h1 className="text-5xl text-center font-Cairo">
          {language === 'ar' ? (
            <>
              <span className="text-indigo-300">تعلَّم</span> من خلال المقالات{' '}<br></br>
              <span className="text-blue-300">التفاعلية</span> والاستكشافات{' '}<br></br>
              <span>المعتمدة على</span>{' '}
              <span className="text-amber-400">البيانات</span>
            </>
          ) : (
            <>
              <span className="text-indigo-300">Learn</span> Through{' '}
              <br></br>
              <span className="text-blue-300">Interactive</span> Visual Articles{' '}
              <br></br>
              &amp; <span className="text-amber-300">Data-Driven</span> Explorations
            </>
          )}
        </h1>
        <p className="text-center text-gray-800 dark:text-gray-200 text-2xl mt-8">{t.intro}</p>
        <div className="text-center mt-8">
          <Link href="/specials" className="inline-flex items-center px-6 py-3 bg-amber-400 text-gray-950 font-semibold rounded-lg hover:bg-amber-300 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base">
            {t.specialArticles}
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Image src="/gemini_scholar.png" alt="Gemini Scholar" className="w-full rounded-2xl" width={500} height={500} />
      </div>


    </div>
  );
}
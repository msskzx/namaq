import { useLanguage } from "@/components/language/LanguageContext";
import translations from "../language/translations";
import type { Ayah } from "@/types/quran";

function AyatGroup({ ayat }: { ayat: Ayah[] }) {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <div>
      {ayat.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
          <div className="font-bold text-2xl mb-4 text-gray-900 dark:text-gray-200">{t.ayatReferences}</div>
          <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
            <div className="flex flex-col gap-4">
              {ayat.map((ayah, idx) => (
                <div
                  key={idx}
                >
                  <AyahCard ayah={ayah} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}</div>
  )
}

function AyahCard({ ayah }: { ayah: Ayah }) {
  const { language } = useLanguage();
  return (
    <div className="border border-amber-400 rounded-lg p-4 min-h-48 w-full flex flex-col justify-between" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="text-lg mb-2 text-amber-700 dark:text-amber-400">
        {language === 'ar'
          ? `${ayah.surah?.name} - آية ${ayah.number}`
          : `Surah ${ayah.surah?.nameTransliterated}:${ayah.number}`}
      </div>
      <div className="text-2xl text-gray-800 dark:text-gray-200 font-arabic flex-1 flex items-center justify-center text-center overflow-hidden" style={{ fontFamily: 'Amiri, serif' }}>
        {ayah.text}
      </div>
    </div>
  )
}


export { AyatGroup, AyahCard };


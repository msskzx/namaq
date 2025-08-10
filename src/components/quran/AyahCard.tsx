import type { Ayah } from "@/types/person";
import { useLanguage } from "@/components/language/LanguageContext";
import translations from "../language/translations";

function AyatGroup({ ayat }: { ayat: Ayah[] }) {
    const { language } = useLanguage();
    const t = translations[language];
    return (
        <div>{/* Quranic References (Ayat) */}
        {ayat.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-4">
            <div className="font-bold text-2xl mb-4 text-amber-400">{t.ayatReferences}</div>
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
        <div>
            <div className="text-lg font-semibold mb-2 text-amber-700 dark:text-amber-400">
                {language === 'ar'
                    ? `سورة ${ayah.surah}، آية ${ayah.ayah}`
                    : `Surah ${ayah.surah}:${ayah.ayah}`}
            </div>
            <div className="text-2xl text-gray-800 dark:text-gray-200 font-arabic" style={{ fontFamily: 'Amiri, serif' }}>
                {ayah.text}
            </div>
        </div>
    )
}


export {AyatGroup, AyahCard};


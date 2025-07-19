"use client";

import { useLanguage } from "@/components/LanguageContext";
import translations from "@/components/translations";
import LoadingSpinner from '@/components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faArrowLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

interface QuranResponse {
  code: number;
  status: string;
  data: Surah;
}

export default function SurahPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const params = useParams();
  const surahNumber = params.slug as string;
  
  const [surah, setSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurah = async () => {
      if (!surahNumber) return;
      
      try {
        setLoading(true);
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.hafs`);
        const data: QuranResponse = await response.json();
        
        if (data.code === 200) {
          setSurah(data.data);
        } else {
          setError('Failed to fetch Quran data');
        }
      } catch (err) {
        setError('Error loading Quran data');
        console.error('Error fetching Quran:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [surahNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="min-h-screen bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400">
            {language === 'ar' ? 'السورة غير موجودة' : 'Surah not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            href="/quran"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            <span>{language === 'ar' ? 'العودة إلى قائمة السور' : 'Back to Surahs'}</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-indigo-950">
            <FontAwesomeIcon icon={faBook} className="text-amber-400 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-amber-400">
            {t.motivation.quran.title}
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-lg p-6">
          {/* Surah Header */}
          <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {surah.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              {surah.englishName} - {surah.englishNameTranslation}
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span>{language === 'ar' ? 'عدد الآيات:' : 'Ayahs:'} {surah.numberOfAyahs}</span>
              <span>•</span>
              <span>{surah.revelationType}</span>
              <span>•</span>
              <span>{language === 'ar' ? 'رقم السورة:' : 'Surah:'} {surah.number}</span>
            </div>
          </div>

          {/* Ayahs */}
          <div>
            {/* Flowing text with ayah numbers at the end */}
            <div 
              className="text-2xl leading-relaxed text-gray-800 dark:text-gray-200 font-arabic"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              {/* Bismillah */}
              <div className="text-center mb-6">
                <span className="text-2xl text-amber-600 dark:text-amber-400 font-bold">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>
              
              {/* Ayahs */}
              {surah.ayahs.map((ayah, index) => (
                <span key={ayah.number}>
                  {index === 0 
                    ? ayah.text.substring(ayah.text.indexOf('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ') + 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'.length + 1).trim()
                    : ayah.text
                  }
                  <span className="inline-block w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full text-center leading-8 mx-2 align-middle">
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">
                      {ayah.numberInSurah}
                    </span>
                  </span>
                  {index < surah.ayahs.length - 1 && ' '}
                </span>
              ))}
            </div>
            
            {/* Surah details */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-500 flex flex-wrap gap-4 justify-center">
                <span>{language === 'ar' ? 'الجزء:' : 'Juz:'} {surah.ayahs[0]?.juz}</span>
                <span>{language === 'ar' ? 'الصفحة:' : 'Page:'} {surah.ayahs[0]?.page}</span>
                <span>{language === 'ar' ? 'المنزل:' : 'Manzil:'} {surah.ayahs[0]?.manzil}</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            {/* Previous Surah */}
            {parseInt(surahNumber) > 1 && (
              <Link 
                href={`/quran/${parseInt(surahNumber) - 1}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={language === 'ar' ? faChevronRight : faChevronLeft} className="w-4 h-4" />
                <span>{language === 'ar' ? 'السورة السابقة' : 'Previous Surah'}</span>
              </Link>
            )}
            
            {/* Data source */}
            <div className="text-sm text-gray-500 dark:text-gray-500">
              {language === 'ar' 
                ? 'مصدر البيانات: Al-Quran Cloud API' 
                : 'Data source: Al-Quran Cloud API'
              }
            </div>
            
            {/* Next Surah */}
            {parseInt(surahNumber) < 114 && (
              <Link 
                href={`/quran/${parseInt(surahNumber) + 1}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors duration-200"
              >
                <span>{language === 'ar' ? 'السورة التالية' : 'Next Surah'}</span>
                <FontAwesomeIcon icon={language === 'ar' ? faChevronLeft : faChevronRight} className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
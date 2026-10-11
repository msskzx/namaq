import type { Metadata } from 'next';
import { buildOpenings } from '@/lib/quran/openings';
import data from './ayat.json';
import OpeningsView from './OpeningsView';

export const metadata: Metadata = {
  title: 'افتتاح التكوير والانفطار والانشقاق',
};

export default function QuranOpeningsPage() {
  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">افتتاح التكوير والانفطار والانشقاق</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. الآية الأولى من السور ٨١ و٨٢ و٨٤، واللفظ المشترك بلون واحد.
        </p>
      </header>
      <OpeningsView items={buildOpenings(data)} />
    </div>
  );
}

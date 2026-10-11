import type { Metadata } from 'next';
import { buildOpenings, buildTasbih } from '@/lib/quran/openings';
import data from './ayat.json';
import OpeningsView from './OpeningsView';

export const metadata: Metadata = {
  title: 'افتتاح السور: الشرط وجوابه والتسبيح',
};

export default function QuranOpeningsPage() {
  return (
    <div dir="rtl" className="max-w-5xl mx-auto p-4 flex flex-col gap-6 text-gray-900 dark:text-gray-200">
      <header>
        <h1 className="text-3xl mb-2">افتتاح السور: الشرط وجوابه والتسبيح</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          لم يراجع هذا العرض أحد من أهل العلم. النص برواية حفص. في ٨١ و٨٢ و٨٤ كل آيات «إذا» من أولها إلى جوابها، وكل آية بلون دورها. وفي ١٧ و٥٧ و٥٩ و٦١ و٦٢ و٦٤ و٨٧ الآية الأولى، وكل جزء منها بلون دوره.
        </p>
      </header>
      <OpeningsView items={buildOpenings(data)} tasbih={buildTasbih(data)} />
    </div>
  );
}

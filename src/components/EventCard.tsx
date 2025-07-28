import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { EventBase } from '@/types/event';

function EventCard({ event }: { event: EventBase }) {
  const { language } = useLanguage();
  if (!event || !event.slug) {
    return null;
  }
  return (
    <Link href={`/events/${event.slug}`} className="block">
      <div className="bg-gray-50 dark:bg-gray-900 border-l-4 border-amber-400 rounded-lg p-6 shadow transition-transform duration-200 hover:shadow-xl hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-2 text-amber-400 dark:text-amber-400">{language === 'ar' ? event.name : event.nameTransliterated}</h2>
        <p className="text-gray-600 dark:text-gray-200 mb-0">{language === 'ar' ? event.description : event.descriptionTransliterated}</p>
      </div>
    </Link>
  );
}

export default EventCard; 
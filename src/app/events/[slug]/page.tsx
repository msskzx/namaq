"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { useLanguage } from "@/components/language/LanguageContext";
import translations from "@/components/language/translations";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faLocationDot, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PersonNameCard from '@/components/people/PersonNameCard';
import { EventAll } from '@/types/event';
import { PersonBase } from "@/types/person";
import ArticleCard from "@/components/articles/ArticleCard";
import { ArticleBase } from "@/types/article";
import Badge from '@/components/common/Badge';
import { CategoryBase } from "@/types/category";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function EventPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = translations[language];
  const { data: event, error, isLoading } = useSWR<EventAll>(slug ? `/api/events/${slug}` : null, fetcher);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-gray-900">
              <FontAwesomeIcon icon={faShieldHalved} className="text-amber-400 w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold text-amber-400">
              {event ? (language === 'ar' ? event.name : event.nameTransliterated || event.name) : t.battles.title}
            </h1>
           
          </div>
          {event?.categories && event.categories.length > 0 && (
              <div className="mb-4">
                <ul className="flex flex-wrap gap-2">
                  {event.categories.map((cat: CategoryBase) => (
                    <li key={cat.id}>
                      <Badge
                        href={`/categories/${cat.slug}`}
                        text={language === 'ar' ? cat.name : cat.nameTransliterated || cat.name}
                        color="blue"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4">
              {t.battles.loadError}
            </div>
          )}
          {event && (
            
            <div className="bg-white dark:bg-gray-950 p-6 font-geistmono">
              <div className="bg-gray-50 dark:bg-gray-900 mb-2 rounded-xl shadow-lg p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLocationDot} className="text-amber-400 w-5 h-5" />
                    <span className="text-gray-800 dark:text-gray-300">
                      {language === 'ar'
                        ? event.location
                        : event.locationTransliterated || event.location || '-'}
                    </span>
                  </div>

                  {/* Hijri Period */}
                  {event.hijriPeriod && (
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-amber-400 w-5 h-5" />
                      <span className="text-gray-800 dark:text-gray-300">{event.hijriPeriod}</span>
                    </div>
                  )}

                </div>
                {event.description && (
                  <span className="text-gray-800 dark:text-gray-200">{language === 'ar' ? event.description : event.descriptionTransliterated}</span>
                )}
              </div>
              
              
              <div className="p-6 mt-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200 mt-8">
                {t.peopleInvolved}
              </h2>
              {event.people && event.people.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {event.people.map((person: PersonBase) => (
                    <PersonNameCard 
                      key={person.id} 
                      person={person} 
                      language={language} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 py-4">
                  {t.noPeopleInvolved}
                </div>
              )}
              </div>
              
              <div className="p-6 mt-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200 mt-8">
                  {t.articles}
                </h2>
                {event.articles && event.articles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {event.articles.map((article: ArticleBase) => (
                      <ArticleCard
                        key={article.id} 
                        article={article} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 py-4">
                    {t.noArticlesForEvent}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default EventPage; 
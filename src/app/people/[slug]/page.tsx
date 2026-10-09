'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHexagonNodes, faPeopleGroup, faSeedling, faSignature, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Badge from '@/components/common/Badge';
import Link from 'next/link';
import { valueLines } from '@/lib/modelView';
import { hasModelVirtues, virtueSpeakerHref, virtueSpeakerLabel } from '@/lib/virtues';
import { titleName } from '@/lib/titleName';
import Timeline from '@/components/people/Timeline';
import type { PersonFull } from '@/types/person';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import GraphCanvas from '@/components/graph/GraphCanvas';

import { fetcher } from '@/lib/swr';
import { AyatGroup } from '@/components/quran/AyahCard';
import UtteranceGroup from '@/components/utterances/UtteranceGroup';
import ClaimEvidence from '@/components/common/ClaimEvidence';
import SourceAccountReader from '@/components/people/SourceAccountReader';
import ModelEntries from '@/components/people/ModelEntries';
import ProfileHadith from '@/components/people/ProfileHadith';

function PersonDetailPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const { slug } = useParams<{ slug: string }>();
  const { data: person, error, isLoading } = useSWR<PersonFull>(slug ? `/api/people/${slug}` : null, fetcher);
  const otherModelEntries = (person?.modelEntries ?? []).filter((entry) => entry.predicate !== 'virtue');

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage title={t.personLoadError} />
        </div>
      </div>
    );
  }

  if (isLoading || !person) {
    return (
      <div className="min-h-screen bg-white dark:bg-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner fill />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-4 gap-4">
          {person.picture && (
            <Image src={person.picture} alt={person.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover border" />
          )}
          <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-gray-200 mb-4">{person.name}</h1>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {person.titles && person.titles.length > 0 && person.titles.map((title) => (
              <Badge
                key={title.id}
                href={`/people?title=${title.slug}`}
                text={titleName(title, person.sex, language)}
                color="indigo"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-10">
          {person.fullName && (
            <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faSignature} className="w-7 h-7 text-amber-500 me-2" />
                {t.fullName}</h2>
              <p className="text-gray-800 dark:text-gray-200 text-lg">{person.fullName}</p>
            </div>
          )}
          {person.kunya && (
            <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faSignature} className="w-7 h-7 text-amber-500 me-2" />
                {t.kunya}</h2>
              <p className="text-gray-800 dark:text-gray-200 text-lg">{person.kunya}</p>
            </div>
          )}
          {person.tribalAffiliation && (
            <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faPeopleGroup} className="w-7 h-7 text-amber-500 me-2" />
                {t.tribalAffiliation}</h2>
              <p className="text-gray-800 dark:text-gray-200 text-lg">{person.tribalAffiliation}</p>
            </div>
          )}
          {person.appearance && (
            <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faUser} className="w-7 h-7 text-amber-500 me-2" />
                {t.appearance}</h2>
              <p className="text-gray-800 dark:text-gray-200 text-lg">{person.appearance}</p>
            </div>
          )}

          {hasModelVirtues(person.modelEntries) && (
            <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faSeedling} className="w-7 h-7 text-amber-500 me-2" />
                {t.virtues}</h2>
              <ul className="flex flex-col gap-3">
                {(person.modelEntries ?? []).filter((entry) => entry.predicate === 'virtue').flatMap((entry) =>
                  valueLines(entry, language).map((line, i) => (
                    <li key={`${entry.assertionId}-${i}`} className="text-gray-800 dark:text-gray-200 text-lg">
                      <span dir="rtl" lang="ar">{line}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {!hasModelVirtues(person.modelEntries) && person.virtues && person.virtues.length > 0 && (
            <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
              <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
                <FontAwesomeIcon icon={faSeedling} className="w-7 h-7 text-amber-500 me-2" />
                {t.virtues}</h2>
              <ul className="flex flex-col gap-3">
                {person.virtues.map((virtue) => {
                  const href = virtueSpeakerHref(virtue);
                  const label = virtue.speakerName ? virtueSpeakerLabel(virtue.speakerName, language, t.virtueSpeakerSays) : null;
                  return (
                    <li key={virtue.id} className="text-gray-800 dark:text-gray-200 text-lg">
                      {label && virtue.speakerName && (
                        <span className="text-gray-600 dark:text-gray-400 me-2">
                          {href ? (
                            <Link href={href} className="underline decoration-dotted hover:text-amber-600 dark:hover:text-amber-400">{label}</Link>
                          ) : label}
                        </span>
                      )}
                      <span dir="rtl" lang="ar">{virtue.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <Timeline events={person.events || []} participations={person.participations || []} death={person} />

          <div className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4">
            <h2 className="text-3xl mb-4 text-gray-900 dark:text-gray-200">
              <FontAwesomeIcon icon={faHexagonNodes} className="w-7 h-7 text-amber-500 me-2" />
              {t.relations}
            </h2>
            <GraphCanvas targetSlug={slug} />
          </div>

          {otherModelEntries.length > 0 && <ModelEntries entries={otherModelEntries} spans={person.modelSpans ?? []} />}
          {person.hadith && person.hadith.length > 0 && <ProfileHadith slug={slug} hadith={person.hadith} />}
          <SourceAccountReader basePath={`/api/people/${slug}`} />

          <AyatGroup ayat={person.ayat || []} />

          <UtteranceGroup utterances={person.said} variant="said" sex={person.sex} />
          <UtteranceGroup utterances={person.spokenAbout} variant="about" sex={person.sex} />

          <ClaimEvidence title={language === 'ar' ? 'المصادر والملاحظات التاريخية' : 'Sources & historical notes'} claims={person.claims || []} subjectName={person.name} subjectSlug={slug} />


        </div>
      </div>
    </div>
  );
};

export default PersonDetailPage;

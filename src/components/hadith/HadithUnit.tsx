'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faQuoteRight, faScroll } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import HadithBody, { sceneColours } from './HadithBody';
import HadithModeToggle, { type HadithMode } from './HadithModeToggle';
import PageReader from './PageReader';
import { useLanguage } from '@/components/language/LanguageContext';
import type { HadithUnitView } from '@/lib/model/hadithView';

const card = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4 mb-4';
const h2 = 'text-2xl mb-3 text-gray-900 dark:text-gray-200';

export default function HadithUnit({
  view,
  profiles = [],
}: {
  view: HadithUnitView;
  profiles?: string[];
}) {
  const ar = useLanguage().language === 'ar';
  const [mode, setMode] = useState<HadithMode>('bubbles');
  const isSharh = view.explains.length > 0;
  const hadith = view.reports.filter((r) => r.voice !== 'AUTHOR');
  const remarks = view.reports.filter((r) => r.voice === 'AUTHOR');
  const colours = new Map(hadith.map((r) => [r.id, sceneColours(r.scenes)]));
  return (
    <main className="w-full px-6 py-4" dir={ar ? 'rtl' : 'ltr'}>
      <h1 dir="rtl" className="mb-4 text-3xl text-gray-900 dark:text-gray-200">
        <FontAwesomeIcon icon={faBook} className="text-amber-500 me-2" />
        {view.book}
      </h1>
      {view.kitab && (
        <p dir="rtl" className="mb-4 text-xl leading-loose text-gray-700 dark:text-gray-300">
          {view.kitab} — {view.bab}
        </p>
      )}
      {!isSharh && hadith.length > 0 && (
        <HadithModeToggle mode={mode} onChange={setMode} />
      )}
      {!isSharh && hadith.map((report) => (
        <section key={report.id} className={card}>
          <h2 className={h2}>
            <FontAwesomeIcon icon={faScroll} className="text-amber-500 me-2" />
            {ar ? 'الحديث' : 'The hadith'}
          </h2>
          <HadithBody report={report} view={view} mode={mode} profiles={profiles} colours={colours.get(report.id)!} />
        </section>
      ))}
      {!isSharh && remarks.map((report) => (
        <section key={report.id} className={card}>
          <h2 className={h2}>
            <FontAwesomeIcon icon={faQuoteRight} className="text-amber-500 me-2" />
            {ar ? 'تعليق المصنف' : 'The compiler\'s remark'}
          </h2>
          {report.frame && <p className="mb-3 text-gray-700 dark:text-gray-300">{report.frame}</p>}
          {report.statements.map((text, i) => (
            <p key={i} dir="rtl" className="mb-3 text-xl leading-loose text-gray-900 dark:text-gray-200">{text}</p>
          ))}
        </section>
      ))}
      {view.reader && view.reader.length > 0 && (
        <section className={card}>
          <h2 className={h2}>{ar ? 'نص الكتاب كما طُبع' : 'The book\'s text as printed'}</h2>
          <PageReader pages={view.reader} />
        </section>
      )}
      {view.notes.length > 0 && (
        <section className={card}>
          <h2 className={h2}>{ar ? 'ما يقوله الشارح عن هذا الحديث' : 'What the commentator says about this hadith'}</h2>
          {view.notes.map((note, i) => (
            <div key={i} className="mb-3">
              <p dir="rtl" className="text-xl leading-loose text-gray-900 dark:text-gray-200">{note.text}</p>
              {note.narrator && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ar ? 'التعليق على الراوي: ' : 'This is about the narrator: '}
                  <span dir="rtl">{note.narrator}</span>
                </p>
              )}
            </div>
          ))}
        </section>
      )}
      {view.explains.map((e) => (
        <section key={e.unit} className={card}>
          <h2 className={h2}>{ar ? 'الحديث الذي يشرحه' : 'The hadith it explains'}</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">
            {ar
              ? `هذا النص شرحٌ لحديث في ${e.book}، ويحدده بما طُبع في أوله:`
              : `This text explains a hadith in ${e.book}, and names it by what it prints at the start:`}
          </p>
          <p dir="rtl" className="mb-3 text-xl text-gray-900 dark:text-gray-200">{e.basis}</p>
          <Button size="sm" href={`/hadith/${e.unit}`}>
            <FontAwesomeIcon icon={faBookOpen} />
            {ar ? 'اقرأ الحديث' : 'Read the hadith'}
          </Button>
        </section>
      ))}
      {view.sameEvent.map((e) => (
        <section key={e.unit} className={card}>
          <h2 className={h2}>{ar ? `الواقعة نفسها في ${e.book}` : `The same event in ${e.book}`}</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">
            {ar ? `حسب ${e.source}:` : `According to ${e.source}:`}
          </p>
          <p dir="rtl" className="mb-3 text-xl leading-loose text-gray-900 dark:text-gray-200">{e.basis}</p>
          <Button size="sm" href={`/hadith/${e.unit}`}>
            <FontAwesomeIcon icon={faBookOpen} />
            {ar ? `اقرأ الحديث في ${e.book}` : `Read the hadith in ${e.book}`}
          </Button>
        </section>
      ))}
      {view.explainedBy.map((e) => (
        <section key={e.unit} className={card}>
          <h2 className={h2}>{ar ? 'ما قاله ابن حجر عن هذا الحديث' : 'What Ibn Hajar says about this hadith'}</h2>
          {e.texts.map((text, i) => (
            <p key={i} dir="rtl" className="mb-2 text-xl leading-loose text-gray-900 dark:text-gray-200">{text}</p>
          ))}
          <Button size="sm" href={`/hadith/${e.unit}`}>
            <FontAwesomeIcon icon={faBookOpen} />
            {ar ? 'اقرأ صفحات الشرح' : 'Read the commentary pages'}
          </Button>
        </section>
      ))}
    </main>
  );
}

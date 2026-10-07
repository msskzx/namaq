'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faComments, faQuoteRight, faScroll } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import IsnadSvg from './IsnadSvg';
import PageReader from './PageReader';
import { useLanguage } from '@/components/language/LanguageContext';
import type { HadithUnitView, SceneLine } from '@/lib/model/hadithView';
import { isnadGraph } from '@/lib/model/isnadGraph';

const card = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4 mb-4';
const h2 = 'text-2xl mb-3 text-gray-900 dark:text-gray-200';

const BUBBLE_COLOURS = [
  'bg-indigo-50 dark:bg-indigo-900',
  'bg-amber-50 dark:bg-amber-900',
  'bg-teal-50 dark:bg-teal-900',
  'bg-gray-100 dark:bg-gray-800',
  'bg-blue-50 dark:bg-blue-900',
];

function sceneColours(scenes: HadithUnitView['reports'][number]['scenes']) {
  const earlier = new Map<string, number>();
  return scenes.map((scene) => {
    const taken = new Set<number>();
    const colours = new Map<string, string>();
    for (const { kind, speaker } of scene.lines) {
      if (kind !== 'turn' || !speaker || colours.has(speaker)) continue;
      const kept = earlier.get(speaker);
      let at = kept !== undefined && !taken.has(kept) ? kept : 0;
      while (taken.has(at)) at = (at + 1) % BUBBLE_COLOURS.length;
      taken.add(at);
      earlier.set(speaker, at);
      colours.set(speaker, BUBBLE_COLOURS[at]);
    }
    return colours;
  });
}

function Bubbles({ lines, colours }: { lines: SceneLine[]; colours: Map<string, string> }) {
  const first = lines.find((l) => l.kind === 'turn')?.speaker;
  return (
    <div dir="rtl" className="flex flex-col gap-3">
      {lines.map((line, i) => {
        if (line.kind === 'narration') {
          return (
            <div key={i} className="px-2">
              {line.speaker && (
                <span className="block text-sm text-amber-700 dark:text-amber-400">{line.speaker}</span>
              )}
              <p className="text-lg leading-loose text-gray-600 dark:text-gray-300">{line.text}</p>
            </div>
          );
        }
        const mine = line.speaker === first;
        const colour = colours.get(line.speaker ?? '') ?? BUBBLE_COLOURS[0];
        return (
          <div key={i} className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${colour} ${mine ? 'rounded-ss-sm' : 'rounded-se-sm'}`}>
              {line.speaker && (
                <span className="block text-sm text-amber-700 dark:text-amber-400">{line.speaker}</span>
              )}
              <p className="text-lg leading-loose text-gray-900 dark:text-gray-200">{line.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HadithUnit({
  view,
  profiles = [],
}: {
  view: HadithUnitView;
  profiles?: string[];
}) {
  const ar = useLanguage().language === 'ar';
  const [mode, setMode] = useState<'text' | 'bubbles'>('bubbles');
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
        <div className="mb-4 flex flex-wrap gap-2">
          <Button active={mode === 'text'} onClick={() => setMode('text')}>
            <FontAwesomeIcon icon={faScroll} />
            {ar ? 'النص كاملاً' : 'Full text'}
          </Button>
          <Button active={mode === 'bubbles'} onClick={() => setMode('bubbles')}>
            <FontAwesomeIcon icon={faComments} />
            {ar ? 'الإسناد والفقاعات' : 'Isnad and bubbles'}
          </Button>
        </div>
      )}
      {!isSharh && hadith.map((report) => (
        <section key={report.id} className={card}>
          <h2 className={h2}>
            <FontAwesomeIcon icon={faScroll} className="text-amber-500 me-2" />
            {ar ? 'الحديث' : 'The hadith'}
          </h2>
          {mode === 'text' ? (
            <>
              {report.frame && <p className="mb-3 text-gray-700 dark:text-gray-300">{report.frame}</p>}
              {(report.fullText ? [report.fullText] : report.statements).map((text, i) => (
                <p key={i} dir="rtl" className="mb-3 text-xl leading-loose text-gray-900 dark:text-gray-200">{text}</p>
              ))}
            </>
          ) : (
            <>
              {report.chain && (
                <div className="mb-6">
                  <IsnadSvg graph={isnadGraph(report, view.compiler ?? view.book, view.id)} profiles={profiles} ar={ar} />
                </div>
              )}
              {report.scenes.length === 0 &&
                report.statements.map((text, i) => (
                  <p key={i} dir="rtl" className="mb-3 text-xl leading-loose text-gray-900 dark:text-gray-200">{text}</p>
                ))}
              {report.scenes.map((scene, index) => (
                <div key={scene.ordinal} className="mb-4 last:mb-0">
                  <h3 className="mb-2 text-xl text-gray-900 dark:text-gray-200">
                    {ar ? 'المشهد' : 'Scene'} {scene.ordinal}
                  </h3>
                  <Bubbles lines={scene.lines} colours={colours.get(report.id)![index]} />
                </div>
              ))}
            </>
          )}
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

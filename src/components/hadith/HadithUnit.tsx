'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faComments, faListOl, faScroll } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import SlideSwitch from '@/components/graph/SlideSwitch';
import PageReader from './PageReader';
import { useLanguage } from '@/components/language/LanguageContext';
import type { ChainView, HadithUnitView, SceneLine } from '@/lib/model/hadithView';

const card = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4 mb-4';
const h2 = 'text-2xl mb-3 text-gray-900 dark:text-gray-200';

function Chain({ chain, ar }: { chain: ChainView; ar: boolean }) {
  return (
    <div>
      <ol dir="rtl" className="flex flex-col gap-1">
        {chain.links.map((link, i) => (
          <li key={i} className="text-lg text-gray-900 dark:text-gray-200">
            {link.gap ? (
              <span className="text-gray-500">{ar ? '… (حلقة محذوفة)' : '… (omitted link)'}</span>
            ) : (
              link.text ?? `${link.mode} ${link.narrator}`
            )}
          </li>
        ))}
      </ol>
      {chain.tahwil && (
        <p className="my-2 text-gray-700 dark:text-gray-300">
          {ar ? 'تحويل: ' : 'Switch of chain: '}
          {chain.tahwil}
        </p>
      )}
      {chain.branches?.map((branch, i) => (
        <div key={i} className="mt-3 ps-4 border-s-2 border-amber-400">
          <Chain chain={branch} ar={ar} />
        </div>
      ))}
    </div>
  );
}

function Bubbles({ lines }: { lines: SceneLine[] }) {
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
        return (
          <div key={i} className={`flex ${mine ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                mine
                  ? 'bg-indigo-50 dark:bg-indigo-900 rounded-ss-sm'
                  : 'bg-amber-50 dark:bg-amber-900 rounded-se-sm'
              }`}
            >
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

function Line({ line }: { line: SceneLine }) {
  const narration = line.kind === 'narration';
  return (
    <div dir="rtl" className={narration ? 'text-gray-700 dark:text-gray-300' : 'ps-4 border-s-4 border-amber-400'}>
      {line.speaker && (
        <span className="block text-sm text-amber-700 dark:text-amber-400">{line.speaker}</span>
      )}
      <p className="text-lg leading-loose text-gray-900 dark:text-gray-200">{line.text}</p>
    </div>
  );
}

export default function HadithUnit({ view }: { view: HadithUnitView }) {
  const ar = useLanguage().language === 'ar';
  const [bubbles, setBubbles] = useState(true);
  const isSharh = view.explains.length > 0;
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
      {!isSharh && view.reports.map((report) => (
        <React.Fragment key={report.id}>
          <section className={card}>
            <h2 className={h2}>
              <FontAwesomeIcon icon={faScroll} className="text-amber-500 me-2" />
              {report.voice === 'AUTHOR'
                ? ar ? 'تعليق المصنف' : 'The compiler\'s remark'
                : ar ? 'الحديث' : 'The hadith'}
            </h2>
            {report.frame && <p className="mb-3 text-gray-700 dark:text-gray-300">{report.frame}</p>}
            {report.fullText && (
              <p dir="rtl" className="text-xl leading-loose text-gray-900 dark:text-gray-200">{report.fullText}</p>
            )}
            {!report.fullText && report.scenes.length === 0 && report.statements.map((text, i) => (
              <p key={i} dir="rtl" className="mb-3 text-xl leading-loose text-gray-900 dark:text-gray-200">{text}</p>
            ))}
          </section>
          {report.chain && (
            <section className={card}>
              <h2 className={h2}>
                <FontAwesomeIcon icon={faListOl} className="text-amber-500 me-2" />
                {ar ? 'الإسناد' : 'Chain'}
              </h2>
              <Chain chain={report.chain} ar={ar} />
            </section>
          )}
          {report.scenes.length > 0 && (
            <section className={card}>
              <h2 className={h2}>
                <FontAwesomeIcon icon={faComments} className="text-amber-500 me-2" />
                {ar ? 'المشاهد' : 'Scenes'}
              </h2>
              <div className="mb-4">
                <SlideSwitch
                  checked={bubbles}
                  onChange={() => setBubbles(!bubbles)}
                  label={ar ? 'عرض المحادثة فقاعات' : 'Show the conversation as bubbles'}
                />
              </div>
              {report.scenes.map((scene) => (
                <div key={scene.ordinal} className="mb-4 last:mb-0">
                  <h3 className="mb-2 text-xl text-gray-900 dark:text-gray-200">
                    {ar ? 'المشهد' : 'Scene'} {scene.ordinal}
                  </h3>
                  {bubbles ? (
                    <Bubbles lines={scene.lines} />
                  ) : (
                    <div className="flex flex-col gap-3">
                      {scene.lines.map((line, i) => (
                        <Line key={i} line={line} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </React.Fragment>
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

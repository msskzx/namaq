'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faComments, faListOl } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import PageReader from './PageReader';
import { useLanguage } from '@/components/language/LanguageContext';
import type { ChainView, HadithUnitView, SceneLine } from '@/lib/model/hadithView';

const card = 'bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg p-4 mb-4';
const h2 = 'text-2xl mb-3 text-gray-900 dark:text-gray-200';

function Chain({ chain, ar }: { chain: ChainView; ar: boolean }) {
  return (
    <div>
      <ol className="flex flex-col gap-1">
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

function Line({ line }: { line: SceneLine }) {
  const narration = line.kind === 'narration';
  return (
    <div className={narration ? 'text-gray-700 dark:text-gray-300' : 'ps-4 border-s-4 border-amber-400'}>
      {line.speaker && (
        <span className="block text-sm text-amber-700 dark:text-amber-400">{line.speaker}</span>
      )}
      <p className="text-lg leading-loose text-gray-900 dark:text-gray-200">{line.text}</p>
    </div>
  );
}

export default function HadithUnit({ view }: { view: HadithUnitView }) {
  const ar = useLanguage().language === 'ar';
  return (
    <main className="w-full px-6 py-4" dir="rtl">
      <h1 className="mb-4 text-3xl text-gray-900 dark:text-gray-200">
        <FontAwesomeIcon icon={faBook} className="text-amber-500 me-2" />
        {view.book}
      </h1>
      {view.kitab && (
        <p className="mb-4 text-xl leading-loose text-gray-700 dark:text-gray-300">
          {view.kitab} — {view.bab}
        </p>
      )}
      {view.reports.map((report) => (
        <section key={report.id} className={card}>
          {report.frame && <p className="mb-3 text-gray-700 dark:text-gray-300">{report.frame}</p>}
          {report.fullText && (
            <p className="mb-4 text-xl leading-loose text-gray-900 dark:text-gray-200">{report.fullText}</p>
          )}
          {!report.fullText && report.scenes.length === 0 && report.statements.map((text, i) => (
            <p key={i} className="mb-3 text-xl leading-loose text-gray-900 dark:text-gray-200">{text}</p>
          ))}
          {report.chain && (
            <div className="mb-4">
              <h2 className={h2}>
                <FontAwesomeIcon icon={faListOl} className="text-amber-500 me-2" />
                {ar ? 'الإسناد' : 'Chain'}
              </h2>
              <Chain chain={report.chain} ar={ar} />
            </div>
          )}
          {report.scenes.map((scene) => (
            <div key={scene.ordinal} className="mb-4">
              <h2 className={h2}>
                <FontAwesomeIcon icon={faComments} className="text-amber-500 me-2" />
                {ar ? 'المشهد' : 'Scene'} {scene.ordinal}
              </h2>
              <div className="flex flex-col gap-3">
                {scene.lines.map((line, i) => (
                  <Line key={i} line={line} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
      {view.reader && view.reader.length > 0 && (
        <section className={card}>
          <h2 className={h2}>{ar ? 'نص الكتاب' : 'Text of the book'}</h2>
          <PageReader pages={view.reader} />
        </section>
      )}
      {view.explains.map((e) => (
        <section key={e.unit} className={card}>
          <h2 className={h2}>{ar ? 'الشرح' : 'Commentary'}</h2>
          <p className="mb-2 text-xl text-gray-900 dark:text-gray-200">{e.basis}</p>
          <Button size="sm" href={`/hadith/${e.unit}`}>
            <FontAwesomeIcon icon={faBookOpen} />
            {ar ? 'الحديث' : 'The hadith'}
          </Button>
        </section>
      ))}
      {view.explainedBy.map((e) => (
        <section key={e.unit} className={card}>
          <h2 className={h2}>{ar ? 'الشرح' : 'Commentary'}</h2>
          {e.texts.map((text, i) => (
            <p key={i} className="mb-2 text-xl leading-loose text-gray-900 dark:text-gray-200">{text}</p>
          ))}
          <Button size="sm" href={`/hadith/${e.unit}`}>
            <FontAwesomeIcon icon={faBookOpen} />
            {ar ? 'فتح الشرح' : 'Open the commentary'}
          </Button>
        </section>
      ))}
    </main>
  );
}

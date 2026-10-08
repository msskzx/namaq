'use client';

import React from 'react';
import IsnadSvg from './IsnadSvg';
import type { HadithMode } from './HadithModeToggle';
import { useLanguage } from '@/components/language/LanguageContext';
import type { HadithUnitView, SceneLine } from '@/lib/model/hadithView';
import { isnadGraph } from '@/lib/model/isnadGraph';

const BUBBLE_COLOURS = [
  'bg-indigo-50 dark:bg-indigo-900',
  'bg-amber-50 dark:bg-amber-900',
  'bg-teal-50 dark:bg-teal-900',
  'bg-gray-100 dark:bg-gray-800',
  'bg-blue-50 dark:bg-blue-900',
];

export function sceneColours(scenes: HadithUnitView['reports'][number]['scenes']) {
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

function Bubbles({
  lines,
  colours,
  highlight,
}: {
  lines: SceneLine[];
  colours: Map<string, string>;
  highlight?: string;
}) {
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
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${colour} ${mine ? 'rounded-ss-sm' : 'rounded-se-sm'} ${highlight && line.agent === highlight ? 'ring-2 ring-amber-500' : ''}`}>
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


export default function HadithBody({
  report,
  view,
  mode,
  profiles = [],
  colours,
  highlight,
}: {
  report: HadithUnitView['reports'][number];
  view: HadithUnitView;
  mode: HadithMode;
  profiles?: string[];
  colours: Map<string, string>[];
  highlight?: string;
}) {
  const ar = useLanguage().language === 'ar';
  return (
    <>
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
            <Bubbles lines={scene.lines} colours={colours[index]} highlight={highlight} />
          </div>
        ))}
      </>
    )}
    </>
  );
}

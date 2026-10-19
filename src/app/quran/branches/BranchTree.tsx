import React from 'react';
import Link from 'next/link';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref, keys, linkId, type Branch, type Variant } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';

type Props = { tree: Branch; names: Record<number, string>; pages: Record<string, number>; variants?: Variant[]; juz?: JuzRange | null };
type NodeProps = Omit<Props, 'tree' | 'variants' | 'juz'> & { node: Branch; path: string[]; tags: Record<string, Variant>; lead: number; juz?: JuzRange };

const LINE = 'border-gray-400 dark:border-gray-500';
const TONE: Record<string, string> = {
  '': 'border-sky-500 text-sky-800 dark:text-sky-300',
  و: 'border-purple-500 text-purple-800 dark:text-purple-300',
  ف: 'border-teal-500 text-teal-800 dark:text-teal-300',
};

function Node({ node, path, names, pages, tags, lead, juz }: NodeProps) {
  const root = path.length === 0;
  const words = [...path, ...node.words];
  const shownWords = node.words.slice(root ? lead : 0);
  return (
    <div className="flex items-center">
      <div className={`shrink-0 rounded border px-3 py-1.5 ${node.children.length === 0 ? 'max-w-sm' : 'max-w-xs'} ${root ? 'border-amber-500 bg-amber-200 dark:bg-amber-800 text-xl' : 'border-amber-400 bg-white dark:bg-gray-900 text-lg'}`}>
        {root || node.children.length === 0 ? <span className="font-arabic leading-loose">{shownWords.join(' ')}</span> : (
          <Link href={branchesHref(linkId(words, keys(node).flatMap(key => (tags[key] ? [tags[key].conj] : []))), juz)} className="font-arabic leading-loose hover:text-amber-700 dark:hover:text-amber-300 hover:underline">{node.words.join(' ')}</Link>
        )}
        {node.ayat.length > 0 && (
          <span className="flex flex-wrap gap-1 mt-1">
            {node.ayat.map(key => {
              const [surah, ayah] = key.split(':').map(Number);
              return (
                <span key={key} className="inline-flex items-center gap-1">
                  <Link href={`/quran/read/${pages[key]}`} className="rounded bg-amber-100 dark:bg-white/10 px-1.5 text-xs text-amber-800 dark:text-amber-300 hover:underline">
                    {`${names[surah] ?? num(surah)} ${num(ayah)}`}
                  </Link>
                  {tags[key] && <span className={`rounded-full border px-1.5 text-xs font-arabic ${TONE[tags[key].conj]}`}>{tags[key].word}</span>}
                </span>
              );
            })}
          </span>
        )}
      </div>
      {node.children.length > 0 && (
        <>
          <span aria-hidden className={`w-4 shrink-0 border-t-2 ${LINE}`} />
          <ul className="flex flex-col">
            {node.children.map((child, i) => (
              <li key={i} className="relative flex items-center py-1 ps-6">
                <span aria-hidden className={`absolute start-0 top-1/2 w-6 border-t-2 ${LINE}`} />
                {node.children.length > 1 && (
                  <span aria-hidden className={`absolute start-0 border-s-2 ${LINE} ${i === 0 ? 'top-1/2' : 'top-0'} ${i === node.children.length - 1 ? 'bottom-1/2' : 'bottom-0'}`} />
                )}
                <Node node={child} path={words} names={names} pages={pages} tags={tags} lead={lead} juz={juz} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// docs/plans/quran-shared-openings.md
export default function BranchTree({ tree, names, pages, variants = [], juz = null }: Props) {
  const tags = Object.fromEntries(variants.flatMap(variant => variant.keys.map(key => [key, variant])));
  return (
    <div tabIndex={0} role="region" aria-label="شجرة الفواتح" className="overflow-auto rounded-lg border border-amber-400 bg-gray-50 dark:bg-black p-4">
      <div className="flex items-center">
        {variants.length > 0 && (
          <>
            <ul aria-label="صيغ الكلمة الأولى" className="flex flex-col">
              {variants.map((variant, i) => (
                <li key={variant.conj} className="relative flex items-center py-1 pe-6">
                  <span aria-hidden className={`absolute end-0 top-1/2 w-6 border-t-2 ${LINE}`} />
                  <span aria-hidden className={`absolute end-0 border-e-2 ${LINE} ${i === 0 ? 'top-1/2' : 'top-0'} ${i === variants.length - 1 ? 'bottom-1/2' : 'bottom-0'}`} />
                  <span className={`shrink-0 rounded border-2 bg-white dark:bg-gray-900 px-3 py-1.5 text-xl font-arabic leading-loose ${TONE[variant.conj]}`}>
                    {variant.id ? <Link href={branchesHref(variant.id, juz ?? undefined)} className="hover:underline">{variant.word}</Link> : variant.word}
                  </span>
                </li>
              ))}
            </ul>
            <span aria-hidden className={`w-4 shrink-0 border-t-2 ${LINE}`} />
          </>
        )}
        <Node node={tree} path={[]} names={names} pages={pages} tags={tags} lead={variants.length > 0 ? 1 : 0} juz={juz ?? undefined} />
      </div>
    </div>
  );
}

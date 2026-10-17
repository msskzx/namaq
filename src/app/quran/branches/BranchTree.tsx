import React from 'react';
import Link from 'next/link';
import { num } from '@/lib/quran/arabicNumber';
import type { Branch } from '@/lib/quran/branches';

type Props = { tree: Branch; names: Record<number, string>; pages: Record<string, number> };

const LINE = 'border-gray-400 dark:border-gray-500';

function Node({ node, root, names, pages }: Omit<Props, 'tree'> & { node: Branch; root?: boolean }) {
  return (
    <div className="flex items-center">
      <div className={`shrink-0 rounded border px-3 py-1.5 ${node.children.length === 0 ? 'max-w-sm' : 'max-w-xs'} ${root ? 'border-amber-500 bg-amber-200 dark:bg-amber-800 text-xl' : 'border-amber-400 bg-white dark:bg-gray-900 text-lg'}`}>
        <span className="font-arabic leading-loose">{node.words.join(' ')}</span>
        {node.ayat.length > 0 && (
          <span className="flex flex-wrap gap-1 mt-1">
            {node.ayat.map(key => {
              const [surah, ayah] = key.split(':').map(Number);
              return (
                <Link key={key} href={`/quran/read/${pages[key]}`} className="rounded bg-amber-100 dark:bg-white/10 px-1.5 text-xs text-amber-800 dark:text-amber-300 hover:underline">
                  {`${names[surah] ?? num(surah)} ${num(ayah)}`}
                </Link>
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
                <Node node={child} names={names} pages={pages} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// docs/plans/quran-shared-openings.md
export default function BranchTree({ tree, names, pages }: Props) {
  return (
    <div tabIndex={0} role="region" aria-label="شجرة الفواتح" className="overflow-auto rounded-lg border border-amber-400 bg-gray-50 dark:bg-black p-4">
      <Node node={tree} root names={names} pages={pages} />
    </div>
  );
}

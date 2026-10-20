import React from 'react';
import Link from 'next/link';
import { num } from '@/lib/quran/arabicNumber';
import { branchesHref, keys, linkId, spell, type Branch, type Variant } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';

type Props = { tree: Branch; names: Record<number, string>; pages: Record<string, number>; variants?: Variant[]; juz?: JuzRange | null; renderNode?: (node: Branch, index: number, tags: Record<string, Variant>) => React.ReactNode; label?: string; header?: React.ReactNode };
type NodeProps = Omit<Props, 'tree' | 'variants' | 'juz' | 'header'> & { node: Branch; path: string[]; tags: Record<string, Variant>; lead: number; juz?: JuzRange; indices: Map<Branch, number> };

const LINE = 'border-[var(--home-rule)]';
export const TONE: Record<string, string> = {
  '': 'border-[var(--home-muted)] text-[var(--home-ink)]',
  و: 'border-[var(--home-green)] text-[var(--home-green)]',
  ف: 'border-[var(--home-accent)] text-[var(--home-accent)]',
};

function Node({ node, path, names, pages, tags, lead, juz, renderNode, indices }: NodeProps) {
  const root = path.length === 0;
  const words = [...path, ...node.words];
  const shownWords = node.words.slice(root ? lead : 0);
  return (
    <div className="flex items-center">
      {(!root || shownWords.length > 0 || node.ayat.length > 0) && <div className={`shrink-0 rounded border px-3 py-1.5 ${node.children.length === 0 ? 'max-w-sm' : 'max-w-xs'} ${root ? 'border-[var(--home-accent)] bg-[var(--home-paper-deep)] text-xl' : 'border-[var(--home-rule)] bg-[var(--home-paper)] text-lg'}`}>
        {renderNode && !root ? renderNode(node, indices.get(node)!, tags) : <>{root || node.children.length === 0 ? <span className="font-arabic leading-loose">{shownWords.join(' ')}</span> : (
          <Link href={branchesHref(linkId(words, keys(node).flatMap(key => (tags[key] ? [tags[key].conj] : []))), juz)} className="font-arabic leading-loose hover:text-[var(--home-accent)] hover:underline">{node.words.join(' ')}</Link>
        )}
        {node.ayat.length > 0 && (
          <span className="flex flex-wrap gap-1 mt-1">
            {node.ayat.map((key, index) => {
              const [surah, ayah] = key.split(':').map(Number);
              return (
                <span key={key} className="inline-flex items-center gap-1">
                  {index > 0 && <span aria-hidden className="text-xs text-[var(--home-muted)]">·</span>}
                  <Link href={`/quran/read/${pages[key]}?a=${key}`} className="text-xs text-[var(--home-accent)] hover:underline">
                    {`${names[surah] ?? num(surah)} ${num(ayah)}`}
                  </Link>
                  {tags[key] && <span className={`text-xs font-arabic ${TONE[tags[key].conj]}`}>{tags[key].word}</span>}
                </span>
              );
            })}
          </span>
        )}</>}
      </div>}
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
                <Node node={child} path={words} names={names} pages={pages} tags={tags} lead={lead} juz={juz} renderNode={renderNode} indices={indices} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// docs/plans/quran-shared-openings.md
export default function BranchTree({ tree, names, pages, variants = [], juz = null, renderNode, label = 'شجرة الفواتح', header }: Props) {
  const indices = new Map<Branch, number>();
  const visit = (node: Branch) => {
    indices.set(node, indices.size - 1);
    node.children.forEach(visit);
  };
  visit(tree);
  const tags = Object.fromEntries(variants.flatMap(variant => variant.keys.map(key => [key, variant])));
  return (
    <div tabIndex={0} role="region" aria-label={label} className="overflow-auto rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-4 text-[var(--home-ink)]">
      {header && <div className="mb-3">{header}</div>}
      <div className="flex items-center">
        {variants.length > 0 && (
          <>
            <ul aria-label="صيغ الكلمة الأولى" className="flex flex-col">
              {variants.map((variant, i) => (
                <li key={variant.word} className="relative flex items-center py-1 pe-6">
                  <span aria-hidden className={`absolute end-0 top-1/2 w-6 border-t-2 ${LINE}`} />
                  <span aria-hidden className={`absolute end-0 border-e-2 ${LINE} ${i === 0 ? 'top-1/2' : 'top-0'} ${i === variants.length - 1 ? 'bottom-1/2' : 'bottom-0'}`} />
                  <span className={`shrink-0 rounded border-2 bg-[var(--home-paper)] px-3 py-1.5 text-xl font-arabic leading-loose ${TONE[variant.conj]}`}>
                    {!renderNode ? <Link href={branchesHref(variant.id, juz ?? undefined, { spelling: spell(variant.word) })} className="hover:underline">{variant.word}</Link> : variant.word}
                  </span>
                </li>
              ))}
            </ul>
            <span aria-hidden className={`w-4 shrink-0 border-t-2 ${LINE}`} />
          </>
        )}
        <Node node={tree} path={[]} names={names} pages={pages} tags={tags} lead={variants.length > 0 ? 1 : 0} juz={juz ?? undefined} renderNode={renderNode} indices={indices} />
      </div>
    </div>
  );
}

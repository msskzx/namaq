'use client';

import React, { useId, useState } from 'react';
import Link from 'next/link';
import { num } from '@/lib/quran/arabicNumber';
import { ayahEnds, branchesHref, keys, linkId, spell, type Branch, type BranchesView, type Variant } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import AyahContextButton from './AyahContext';
import { anchorOf, NeighbourBox, SurroundToggle, surroundStyle, useSurrounding, type Around } from './Surroundings';

type Props = { view?: BranchesView; tree: Branch; names: Record<number, string>; pages: Record<string, number>; variants?: Variant[]; showSpellings?: boolean; juz?: JuzRange | null; renderNode?: (node: Branch, index: number, tags: Record<string, Variant>) => React.ReactNode; label?: string; header?: React.ReactNode; surround?: { on: boolean; sync?: boolean } };
type NodeProps = Omit<Props, 'tree' | 'variants' | 'juz' | 'header' | 'surround'> & { around?: Around; anchors?: string; node: Branch; parent?: Branch; path: string[]; tags: Record<string, Variant>; lead: number; juz?: JuzRange; indices: Map<Branch, number> };

const LINE = 'border-[var(--home-rule)]';
export const TONE: Record<string, string> = {
  '': 'border-[var(--home-muted)] text-[var(--home-ink)]',
  و: 'border-[var(--home-green)] text-[var(--home-green)]',
  ف: 'border-[var(--home-root)] text-[var(--home-root)]',
};

type Refs = { keys: string[]; names: Record<number, string>; pages: Record<string, number>; tags?: Record<string, Variant>; linked?: boolean };

export function AyahRefs({ keys, names, pages, tags = {}, linked = true, className = 'mt-1' }: Refs & { className?: string }) {
  return (
    <span className={`flex flex-wrap gap-1 ${className}`}>
      {keys.map((key, index) => {
        const [surah, ayah] = key.split(':').map(Number);
        return (
          <span key={key} className="inline-flex items-center gap-1">
            {index > 0 && <span aria-hidden className="text-xs text-[var(--home-muted)]">·</span>}
            {linked ? <Link href={`/quran/read/${pages[key]}?a=${key}`} className="text-xs text-[var(--home-accent)] hover:underline">
              {names[surah] ? `${names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`}
            </Link> : <span className="text-xs">{names[surah] ? `${names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`}</span>}
            {tags[key] && <span className={`text-xs font-arabic ${TONE[tags[key].conj]}`}>{tags[key].word}</span>}
          </span>
        );
      })}
    </span>
  );
}

export function spellings(node: Pick<Branch, 'forms'>, skip = 0) {
  const found = new Map<string, { words: string[]; keys: string[] }>();
  Object.entries(node.forms ?? {}).forEach(([key, words]) => {
    const text = JSON.stringify(words.slice(skip));
    found.set(text, { words: words.slice(skip), keys: [...(found.get(text)?.keys ?? []), key] });
  });
  return found.size > 1 ? [...found.values()].sort((a, b) => b.keys.length - a.keys.length) : [];
}

export function Marked({ node, ayahKeys, subject, siblings, names, children, skip = 0, offset = 0, leaf = false, enabled = true, references }: { references?: React.ReactNode; enabled?: boolean; node: Pick<Branch, 'forms'>; ayahKeys: string[]; subject?: string; siblings?: string[]; skip?: number; offset?: number; leaf?: boolean; names: Record<number, string>; children: React.ReactNode }) {
  if (!enabled) return <>{children}{references}</>;
  const forms = Object.values(node.forms ?? {}).map(words => words.slice(skip));
  const differentWords = (forms[0] ?? []).flatMap((_, i) => new Set(forms.map(words => words[i])).size > 1 ? [offset + skip + i] : []);
  const others = (siblings ?? []).filter(key => !ayahKeys.includes(key));
  return <AyahContextButton ayahKeys={ayahKeys} subject={subject} siblings={others} spellings={spellings(node, skip)} spellingAt={offset + skip} differentWords={differentWords} names={names} leaf={leaf} references={references}>{children}</AyahContextButton>;
}

function Node({ node, parent, path, names, pages, tags, lead, juz, renderNode, indices, showSpellings, view, around, anchors }: NodeProps) {
  const root = path.length === 0;
  const words = [...path, ...node.words];
  const shownWords = node.words.slice(root ? lead : 0);
  const nexts = !around ? [] : node.ayat.flatMap(key => {
    const neighbour = around.data.after[around.ends[key]];
    return neighbour ? [{ key: `a${key}`, keys: [key], item: <NeighbourBox neighbour={neighbour} of={key} side="after" around={around} /> }] : [];
  });
  return (
    <div className="flex items-center">
      {(!root || shownWords.length > 0 || node.ayat.length > 0) && <div data-keys={around ? keys(node).join(' ') : undefined} className={`shrink-0 rounded border px-3 py-1.5 ${node.children.length === 0 ? 'max-w-sm' : 'max-w-xs'} ${root ? 'border-[var(--home-accent)] bg-[var(--home-paper-deep)] text-xl' : 'border-[var(--home-rule)] bg-[var(--home-paper)] text-lg'}`}>
        {anchors && node.ayat.map(key => <span key={key} data-anchor id={anchorOf(anchors, key)} />)}
        {renderNode && !root ? renderNode(node, indices.get(node)!, tags) : <><Marked node={node} ayahKeys={keys(node)} subject={(root ? shownWords : node.words).join(' ')} siblings={node.children.length === 0 && parent ? keys(parent) : undefined} names={names} offset={path.length} leaf={node.children.length === 0} skip={root ? lead : 0} enabled={showSpellings} references={node.ayat.length > 0 && <AyahRefs keys={node.ayat} names={names} pages={pages} tags={tags} linked={node.children.length > 0} className="" />}>{root || node.children.length === 0 ? <span className="font-arabic leading-loose">{shownWords.join(' ')}</span> : (
          <Link href={branchesHref(linkId(words, keys(node).flatMap(key => (tags[key] ? [tags[key].conj] : []))), juz, { ...view, partition: node.partition })} className="font-arabic leading-loose hover:text-[var(--home-accent)] hover:underline">{node.words.join(' ')}</Link>
        )}</Marked></>}
      </div>}
      {(node.children.length > 0 || nexts.length > 0) && (
        <>
          <span aria-hidden data-line data-keys={around ? keys(node).join(' ') : undefined} className={`w-4 shrink-0 border-t-2 ${LINE}`} />
          <ul className="flex flex-col">
            {[...node.children.map((child, i) => ({ key: `n${i}`, keys: keys(child), item: <Node node={child} parent={node} path={words} names={names} pages={pages} tags={tags} lead={lead} juz={juz} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={anchors} /> })), ...nexts].map((entry, i, all) => (
              <li key={entry.key} className="relative flex items-center py-1 ps-6">
                <span aria-hidden data-line data-keys={around ? entry.keys.join(' ') : undefined} className={`absolute start-0 top-1/2 w-6 border-t-2 ${LINE}`} />
                {all.length > 1 && (
                  <span aria-hidden className={`absolute start-0 border-s-2 ${LINE} ${i === 0 ? 'top-1/2' : 'top-0'} ${i === all.length - 1 ? 'bottom-1/2' : 'bottom-0'}`} />
                )}
                {entry.item}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function BeforeFan({ ayahKeys, around }: { ayahKeys: string[]; around?: Around }) {
  const boxes = !around ? [] : ayahKeys.flatMap(key => (around.data.before[key] ? [{ key, neighbour: around.data.before[key]! }] : []));
  if (!around || boxes.length === 0) return null;
  return (
    <>
      <ul aria-label="الآيات السابقة" className="flex flex-col">
        {boxes.map(({ key, neighbour }, i) => (
          <li key={key} className="relative flex items-center py-1 pe-6">
            <span aria-hidden data-line data-keys={key} className={`absolute end-0 top-1/2 w-6 border-t-2 ${LINE}`} />
            {boxes.length > 1 && <span aria-hidden className={`absolute end-0 border-e-2 ${LINE} ${i === 0 ? 'top-1/2' : 'top-0'} ${i === boxes.length - 1 ? 'bottom-1/2' : 'bottom-0'}`} />}
            <NeighbourBox neighbour={neighbour} of={key} side="before" around={around} />
          </li>
        ))}
      </ul>
      <span aria-hidden data-line data-keys={ayahKeys.join(' ')} className={`w-4 shrink-0 border-t-2 ${LINE}`} />
    </>
  );
}

// docs/plans/quran-shared-openings.md
export default function BranchTree({ tree, names, pages, variants = [], showSpellings = true, juz = null, renderNode, label = 'شجرة الفواتح', header, view, surround }: Props) {
  const id = useId();
  const [on, setOn] = useState(surround?.on ?? false);
  const all = keys(tree);
  const ends = ayahEnds(tree);
  const { data, isLoading, error } = useSurrounding(!!surround && on, all, ends);
  const around: Around | undefined = surround && on && data ? { data, ends, inTree: new Set(all), names, tree: id } : undefined;
  const indices = new Map<Branch, number>();
  const visit = (node: Branch) => {
    indices.set(node, indices.size - 1);
    node.children.forEach(visit);
  };
  visit(tree);
  const tags = Object.fromEntries(variants.flatMap(variant => variant.keys.map(key => [key, variant])));
  return (
    <div tabIndex={0} role="region" aria-label={label} data-tree={id} className="overflow-auto rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-4 text-[var(--home-ink)]">
      {around && <style>{surroundStyle(id, all)}</style>}
      {(header || surround) && <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {header}
        {surround && <SurroundToggle on={on} onChange={setOn} sync={surround.sync} loading={isLoading} failed={!!error} />}
      </div>}
      <div className="flex items-center">
        {variants.length > 0 ? (
          <>
            <ul aria-label="صيغ الكلمة الأولى" className="flex flex-col">
              {variants.map((variant, i) => (
                <li key={variant.word} className="relative flex items-center py-1 pe-6">
                  <span aria-hidden data-line data-keys={around ? variant.keys.join(' ') : undefined} className={`absolute end-0 top-1/2 w-6 border-t-2 ${LINE}`} />
                  <span aria-hidden className={`absolute end-0 border-e-2 ${LINE} ${i === 0 ? 'top-1/2' : 'top-0'} ${i === variants.length - 1 ? 'bottom-1/2' : 'bottom-0'}`} />
                  <BeforeFan ayahKeys={variant.keys} around={around} />
                  <div data-keys={around ? variant.keys.join(' ') : undefined} className={`shrink-0 rounded border-2 bg-[var(--home-paper)] px-3 py-1.5 text-xl font-arabic leading-loose ${TONE[variant.conj]}`}>
                    <Marked node={variant} ayahKeys={variant.keys} subject={variant.word} siblings={variants.flatMap(other => other.keys)} names={names} enabled={showSpellings}>
                      {!renderNode ? <Link href={branchesHref(variant.id, juz ?? undefined, { ...view, spelling: spell(variant.word), partition: variant.partition })} className="hover:underline">{variant.word}</Link> : variant.word}
                    </Marked>
                  </div>
                </li>
              ))}
            </ul>
            <span aria-hidden data-line data-keys={around ? all.join(' ') : undefined} className={`w-4 shrink-0 border-t-2 ${LINE}`} />
          </>
        ) : <BeforeFan ayahKeys={all} around={around} />}
        <Node node={tree} path={[]} names={names} pages={pages} tags={tags} lead={variants.length > 0 ? 1 : 0} juz={juz ?? undefined} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={surround ? id : undefined} />
      </div>
    </div>
  );
}

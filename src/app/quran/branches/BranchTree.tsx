'use client';

import React, { useId, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import { ayahEnds, branchesHref, keys, linkId, spell, type Branch, type BranchesView, type Variant } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import AyahContextButton from './AyahContext';
import { Fan, PathBox, PathButton, PathProvider, Stub, usePaths, type FanEntry } from './Paths';
import type { Surrounding } from '@/lib/quran/ayahContext';
import { anchorOf, NeighbourBox, SurroundToggle, targetStyle, useSurrounding, type Around } from './Surroundings';

type Props = { view?: BranchesView; tree: Branch; names: Record<number, string>; variants?: Variant[]; showSpellings?: boolean; juz?: JuzRange | null; renderNode?: (node: Branch, index: number, tags: Record<string, Variant>) => React.ReactNode; label?: string; header?: React.ReactNode; surround?: { on: boolean; sync?: boolean; data?: Surrounding } };
type NodeProps = Omit<Props, 'tree' | 'variants' | 'juz' | 'header' | 'surround'> & { around?: Around; anchors?: string; node: Branch; parent?: Branch; path: string[]; tags: Record<string, Variant>; lead: number; juz?: JuzRange; indices: Map<Branch, number> };

const LIT = 'border-[var(--home-accent)] text-[var(--home-ink)]';
export const TONE: Record<string, string> = {
  '': 'border-[var(--home-muted)] text-[var(--home-ink)]',
  و: 'border-[var(--home-green)] text-[var(--home-green)]',
  ف: 'border-[var(--home-root)] text-[var(--home-root)]',
};

type Refs = { keys: string[]; names: Record<number, string>; tags?: Record<string, Variant> };

export function AyahRefs({ keys, names, tags = {}, className = 'mt-1' }: Refs & { className?: string }) {
  return (
    <span className={`flex flex-wrap gap-1 ${className}`}>
      {keys.map((key, index) => {
        const [surah, ayah] = key.split(':').map(Number);
        return (
          <span key={key} className="inline-flex items-center gap-1">
            {index > 0 && <span aria-hidden className="text-xs text-[var(--home-muted)]">·</span>}
            <span className="text-xs text-[var(--home-muted)]">{names[surah] ? `${names[surah]} ${num(ayah)}` : `${num(surah)}:${num(ayah)}`}</span>
            {tags[key] && <span className={`text-xs font-arabic ${TONE[tags[key].conj]}`}>{tags[key].word}</span>}
          </span>
        );
      })}
    </span>
  );
}

function SubtreeButton({ href }: { href: string }) {
  const { language } = useLanguage();
  const label = language === 'ar' ? 'عرض هذا الجزء من الشجرة وحده' : 'Show only this part of the tree';
  return <Button size="sm" href={href} aria-label={label} title={label}><ZoomIn size={16} aria-hidden /></Button>;
}

export function spellings(node: Pick<Branch, 'forms'>, skip = 0) {
  const found = new Map<string, { words: string[]; keys: string[] }>();
  Object.entries(node.forms ?? {}).forEach(([key, words]) => {
    const text = JSON.stringify(words.slice(skip));
    found.set(text, { words: words.slice(skip), keys: [...(found.get(text)?.keys ?? []), key] });
  });
  return found.size > 1 ? [...found.values()].sort((a, b) => b.keys.length - a.keys.length) : [];
}

export function Marked({ node, ayahKeys, subject, siblings, names, children, skip = 0, offset = 0, enabled = true, references, before, after }: { references?: React.ReactNode; enabled?: boolean; node: Pick<Branch, 'forms'>; ayahKeys: string[]; subject?: string; siblings?: string[]; skip?: number; offset?: number; before?: React.ReactNode; after?: React.ReactNode; names: Record<number, string>; children: React.ReactNode }) {
  if (!enabled) return <>{children}{references}</>;
  const forms = Object.values(node.forms ?? {}).map(words => words.slice(skip));
  const differentWords = (forms[0] ?? []).flatMap((_, i) => new Set(forms.map(words => words[i])).size > 1 ? [offset + skip + i] : []);
  const others = (siblings ?? []).filter(key => !ayahKeys.includes(key));
  return <AyahContextButton ayahKeys={ayahKeys} subject={subject} siblings={others} spellings={spellings(node, skip)} spellingAt={offset + skip} differentWords={differentWords} names={names} references={references} before={before} after={after}>{children}</AyahContextButton>;
}

const nodeId = (index: number) => `n${index}`;

function Node({ node, parent, path, names, tags, lead, juz, renderNode, indices, showSpellings, view, around, anchors }: NodeProps) {
  const root = path.length === 0;
  const words = [...path, ...node.words];
  const shownWords = node.words.slice(root ? lead : 0);
  const id = nodeId(indices.get(node)!);
  const subject = (root ? shownWords : node.words).join(' ');
  const nexts: FanEntry[] = !around ? [] : node.ayat.flatMap(key => {
    const neighbour = around.data.after[around.ends[key]];
    return neighbour ? [{ key: `a${key}`, keys: [key], item: <NeighbourBox neighbour={neighbour} of={key} side="after" around={around} opens={id} /> }] : [];
  });
  const entries: FanEntry[] = [...node.children.map((child, i) => ({ key: `n${i}`, keys: keys(child), item: <Node node={child} parent={node} path={words} names={names} tags={tags} lead={lead} juz={juz} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={anchors} /> })), ...nexts];
  return (
    <div className="flex items-center">
      {(!root || shownWords.length > 0 || node.ayat.length > 0) && <PathBox id={id} keys={keys(node)} lit={LIT} tone={root ? 'border-[var(--home-accent)]' : 'border-[var(--home-rule)]'} className={`shrink-0 rounded border px-3 py-1.5 ${node.children.length === 0 ? 'max-w-sm' : 'max-w-xs'} ${root ? 'bg-[var(--home-paper-deep)] text-xl' : 'bg-[var(--home-paper)] text-lg'}`}>
        {anchors && node.ayat.map(key => <span key={key} data-anchor id={anchorOf(anchors, key)} />)}
        {renderNode && !root ? renderNode(node, indices.get(node)!, tags) : <Marked node={node} ayahKeys={keys(node)} subject={subject} siblings={node.children.length === 0 && parent ? keys(parent) : undefined} names={names} offset={path.length} skip={root ? lead : 0} enabled={showSpellings}
          references={node.ayat.length > 0 && <AyahRefs keys={node.ayat} names={names} tags={tags} />}
          before={<PathButton id={id} keys={keys(node)} subject={subject} />}
          after={!root && node.children.length > 0 && <SubtreeButton href={branchesHref(linkId(words, keys(node).flatMap(key => (tags[key] ? [tags[key].conj] : []))), juz, { ...view, partition: node.partition })} />}>
          <span className="block font-arabic leading-loose">{shownWords.join(' ')}</span>
        </Marked>}
      </PathBox>}
      {entries.length > 0 && <>
        <Stub keys={entries.flatMap(entry => entry.keys)} />
        <Fan side="start" entries={entries} />
      </>}
    </div>
  );
}

function BeforeFan({ ayahKeys, around, opens }: { ayahKeys: string[]; around?: Around; opens: string }) {
  const boxes = !around ? [] : ayahKeys.flatMap(key => (around.data.before[key] ? [{ key, keys: [key], item: <NeighbourBox neighbour={around.data.before[key]!} of={key} side="before" around={around} opens={opens} /> }] : []));
  if (boxes.length === 0) return null;
  return <>
    <Fan side="end" label="الآيات السابقة" entries={boxes} />
    <Stub keys={boxes.map(box => box.key)} />
  </>;
}

// docs/plans/quran-shared-openings.md
export default function BranchTree({ tree, names, variants = [], showSpellings = true, juz = null, renderNode, label = 'شجرة الفواتح', header, view: given, surround }: Props) {
  const id = useId();
  const [on, setOn] = useState(() => (surround?.sync && typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('c') === '1' : surround?.on ?? false));
  const view = surround?.sync && given ? { ...given, context: on } : given;
  const paths = usePaths();
  const all = keys(tree);
  const ends = ayahEnds(tree);
  const { data, isLoading, error } = useSurrounding(!!surround && on, all, ends, surround?.data);
  const around: Around | undefined = surround && on && data ? { data, ends, inTree: new Set(all), names, tree: id } : undefined;
  const indices = new Map<Branch, number>();
  const visit = (node: Branch) => {
    indices.set(node, indices.size - 1);
    node.children.forEach(visit);
  };
  visit(tree);
  const tags = Object.fromEntries(variants.flatMap(variant => variant.keys.map(key => [key, variant])));
  const rootId = nodeId(-1);
  return (
    <PathProvider value={paths}>
      <div tabIndex={0} role="region" aria-label={label} data-tree={id} className="overflow-auto rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-4 text-[var(--home-ink)]">
        {around && <style>{targetStyle(id)}</style>}
        {(header || surround) && <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          {header}
          {surround && <SurroundToggle on={on} onChange={setOn} sync={surround.sync} loading={isLoading} failed={!!error} />}
        </div>}
        <div className="flex w-max items-center">
          {variants.length > 0 ? <>
            <Fan side="end" label="صيغ الكلمة الأولى" entries={variants.map((variant, i) => ({ key: variant.word, keys: variant.keys, item: <>
              <BeforeFan ayahKeys={variant.keys} around={around} opens={`v${i}`} />
              <PathBox id={`v${i}`} keys={variant.keys} lit={LIT} tone={TONE[variant.conj]} className="shrink-0 rounded border-2 bg-[var(--home-paper)] px-3 py-1.5 text-xl font-arabic leading-loose">
                <Marked node={variant} ayahKeys={variant.keys} subject={variant.word} siblings={variants.flatMap(other => other.keys)} names={names} enabled={showSpellings}
                  before={<PathButton id={`v${i}`} keys={variant.keys} subject={variant.word} />}
                  after={!renderNode && <SubtreeButton href={branchesHref(variant.id, juz ?? undefined, { ...view, spelling: spell(variant.word), partition: variant.partition })} />}>
                  <span className="block">{variant.word}</span>
                </Marked>
              </PathBox>
            </> }))} />
            <Stub keys={all} />
          </> : <BeforeFan ayahKeys={all} around={around} opens={rootId} />}
          <Node node={tree} path={[]} names={names} tags={tags} lead={variants.length > 0 ? 1 : 0} juz={juz ?? undefined} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={surround ? id : undefined} />
        </div>
      </div>
    </PathProvider>
  );
}

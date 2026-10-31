'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { Maximize2, Minus, Plus, RotateCw, ZoomIn } from 'lucide-react';
import Button from '@/components/common/Button';
import MushafText from '@/components/common/MushafText';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import { ayahEnds, branchesHref, keys, linkable, linkId, spell, type Branch, type BranchesView, type Variant } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import AyahContextButton from './AyahContext';
import { Fan, PathBox, PathButton, PathProvider, Stub, useOuterPaths, usePaths, type FanEntry } from './Paths';
import type { Surrounding } from '@/lib/quran/ayahContext';
import { anchorOf, NeighbourBox, SurroundToggle, targetStyle, useSurrounding, type Around } from './Surroundings';

type Props = { prefixes?: Variant[]; offsets?: Record<string, number>; subtreeLinks?: Record<string, string>; view?: BranchesView; tree: Branch; names: Record<number, string>; variants?: Variant[]; showSpellings?: boolean; zoomable?: boolean; viewportHeight?: string; juz?: JuzRange | null; renderNode?: (node: Branch, index: number, tags: Record<string, Variant>) => React.ReactNode; label?: string; header?: React.ReactNode; surround?: { on: boolean; sync?: boolean; data?: Surrounding } };
type NodeProps = Omit<Props, 'tree' | 'variants' | 'juz' | 'header' | 'surround'> & { around?: Around; anchors?: string; node: Branch; parent?: Branch; path: string[]; tags: Record<string, Variant>; lead: number; juz?: JuzRange; indices: Map<Branch, number> };

// Every tree node has the same thin border; only a pinned path is coloured.
const LINE = 'border-[var(--home-rule)]';
const LIT = 'border-[var(--home-accent)]';
export const TONE: Record<string, string> = {
  '': 'text-[var(--home-ink)]',
  و: 'text-[var(--home-green)]',
  ف: 'text-[var(--home-root)]',
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
            {tags[key] && <span className={`text-xs font-quran ${TONE[tags[key].conj]}`}><MushafText>{tags[key].word}</MushafText></span>}
          </span>
        );
      })}
    </span>
  );
}

function SubtreeButton({ href }: { href: string }) {
  const { language } = useLanguage();
  const label = language === 'ar' ? 'عرض هذا الجزء وحده' : 'Show only this part of the tree';
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

function Node({ node, parent, path, names, tags, lead, juz, renderNode, indices, showSpellings, view, around, anchors, subtreeLinks }: NodeProps) {
  const root = path.length === 0;
  const words = [...path, ...node.words];
  const shownWords = node.words.slice(root ? lead : 0);
  const boundary = node.ayat.length === 0 && shownWords.length > 0 && shownWords.every(word => word === '۝' || word.startsWith('﴿'));
  const id = nodeId(indices.get(node)!);
  const subject = (root ? shownWords : node.words).join(' ');
  const subtreeHref = linkable(words) ? branchesHref(linkId(words, keys(node).flatMap(key => (tags[key] ? [tags[key].conj] : []))), juz, { ...view, partition: node.partition }) : subtreeLinks?.[keys(node).join(' ')];
  const nexts: FanEntry[] = !around ? [] : node.ayat.flatMap(key => {
    const neighbour = around.data.after[around.ends[key]];
    return neighbour ? [{ key: `a${key}`, keys: [key], item: <NeighbourBox neighbour={neighbour} of={key} side="after" around={around} opens={id} /> }] : [];
  });
  const entries: FanEntry[] = [...node.children.map((child, i) => ({ key: `n${i}`, keys: keys(child), item: <Node node={child} parent={node} path={words} names={names} tags={tags} lead={lead} juz={juz} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={anchors} subtreeLinks={subtreeLinks} /> })), ...nexts];
  return (
    <div className="flex items-center">
      {boundary && <span aria-hidden className="shrink-0 px-1 font-quran text-lg text-[var(--home-muted)]">{shownWords.join(' ')}</span>}
      {!boundary && (!root || shownWords.length > 0 || node.ayat.length > 0) && <PathBox id={id} keys={keys(node)} lit={LIT} tone={LINE} className={`shrink-0 rounded border px-3 py-1.5 ${node.children.length === 0 ? 'max-w-sm' : 'max-w-xs'} bg-[var(--home-paper)] ${root ? 'text-xl' : 'text-lg'}`}>
        {anchors && node.ayat.map(key => <span key={key} data-anchor id={anchorOf(anchors, key)} />)}
        {renderNode && !root ? renderNode(node, indices.get(node)!, tags) : <Marked node={node} ayahKeys={keys(node)} subject={subject} siblings={node.children.length === 0 && parent ? keys(parent) : undefined} names={names} offset={path.length} skip={root ? lead : 0} enabled={showSpellings}
          references={node.ayat.length > 0 && <AyahRefs keys={node.ayat} names={names} tags={tags} />}
          before={<PathButton id={id} keys={keys(node)} subject={subject} />}
          after={!root && view?.kind !== 'inside' && node.children.length > 0 && subtreeHref && <SubtreeButton href={subtreeHref} />}>
          <span className="block font-quran leading-loose"><MushafText>{shownWords.join(' ')}</MushafText></span>
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

const MIN_SCALE = 0.1;
const MAX_SCALE = 2;
const SCALE_STEP = 0.1;

type DiagramSize = { width: number; height: number; availableWidth: number; availableHeight: number };

function fitTreeScale({ width, height, availableWidth, availableHeight }: DiagramSize) {
  return Math.min(MAX_SCALE, availableWidth / width, availableHeight / height);
}

function TreeViewport({ children, controls, enabled, ar, height }: { children: React.ReactNode; controls?: React.ReactNode; enabled: boolean; ar: boolean; height?: string }) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<DiagramSize | null>(null);
  const [manualScale, setManualScale] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const outer = viewport.current;
    const inner = content.current;
    if (!outer || !inner) return;
    const measure = () => {
      const next = {
        width: inner.offsetWidth,
        height: inner.offsetHeight,
        availableWidth: outer.clientWidth,
        availableHeight: height ? outer.clientHeight : Math.max(240, Math.round(window.innerHeight * 0.7)),
      };
      if (!next.width || !next.height || !next.availableWidth) return;
      setSize(previous => previous && Object.keys(next).every(key => previous[key as keyof DiagramSize] === next[key as keyof DiagramSize]) ? previous : next);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [enabled, height]);

  if (!enabled) return <>
    {controls && <div className="mb-3 flex flex-wrap items-center justify-between gap-3">{controls}</div>}
    <div className="flex w-max items-center">{children}</div>
  </>;

  const fitted = size ? fitTreeScale(size) : 1;
  const scale = manualScale ?? fitted;
  const setScale = (next: number) => setManualScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, Number(next.toFixed(2)))));
  const labels = ar ? {
    out: 'تصغير',
    in: 'تكبير',
  } : {
    out: 'Zoom out',
    in: 'Zoom in',
  };
  const frame = size ? { width: size.width * scale, height: size.height * scale } : undefined;
  const viewportHeight = height ?? (size ? Math.min(frame!.height, size.availableHeight) : undefined);

  return <>
    <div dir={ar ? 'rtl' : 'ltr'} className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--home-rule)] pb-3">
      {controls && <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[var(--home-muted)]">{controls}</div>}
      <div role="toolbar" aria-label={ar ? 'تكبير الشجرة' : 'Tree zoom'} className="flex flex-wrap items-center gap-2">
        <Button aria-pressed={manualScale === null} onClick={() => setManualScale(null)}><Maximize2 size={16} aria-hidden />{ar ? 'ملاءمة' : 'Fit'}</Button>
        <div dir="ltr" className="flex items-center gap-1">
          <Button size="icon" onClick={() => setScale(scale - SCALE_STEP)} disabled={scale <= MIN_SCALE} aria-label={labels.out} title={labels.out}><Minus size={16} aria-hidden /></Button>
          <span className="min-w-12 text-center text-sm tabular-nums text-[var(--home-muted)]" aria-live="polite">{ar ? `${num(Math.round(scale * 100))}٪` : `${Math.round(scale * 100)}%`}</span>
          <Button size="icon" onClick={() => setScale(scale + SCALE_STEP)} disabled={scale >= MAX_SCALE} aria-label={labels.in} title={labels.in}><Plus size={16} aria-hidden /></Button>
        </div>
      </div>
    </div>
    <div ref={viewport} data-tree-viewport className={`flex ${manualScale === null ? 'overflow-hidden' : 'overflow-auto'}`} style={{ height: viewportHeight }}>
      <div data-tree-frame className="relative m-auto shrink-0" style={frame}>
        <div ref={content} data-tree-content className="absolute top-0 flex w-max items-center" style={{ insetInlineStart: 0, transform: `scale(${scale})`, transformOrigin: ar ? 'top right' : 'top left' }}>{children}</div>
      </div>
    </div>
  </>;
}

// docs/plans/quran-shared-openings.md
export default function BranchTree({ tree, names, variants = [], prefixes, subtreeLinks, showSpellings = true, zoomable = true, viewportHeight = 'clamp(22rem, 70svh, 36rem)', juz = null, renderNode, label = 'شجرة العبارات المشتركة', header, view: given, surround }: Props) {
  const id = useId();
  const ar = useLanguage().language === 'ar';
  const [on, setOn] = useState(() => (surround?.sync && typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('c') === '1' : surround?.on ?? false));
  const view = surround?.sync && given ? { ...given, context: on } : given;
  const outer = useOuterPaths();
  const own = usePaths();
  const paths = outer ?? own;
  const all = keys(tree);
  const ends = ayahEnds(tree);
  const emptyKeys = (prefixes ?? []).filter(prefix => !prefix.word).flatMap(prefix => prefix.keys);
  const previousKey = (key: string) => {
    const [surah, ayah] = key.split(':').map(Number);
    return ayah > 1 ? `${surah}:${ayah - 1}` : surah === 1 ? '114:6' : undefined;
  };
  const requiredKeys = emptyKeys.filter(key => previousKey(key));
  const mandatory = useSurrounding(requiredKeys.length > 0, requiredKeys, {}, surround?.data);
  const precedingKey = (key: string) => mandatory.data?.before[key]?.key ?? previousKey(key);
  const optionalKeys = all.flatMap(key => emptyKeys.includes(key) ? precedingKey(key) ?? key : key);
  const extraKeys = emptyKeys.flatMap(key => precedingKey(key) ?? []);
  const preloaded = surround?.data && extraKeys.every(key => Number(key.split(':')[1]) === 1 || Object.prototype.hasOwnProperty.call(surround.data!.before, key)) ? surround.data : undefined;
  const { data, isLoading, error } = useSurrounding(!!surround && on, optionalKeys, ends, preloaded);
  const around: Around | undefined = surround && on && (data ?? surround.data) ? { data: (data ?? surround.data)!, ends, inTree: new Set(all), names, tree: id } : undefined;
  const mandatoryAround: Around | undefined = mandatory.data ? { data: mandatory.data, ends, inTree: new Set(all), names, tree: id } : undefined;
  const indices = new Map<Branch, number>();
  const visit = (node: Branch) => {
    indices.set(node, indices.size - 1);
    node.children.forEach(visit);
  };
  visit(tree);
  const tags = Object.fromEntries(variants.flatMap(variant => variant.keys.map(key => [key, variant])));
  const rootId = nodeId(-1);
  const controls = (header || surround) ? <>
    {header}
    {surround && <SurroundToggle on={on} onChange={setOn} sync={surround.sync} loading={isLoading} failed={!!error} />}
  </> : undefined;
  return (
    <PathProvider value={paths}>
      <div tabIndex={0} role="region" aria-label={label} data-tree={id} className={`${zoomable ? 'overflow-hidden' : 'overflow-auto'} rounded-lg border border-[var(--home-rule)] bg-[var(--home-paper)] p-4 text-[var(--home-ink)]`}>
        {around && <style>{targetStyle(id)}</style>}
        {mandatory.isLoading && <p role="status" className="text-sm text-[var(--home-muted)]">{ar ? 'جارٍ تحميل الآيات السابقة' : 'Loading preceding ayat'}</p>}
        {mandatory.error && <div role="alert" className="flex items-center gap-2 text-sm text-[var(--home-accent)]">
          <span>{ar ? 'تعذّر تحميل الآيات السابقة.' : 'Could not load the preceding ayat.'}</span>
          <Button size="sm" onClick={() => void mandatory.mutate()}><RotateCw size={16} aria-hidden />{ar ? 'حاول مجددًا' : 'Try again'}</Button>
        </div>}
        <TreeViewport controls={controls} enabled={zoomable} ar={ar} height={viewportHeight}>
          {prefixes && prefixes.length > 0 ? <>
            <Fan side="end" label={ar ? 'ما قبل العبارة' : 'Before the phrase'} entries={prefixes.flatMap((prefix, i): FanEntry[] => prefix.word ? [{ key: `${prefix.word}:${i}`, keys: prefix.keys, item: <>
              <BeforeFan ayahKeys={prefix.keys} around={around} opens={`p${i}`} />
              <PathBox id={`p${i}`} keys={prefix.keys} lit={LIT} tone={LINE} className="max-w-sm shrink-0 rounded border bg-[var(--home-paper)] px-3 py-1.5 text-xl leading-loose">
                <Marked node={prefix} ayahKeys={prefix.keys} subject={prefix.word} siblings={all} names={names} enabled={showSpellings} before={<PathButton id={`p${i}`} keys={prefix.keys} subject={prefix.word} />}>
                  <span className="block font-quran"><MushafText>{prefix.word}</MushafText></span>
                </Marked>
              </PathBox>
            </> }] : prefix.keys.flatMap(key => {
              const previous = precedingKey(key);
              if (!previous) return [{ key, keys: [key], item: <PathBox id={`p${i}:${key}`} keys={[key]} lit={LIT} tone={LINE} className="shrink-0 rounded border bg-[var(--home-paper)] px-3 py-1.5">
                <span className="block text-base text-[var(--home-muted)]">{ar ? 'بداية السورة' : 'Start of surah'}</span>
                <AyahRefs keys={[key]} names={names} />
              </PathBox> }];
              const neighbour = mandatoryAround?.data.before[key];
              if (!neighbour || !mandatoryAround) return [];
              const earlier = around?.data.before[previous];
              return [{ key, keys: [key], item: <>
                {earlier && around && <><NeighbourBox neighbour={earlier} of={key} side="before" around={around} opens={rootId} nodeId={`earlier${key}`} /><Stub keys={[key]} /></>}
                <NeighbourBox neighbour={neighbour} of={key} side="before" around={mandatoryAround} opens={rootId} />
              </> }];
            }))} />
            <Stub keys={all} />
          </> : variants.length > 0 ? <>
            <Fan side="end" label="صيغ الكلمة الأولى" entries={variants.map((variant, i) => ({ key: variant.word, keys: variant.keys, item: <>
              <BeforeFan ayahKeys={variant.keys} around={around} opens={`v${i}`} />
              <PathBox id={`v${i}`} keys={variant.keys} lit={`${LIT} ${TONE[variant.conj]}`} tone={`${LINE} ${TONE[variant.conj]}`} className="shrink-0 rounded border bg-[var(--home-paper)] px-3 py-1.5 text-xl leading-loose">
                <Marked node={variant} ayahKeys={variant.keys} subject={variant.word} siblings={variants.flatMap(other => other.keys)} names={names} enabled={showSpellings}
                  before={<PathButton id={`v${i}`} keys={variant.keys} subject={variant.word} />}
                  after={!renderNode && <SubtreeButton href={branchesHref(variant.id, juz ?? undefined, { ...view, spelling: spell(variant.word), partition: variant.partition })} />}>
                  <span className="block font-quran"><MushafText>{variant.word}</MushafText></span>
                </Marked>
              </PathBox>
            </> }))} />
            <Stub keys={all} />
          </> : <BeforeFan ayahKeys={all} around={around} opens={rootId} />}
          <Node node={tree} path={[]} names={names} tags={tags} lead={!prefixes && variants.length > 0 ? 1 : 0} juz={juz ?? undefined} renderNode={renderNode} indices={indices} showSpellings={showSpellings} view={view} around={around} anchors={surround ? id : undefined} subtreeLinks={subtreeLinks} />
        </TreeViewport>
      </div>
    </PathProvider>
  );
}

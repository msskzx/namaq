import { router, type Href } from 'expo-router';
import type { CompareTarget } from './compare';
import type { CardWay } from './home';
import { setIntent, type Intent } from './intent';
import { utilityView, type UtilityView } from './settings';

const TAB_OF: Record<Intent['tab'], Href> = { branches: '/branches', compare: '/compare', read: '/read' };

let overTabs = false;

export const noteRootPage = (name: string) => { overTabs = name !== '(tabs)'; };
export const isOverTabs = () => overTabs;

export function toTab(href: Href) {
  const fromOver = overTabs;
  if (fromOver && router.canDismiss()) router.dismissAll();
  router.navigate(href, { withAnchor: true });
  const path = typeof href === 'string' ? href : href.pathname;
  if (path === '/' && !fromOver) router.dismissAll();
}

export const back = () => router.back();

export const toHub = () => router.dismissTo('/quran');

export const toShelf = () => router.dismissTo('/books');

export const openIntent = (intent: Intent) => { setIntent(intent); toTab(TAB_OF[intent.tab]); };

export function openCompare(target: CompareTarget) {
  setIntent({ tab: 'compare', lead: target.lead, other: target.other, ayat: [`${target.lead}:${target.ayat[0]}`, `${target.other}:${target.ayat[1]}`] });
  toTab('/compare');
}

export function openTreesOf(ayah: string) {
  setIntent({ tab: 'branches', ayah });
  toTab('/branches');
}

export function followWay(way: CardWay, target?: CompareTarget) {
  if (way.to === 'mushaf') { setIntent({ tab: 'read', at: way.at }); toTab('/read'); return; }
  if (way.to === 'trees') { openTreesOf(way.ayah); return; }
  if (way.to === 'compare') { const picked = target ?? way.targets[0]; if (picked) openCompare(picked); return; }
  const view = way.to === 'tree' ? 'tree' as const : undefined;
  if (way.tree) toTab({ pathname: '/branches', params: { tree: way.tree, ...(view ? { view } : {}) } });
  else if (way.open) { setIntent(way.open.tab === 'branches' && view ? { ...way.open, view } : way.open); toTab('/branches'); }
}

export const openBookAt = (id: string, ayah: string) => toTab({ pathname: '/book', params: { id, ayah } });
export const openBookPage = (id: string, printed: string) => toTab({ pathname: '/book', params: { id, printed } });

let qiblaAsks = 0;
let qiblaWaiting = false;
export const takeQiblaAsk = () => { const waiting = qiblaWaiting; qiblaWaiting = false; return waiting; };
const qiblaListeners = new Set<() => void>();
export const subscribeQiblaAsks = (listener: () => void) => { qiblaListeners.add(listener); return () => { qiblaListeners.delete(listener); }; };
export const readQiblaAsks = () => qiblaAsks;

export const openUtility = (view: UtilityView, spot?: 'qibla') => {
  utilityView.set(view);
  if (spot) { qiblaAsks++; qiblaWaiting = true; qiblaListeners.forEach(listener => listener()); }
  toTab('/utilities');
};

export const openAyahPage = (key: string, at?: string, word?: number) =>
  router.push({ pathname: '/ayah', params: { key, ...(at ? { at } : {}), ...(word !== undefined ? { word: String(word) } : {}) } });

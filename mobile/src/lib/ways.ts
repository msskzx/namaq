import { router } from 'expo-router';
import type { CompareTarget } from './compare';
import type { CardWay } from './home';
import { setIntent } from './intent';
import { branchView } from './settings';

/** Opens a compare page on its surah pair, scrolled to the card of the target's two ayat. */
export function openCompare(target: CompareTarget) {
  setIntent({ tab: 'compare', lead: target.lead, other: target.other, ayat: [`${target.lead}:${target.ayat[0]}`, `${target.other}:${target.ayat[1]}`] });
  router.navigate('/compare');
}

/** Opens the trees tab on the trees that hold one ayah. */
export function openTreesOf(ayah: string) {
  setIntent({ tab: 'branches', ayah });
  router.navigate('/branches');
}

/** Follows one way out of a saved card; a compare way with several pages is picked first, so it takes the picked one. */
export function followWay(way: CardWay, target?: CompareTarget) {
  if (way.to === 'mushaf') { setIntent({ tab: 'read', at: way.at }); router.navigate('/read'); return; }
  if (way.to === 'trees') { openTreesOf(way.ayah); return; }
  if (way.to === 'compare') { const picked = target ?? way.targets[0]; if (picked) openCompare(picked); return; }
  branchView.set(way.to);
  if (way.tree) router.navigate({ pathname: '/branches', params: { tree: way.tree } });
  else if (way.open) { setIntent(way.open); router.navigate('/branches'); }
}

// «أين كانت؟» (owner, 2026-11-23; atlas sketch, panel 4): a battle's name, and the reader taps its place on the atlas's
// map, every other place of the same layer drawn the same way as a choice. Only a place standing apart from the others
// is asked (shared/battles/atlas.ts lonePlaces), so a tap means one place; the reference is the book that places it.
import battlesData from '../data/battles/battles.json';
import type { AppBattle } from '../battles/battle';
import { layerBattles, lonePlaces, type AtlasLayer } from '../battles/atlas';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';
import { citeSource, uniqueSources } from './sources';

export const ATLAS_WHERE = 'ATLAS_WHERE';
export const ATLAS_WHERE_NAME = 'أين كانت؟';

const BATTLES = battlesData as AppBattle[];

/** «أين كانت غزوة بدر» but «أين كان فتح دمشق»: the verb follows the name's first word. */
const was = (name: string) => (/^(غزوة|سرية|معركة|وقعة)/.test(name) ? 'كانت' : 'كان');

/** Each battle at a place that stands apart on its layer, asked once. */
export function atlasQuestions(random: Random): ChoiceQuestion[] {
  const all = (['life', 'after'] as AtlasLayer[]).flatMap(layer => {
    const battles = layerBattles(BATTLES, layer);
    const places = [...new Set(battles.flatMap(battle => (battle.place ? [battle.place.name] : [])))];
    const lone = new Set(lonePlaces(BATTLES, layer));
    return battles.filter(battle => battle.place && lone.has(battle.place.name)).map((battle): ChoiceQuestion => ({
      key: `${ATLAS_WHERE}:${battle.slug}`,
      family: ATLAS_WHERE,
      promptArabic: `أين ${was(battle.name)} ${battle.name}؟ المس موضعها على الخريطة.`,
      choices: places.map(name => ({ value: name, labelArabic: name })),
      correctAnswer: battle.place!.name,
      map: { layer },
      sources: uniqueSources(battle.place!.refs.map(citeSource)),
      look: { view: 'battle', slug: battle.slug },
      evidence: { claimKeys: [] },
    }));
  });
  return shuffle(all, random);
}

export const atlasWhereQuiz: ChoiceKind = {
  id: ATLAS_WHERE,
  name: ATLAS_WHERE_NAME,
  // Tapped on a map: a party's screens draw choices as rows, so it stays solo for now.
  party: false,
  questions: (_scope, _difficulty, random, limit = Infinity) => atlasQuestions(random).slice(0, limit),
  count: () => atlasQuestions(Math.random).length,
};

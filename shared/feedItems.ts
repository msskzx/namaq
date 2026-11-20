/**
 * The lasting ids of feed cards' items (`card:<kind>:<item>` bookmarks, shared/bookmarkKind.ts), one place for the app's
 * feed (mobile HomeFeed LIST_OF) and the website's (src/lib/feedCard.ts), so a card saved on one is found on the other.
 */

/** A passage of Ibn Rajab: its hadith's number and its first paragraph's place in the chapter. */
export const rajabItem = (n: number, paragraph: number) => `${n}-${paragraph}`;
/** A battle's moment: the battle and the moment's number, from 1. */
export const momentItem = (battle: string, n: number) => `${battle}-${n}`;
/** A prophet's story card: the prophet and the story's phase. */
export const storyItem = (slug: string, phase: number) => `${slug}-${phase}`;
/** A virtue («من التراجم»): the person and the virtue's place in their entry. */
export const virtueItem = (person: string, index: number) => `${person}-${index}`;
/** A «صلة» card: the two people. */
export const tieItem = (a: string, b: string) => `${a},${b}`;
/** A laqab or kunya card: the person and the name. */
export const nameItem = (person: string, name: string) => `${person}|${name}`;

/** Splits an item made by `rajabItem`, `momentItem`, `storyItem` or `virtueItem` at its last «-»: what comes before and the number after. */
export function lastNumber(item: string): { head: string; n: number } | null {
  const at = item.lastIndexOf('-');
  const n = Number(item.slice(at + 1));
  return at > 0 && Number.isInteger(n) ? { head: item.slice(0, at), n } : null;
}

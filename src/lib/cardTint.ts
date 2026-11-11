// The website side of the card tint (shared/cardTint.ts): kept per device in localStorage and applied
// as <html data-card-light / data-card-dark>, which src/app/theme.css reads.
import { parseCardTint, type CardMode } from '@shared/cardTint';

const STORAGE = { light: 'card-light', dark: 'card-dark' } as const;
const ATTRIBUTE = { light: 'data-card-light', dark: 'data-card-dark' } as const;

export function readCardTint(mode: CardMode): string {
  try { return parseCardTint(mode, localStorage.getItem(STORAGE[mode])); } catch { return parseCardTint(mode, null); }
}

export function setCardTint(mode: CardMode, key: string) {
  const value = parseCardTint(mode, key);
  try { localStorage.setItem(STORAGE[mode], value); } catch { /* private mode: still applies for this visit */ }
  document.documentElement.setAttribute(ATTRIBUTE[mode], value);
}

/** Runs in <head> before the first paint so a stored tint never flashes the default. */
export const CARD_TINT_SCRIPT = `try{var d=document.documentElement,l=localStorage.getItem('${STORAGE.light}'),k=localStorage.getItem('${STORAGE.dark}');if(l)d.setAttribute('${ATTRIBUTE.light}',l);if(k)d.setAttribute('${ATTRIBUTE.dark}',k)}catch(e){}`;

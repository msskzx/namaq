import { createContext, useContext } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

/**
 * Wide screens (an iPad, owner 2026-11-23): every page sits in a centred column as wide as a big phone's page could use,
 * the sides keeping the page colour. Home lying down is the one page that spreads to two columns of phone-size cards, and
 * the mushaf lying down shows two facing pages.
 */
export const COLUMN = 680;
/** Home's two columns lying down, together. */
export const WIDE_COLUMN = 1240;
/** The gap between home's two columns, as wide as a page's own side padding twice. */
export const COLUMN_GAP = 16;
/** A window at least this wide and wider than tall is a tablet lying down (a phone stays standing; a narrow split window stays one column). */
const WIDE = 900;

/** An iPad, or an Android screen whose short side is a tablet's. Phones stay standing (owner, 2026-11-23); tablets turn. */
export function isTablet(width: number, height: number) {
  if (Platform.OS === 'ios') return Platform.isPad;
  return Math.min(width, height) >= 600;
}

/** Lying down on a tablet's wide window: home in two columns, the mushaf in two pages. */
export const isWide = (width: number, height: number) => width >= WIDE && width > height;

/** How far a page's column sits in from each side of a window this wide. */
export const columnSide = (width: number, column = COLUMN) => Math.max(0, Math.round((width - column) / 2));

export function useColumnSide(column = COLUMN) {
  return columnSide(useWindowDimensions().width, column);
}

export function useWide() {
  const { width, height } = useWindowDimensions();
  return isWide(width, height);
}

const PageWidth = createContext<number | null>(null);

/** Gives the pieces inside the width of the page they sit in, when it is not the column's (one of home's two columns). */
export const PageWidthProvider = PageWidth.Provider;

/**
 * The width of the page a piece sits in: the screen's on a phone, the column's on a tablet. Pieces that size themselves
 * from the page (a card's drawing, an ayah's words) read it here, never from the window.
 */
export function usePageWidth() {
  const own = useContext(PageWidth);
  const { width } = useWindowDimensions();
  return own ?? Math.min(width, COLUMN);
}

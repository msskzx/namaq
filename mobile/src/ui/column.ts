import { createContext, useContext } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export const COLUMN = 680;
export const WIDE_COLUMN = 1240;
export const COLUMN_GAP = 16;
const WIDE = 900;

export function isTablet(width: number, height: number) {
  if (Platform.OS === 'ios') return Platform.isPad;
  return Math.min(width, height) >= 600;
}

export const isWide = (width: number, height: number) => width >= WIDE && width > height;

export const columnSide = (width: number, column = COLUMN) => Math.max(0, Math.round((width - column) / 2));

export function useColumnSide(column = COLUMN) {
  return columnSide(useWindowDimensions().width, column);
}

export function useWide() {
  const { width, height } = useWindowDimensions();
  return isWide(width, height);
}

const PageWidth = createContext<number | null>(null);

export const PageWidthProvider = PageWidth.Provider;

export function usePageWidth() {
  const own = useContext(PageWidth);
  const { width } = useWindowDimensions();
  return own ?? Math.min(width, COLUMN);
}

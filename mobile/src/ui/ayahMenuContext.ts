import { createContext } from 'react';
import type { MenuAt } from './FloatingMenu';

/**
 * Opens the reader's long-press menu on an ayah where the finger pressed (components/AyahMenuHost.tsx draws it), with the
 * ayat the view holds (several: the menu asks which). Null where it must not open: inside a sheet, whose modal the menu
 * would open under (Sheet sets it), a share picture, a test.
 */
export type OpenAyahMenu = (keys: readonly string[], at: MenuAt) => void;

export const AyahMenuContext = createContext<OpenAyahMenu | null>(null);

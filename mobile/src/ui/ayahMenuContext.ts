import { createContext } from 'react';
import type { MenuAt } from './FloatingMenu';

export type OpenAyahMenu = (keys: readonly string[], at: MenuAt) => void;

export const AyahMenuContext = createContext<OpenAyahMenu | null>(null);

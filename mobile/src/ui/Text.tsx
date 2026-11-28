import { createContext, useContext, type ComponentProps } from 'react';
import { Platform, StyleSheet, Text as NativeText, TextInput as NativeTextInput, type StyleProp, type TextStyle } from 'react-native';
import { UI_FONT, UI_FONT_BOLD } from '@/lib/theme';
import { textDirection } from '@/lib/rtl';
import { UI_SCALE } from '@shared/quran/compareCardLook';

export { UI_SCALE };
const DEFAULT_SIZE = 14;

type Role = 'ui' | 'other';
const Inside = createContext<Role | null>(null);

const isBold = (weight: TextStyle['fontWeight']) => weight === 'bold' || Number(weight) >= 600;
const scaled = (value: number) => Math.round(value * UI_SCALE);

export function uiStyle(style: StyleProp<TextStyle>, parent: Role | null): { style: StyleProp<TextStyle>; role: Role } {
  const flat = StyleSheet.flatten(style) ?? {};
  if (flat.fontFamily || parent === 'other') return { style, role: 'other' };
  const bold = isBold(flat.fontWeight);
  const patch: { -readonly [K in keyof TextStyle]: TextStyle[K] } = {};
  if (!parent || bold || flat.fontWeight !== undefined) patch.fontFamily = bold ? UI_FONT_BOLD : UI_FONT;
  if (bold) patch.fontWeight = 'normal';
  if (flat.fontSize !== undefined) patch.fontSize = scaled(flat.fontSize);
  else if (!parent) patch.fontSize = scaled(DEFAULT_SIZE);
  if (typeof flat.lineHeight === 'number') patch.lineHeight = scaled(flat.lineHeight);
  return { style: Object.keys(patch).length ? [style, patch] : style, role: 'ui' };
}

function rtlStyle(style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  return [style, textDirection(StyleSheet.flatten(style) ?? {}, Platform.OS !== 'web')];
}

export function Text({ style, ...props }: ComponentProps<typeof NativeText>) {
  const parent = useContext(Inside);
  const ui = uiStyle(style, parent);
  const text = <NativeText selectable={false} {...props} style={parent ? ui.style : rtlStyle(ui.style)} />;
  return ui.role === parent ? text : <Inside.Provider value={ui.role}>{text}</Inside.Provider>;
}

export function TextInput({ style, ...props }: ComponentProps<typeof NativeTextInput>) {
  return <NativeTextInput {...props} style={[{ minWidth: 0 }, uiStyle(style, null).style]} />;
}


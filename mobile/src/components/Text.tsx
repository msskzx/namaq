import { createContext, useContext, type ComponentProps } from 'react';
import { Platform, StyleSheet, Text as NativeText, TextInput as NativeTextInput, type StyleProp, type TextStyle } from 'react-native';
import { QURAN_FONT, UI_FONT, UI_FONT_BOLD } from '@/lib/theme';
import { textDirection } from '@/lib/rtl';

/** Amiri draws smaller than a system font at the same size, so interface sizes grow by this much (the website's type scale does the same). */
export const UI_SCALE = 1.12;
const DEFAULT_SIZE = 14;

type Role = 'ui' | 'other';
const Inside = createContext<Role | null>(null);

const isBold = (weight: TextStyle['fontWeight']) => weight === 'bold' || Number(weight) >= 600;
const scaled = (value: number) => Math.round(value * UI_SCALE);

/**
 * The interface font for a text's own style. Text with a font of its own (the Quran font) keeps it,
 * and so do its nested texts; other text gets Amiri, bold weights taking Amiri's bold file, sizes scaled once.
 */
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

/** Right-to-left for a top-level text: see textDirection in lib/rtl. */
function rtlStyle(style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  return [style, textDirection(StyleSheet.flatten(style) ?? {}, Platform.OS !== 'web')];
}

/** React Native's Text in the app's interface font. Import this instead of Text from react-native. Not selectable unless asked, as on a phone, so a tap on the web build doesn't select words. */
export function Text({ style, ...props }: ComponentProps<typeof NativeText>) {
  const parent = useContext(Inside);
  const ui = uiStyle(style, parent);
  const text = <NativeText selectable={false} {...props} style={parent ? ui.style : rtlStyle(ui.style)} />;
  return ui.role === parent ? text : <Inside.Provider value={ui.role}>{text}</Inside.Provider>;
}

/**
 * React Native's TextInput in the interface font, unless it sets a font (the quiz leaves use the Quran font).
 * minWidth 0 lets a flex input shrink on the web, where Amiri's wider default width would push its icon out.
 */
export function TextInput({ style, ...props }: ComponentProps<typeof NativeTextInput>) {
  return <NativeTextInput {...props} style={[{ minWidth: 0 }, uiStyle(style, null).style]} />;
}


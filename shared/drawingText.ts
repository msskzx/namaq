/**
 * Where a drawing and a sentence tell the same thing, one shows at a time (owner 2026-11-20, sketch layout-cleanup panel 3):
 * a «الرسم | النص» switch, the drawing first. The app's ui/Tabs and the website's Segmented draw it.
 */
export type DrawingOrText = 'drawing' | 'text';
export const DRAWING_OR_TEXT = [{ key: 'drawing', label: 'الرسم' }, { key: 'text', label: 'النص' }] as const satisfies readonly { key: DrawingOrText; label: string }[];

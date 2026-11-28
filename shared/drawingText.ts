export type DrawingOrText = 'drawing' | 'text';
export const DRAWING_OR_TEXT = [{ key: 'drawing', label: 'الرسم' }, { key: 'text', label: 'النص' }] as const satisfies readonly { key: DrawingOrText; label: string }[];

import { mushafText } from '@shared/quran/mushafText';

/**
 * The text as the app's mushaf font draws it. The font turns an ayah number into its own medallion,
 * so the ﴿﴾ the data puts around a number would draw a second frame around it.
 */
export const quranText = (text: string) => mushafText(text.replace(/﴿([٠-٩]+)﴾/g, '$1'));

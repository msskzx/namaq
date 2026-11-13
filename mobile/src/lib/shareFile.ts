import * as Sharing from 'expo-sharing';

/** captureRef's result on the phone: a file in the cache. */
export const CAPTURE_RESULT = 'tmpfile' as const;

/** Opens the phone's share sheet with the image file. */
export async function shareImageFile(uri: string) {
  await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: 'مشاركة الصورة' });
}

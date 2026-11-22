import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library/legacy';

/** captureRef's result on the phone: a file in the cache. */
export const CAPTURE_RESULT = 'tmpfile' as const;

/** Opens the phone's share sheet with the image file. */
export async function shareImageFile(uri: string) {
  await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: 'مشاركة الصورة' });
}

/** Saves the pictures to the phone's photos, in order (a story's pictures, for a post of several); false when not allowed. */
export async function saveImageFiles(uris: string[]): Promise<boolean> {
  const { granted } = await MediaLibrary.requestPermissionsAsync(true);
  if (!granted) return false;
  for (const uri of uris) await MediaLibrary.saveToLibraryAsync(uri);
  return true;
}

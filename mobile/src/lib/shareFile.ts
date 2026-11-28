import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library/legacy';

export const CAPTURE_RESULT = 'tmpfile' as const;

export async function shareImageFile(uri: string) {
  await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: 'مشاركة الصورة' });
}

export async function saveImageFiles(uris: string[]): Promise<boolean> {
  const { granted } = await MediaLibrary.requestPermissionsAsync(true);
  if (!granted) return false;
  for (const uri of uris) await MediaLibrary.saveToLibraryAsync(uri);
  return true;
}

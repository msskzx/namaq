import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { QURAN_FONT } from './theme';

/** The Hafs font for the recorder page, inlined so the web view draws the same letters as the app. */
export async function fontFace() {
  const asset = await Asset.fromModule(require('../../assets/fonts/UthmanicHafs1Ver18.ttf')).downloadAsync();
  const data = await new File(asset.localUri ?? asset.uri).base64();
  return `@font-face{font-family:"${QURAN_FONT}";src:url(data:font/ttf;base64,${data}) format("truetype");}`;
}

/** Saves the recorded video in the app's cache and opens the phone's share sheet. */
export async function shareVideo(data: string, mime: string) {
  const file = new File(Paths.cache, `namaq-tree.${mime.includes('mp4') ? 'mp4' : 'webm'}`);
  if (file.exists) file.delete();
  file.create();
  file.write(data, { encoding: 'base64' });
  await Sharing.shareAsync(file.uri, { mimeType: mime, dialogTitle: 'مشاركة الفيديو' });
}

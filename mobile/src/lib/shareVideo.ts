import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { QURAN_FONT, UI_FONT } from './theme';

/** The Hafs font for the recorder page, inlined so the web view draws the same letters as the app. */
export async function fontFace() {
  const face = async (family: string, module: number, weight = 'normal') => {
    const asset = await Asset.fromModule(module).downloadAsync();
    const data = await new File(asset.localUri ?? asset.uri).base64();
    return `@font-face{font-family:"${family}";font-weight:${weight};src:url(data:font/ttf;base64,${data}) format("truetype");}`;
  };
  return (await face(QURAN_FONT, require('../../assets/fonts/UthmanicHafs1Ver18.ttf'))) + (await face(UI_FONT, require('../../assets/fonts/Amiri-Regular.ttf')))
    + (await face(UI_FONT, require('../../assets/fonts/Amiri-Bold.ttf'), 'bold'));
}

/** Saves the recorded video in the app's cache and opens the phone's share sheet. */
export async function shareVideo(data: string, mime: string) {
  const file = new File(Paths.cache, `namaq-tree.${mime.includes('mp4') ? 'mp4' : 'webm'}`);
  if (file.exists) file.delete();
  file.create();
  file.write(data, { encoding: 'base64' });
  await Sharing.shareAsync(file.uri, { mimeType: mime, dialogTitle: 'مشاركة الفيديو' });
}

import { Asset } from 'expo-asset';
import { UI_FONT } from './theme';
import { QURAN_FAMILY, QURAN_FONT_FILE } from '@/components/quran/text/quranFont';
import { reportError } from '@shared/errors';

export async function fontFace() {
  const face = (family: string, module: number, weight = 'normal') => `@font-face{font-family:"${family}";font-weight:${weight};src:url("${new URL(Asset.fromModule(module).uri, window.location.href).href}") format("truetype");}`;
  return face(QURAN_FAMILY, QURAN_FONT_FILE) + face(UI_FONT, require('../../assets/fonts/Amiri-Regular.ttf'))
    + face(UI_FONT, require('../../assets/fonts/Amiri-Bold.ttf'), 'bold');
}

export async function shareVideo(data: string, mime: string) {
  const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  const file = new File([bytes], `namaq-tree.${mime.includes('mp4') ? 'mp4' : 'webm'}`, { type: mime });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); } catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) reportError('share video', error); }
    return;
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

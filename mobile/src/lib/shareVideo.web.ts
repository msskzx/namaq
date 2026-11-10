import { Asset } from 'expo-asset';
import { QURAN_FONT } from './theme';

export async function fontFace() {
  const asset = Asset.fromModule(require('../../assets/fonts/UthmanicHafs1Ver18.ttf'));
  return `@font-face{font-family:"${QURAN_FONT}";src:url("${new URL(asset.uri, window.location.href).href}") format("truetype");}`;
}

/** The browser's share sheet with the file, or a download where it cannot share files. */
export async function shareVideo(data: string, mime: string) {
  const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  const file = new File([bytes], `namaq-tree.${mime.includes('mp4') ? 'mp4' : 'webm'}`, { type: mime });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file] }); } catch {}
    return;
  }
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

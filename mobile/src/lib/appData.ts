import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { readAsStringAsync } from 'expo-file-system/legacy';
import { provideAppData } from '@shared/appData';

/**
 * The data files that ship as assets (shared/appDataFiles.json, the same list in the same order): on the phone each
 * import is an asset's number (metro.config.js). Read them all before the app starts (app/_layout.tsx).
 */
const FILES: (number | string | { uri: string })[] = [
  require('@shared/data/quran/tafsirSadi.json'),
  require('@shared/data/quran/mutashabih.json'),
  require('@shared/data/quran/trees.json'),
  require('@shared/data/quran/branchVerdicts.json'),
  require('@shared/data/hadith/ibnRajab.json'),
  require('@shared/data/events/stories.json'),
  require('@shared/data/tarajim/people.json'),
  require('@shared/data/events/life.json'),
  require('@shared/data/links.json'),
];

/**
 * The file's text. On the phone, expo-updates (Expo Go, an update) or the app binary already holds it at `localUri`;
 * the legacy reader is the long-documented way to read such an asset, the new File API and fetch are kept as fallbacks.
 */
async function read(id: (typeof FILES)[number]): Promise<string> {
  const asset = Asset.fromModule(id as number);
  if (Platform.OS === 'web') return (await fetch(asset.uri)).text();
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  const tries = [() => readAsStringAsync(uri), () => new File(uri).text(), async () => (await fetch(uri)).text()];
  let failure: unknown;
  for (const attempt of tries) {
    try {
      return await attempt();
    } catch (error) {
      failure = error;
    }
  }
  throw failure;
}

/** One file after another, so no more than one file's text and its parse are held at once beside what is loaded. */
export async function loadAppData() {
  for (const id of FILES) provideAppData(id, JSON.parse(await read(id)));
}

import { setBookmarkStorage } from '@shared/bookmarks';
import { deviceStorage } from './deviceStorage';

export function readJson<T>(key: string): T | undefined {
  try {
    const raw = deviceStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : undefined;
  } catch {
    return undefined;
  }
}

export function writeJson(key: string, value: unknown) {
  try { deviceStorage.setItem(key, JSON.stringify(value)); } catch {}
}

setBookmarkStorage(deviceStorage);

const loaded = new Map<unknown, unknown>();

export function provideAppData(asset: unknown, value: unknown) {
  loaded.set(asset, value);
}

export function dataOf<T>(imported: T): T {
  if (loaded.has(imported)) return loaded.get(imported) as T;
  if (typeof imported === 'number' || typeof imported === 'string' || (typeof imported === 'object' && imported !== null && 'uri' in imported))
    throw new Error('a data file was read before mobile/src/lib/appData.ts loaded it');
  return imported;
}

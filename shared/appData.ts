/**
 * The app's largest data files travel beside its code, not inside it (data plan step 7, owner 2026-11-24): an update
 * then downloads only the files that changed, not all the data with every change of code. On the phone, importing one
 * of the files in shared/appDataFiles.json gives a reference to an asset (mobile/metro.config.js), which
 * mobile/src/lib/appData.ts reads before the app starts; everywhere else (the website, the tests) the import is the
 * data itself. Code the phone runs reads such an import through `dataOf`, so both get the data.
 */
const loaded = new Map<unknown, unknown>();

/** The phone's loader hands each file over once it has read it, keyed by what the import gave (an asset reference). */
export function provideAppData(asset: unknown, value: unknown) {
  loaded.set(asset, value);
}

export function dataOf<T>(imported: T): T {
  if (loaded.has(imported)) return loaded.get(imported) as T;
  // An asset's number (native) or address (web) that the loader has not read yet.
  if (typeof imported === 'number' || typeof imported === 'string' || (typeof imported === 'object' && imported !== null && 'uri' in imported))
    throw new Error('a data file was read before mobile/src/lib/appData.ts loaded it');
  return imported;
}

// The places of data/catalog/places as the app draws them (shared/battles/places.ts): each book's words with its page
// and link, then the GeoNames records of the pin. scripts/battles/buildAppBattles.ts writes them to shared/data/places.json.
import type { AppCite } from '@shared/battles/battle';
import { GEONAMES } from '@shared/battles/geonames';
import type { Place } from '@shared/battles/places';
import { SOURCES } from '@shared/sources';
import type { Catalog, CatalogPlace } from './types';

const digits = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

function bookRef(book: CatalogPlace['books'][number]): AppCite {
  const source = SOURCES.find(each => each.id === book.source);
  if (!source) throw new Error(`no source ${book.source} in shared/sources.ts`);
  const where = book.volume === undefined ? `ص ${digits(book.page)}` : `${digits(book.volume)}/${digits(book.page)}`;
  return { text: book.text, cite: `${source.title.ar}، ${where}`, url: `${source.link.url}/${book.shamela}` };
}

const geonamesRef = (id: number): AppCite => ({ text: '', cite: `${GEONAMES}، رقم ${digits(id)}`, url: `https://www.geonames.org/${id}` });

export function appPlaces(catalog: Catalog): Record<string, Place> {
  return Object.fromEntries(
    (catalog.places ?? []).map(place => [
      place.slug,
      { name: place.name, at: [place.at[0], place.at[1]], refs: [...place.books.map(bookRef), ...place.geonames.map(geonamesRef)] },
    ]),
  );
}

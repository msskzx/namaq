import { diffAgainstCatalog, type CatalogLike } from '../../src/lib/model/diff';
import { loadModel } from '../../src/lib/model/load';
import { profilesFromModel } from '../../src/lib/model/profile';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: tsx scripts/model/diff.ts <person-slug>');
  process.exit(1);
}
async function main() {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error(`"${slug}" is not a person slug`);
    process.exit(1);
  }
  const { default: catalog } = (await import(`../../data/catalog/people/${slug}.ts`).catch(() => {
    console.error(`no catalog entry for "${slug}"`);
    process.exit(1);
  })) as { default: CatalogLike };
  const entries = profilesFromModel(loadModel('.'), '.').get(slug) ?? [];
  if (entries.length === 0) console.log('The model has no entries for this person yet.');
  for (const { field, status, catalog: old, model } of diffAgainstCatalog(entries, catalog)) {
    console.log(`${status.padEnd(12)} ${field}`);
    if (old) console.log(`    catalog: ${old}`);
    if (model) console.log(`    model:   ${model}`);
  }
}

main();

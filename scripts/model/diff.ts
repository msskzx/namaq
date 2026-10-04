import { diffAgainstCatalog, type CatalogLike } from '../../src/lib/model/diff';
import { loadModel } from '../../src/lib/model/load';
import { profilesFromModel } from '../../src/lib/model/profile';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: tsx scripts/model/diff.ts <person-slug>');
  process.exit(1);
}
async function main() {
  const { default: catalog } = (await import(`../../data/catalog/people/${slug}.ts`)) as {
    default: CatalogLike;
  };
  const entries = profilesFromModel(loadModel('.'), '.').get(slug) ?? [];
  for (const { field, status, catalog: old, model } of diffAgainstCatalog(entries, catalog)) {
    console.log(`${status.padEnd(12)} ${field}`);
    if (old) console.log(`    catalog: ${old}`);
    if (model) console.log(`    model:   ${model}`);
  }
}

main();

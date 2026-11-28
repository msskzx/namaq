import { loadCatalog } from "../../src/lib/catalog/loadCatalog";

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: npm run catalog:story -- <event slug>");
  process.exit(1);
}
void loadCatalog().then((catalog) => {
  const event = catalog.events.find((each) => each.slug === slug);
  if (!event) {
    console.error(`no event ${slug} in data/catalog/events`);
    process.exit(1);
  }
  console.log(`${event.name} (${event.slug})\n`);
  for (const [i, report] of (event.reports ?? []).entries()) {
    const source = report.source as {
      slug: string;
      hadith?: number;
      page?: number;
    };
    console.log(`── ${i + 1}. ${source.slug} ${source.hadith ?? source.page}`);
    if (report.isnad) console.log(`   ${report.isnad}`);
    for (const moment of report.moments) {
      console.log(
        `\n   [${moment.title}] (${moment.people.join("، ")})\n   ${moment.text}`,
      );
      for (const turn of moment.turns ?? [])
        console.log(
          `     ${turn.speaker ? `${turn.speaker.name}: ` : "— "}${turn.lead ? `[${turn.lead}] ` : ""}${turn.text.slice(turn.lead?.length ?? 0)}`,
        );
    }
    if (report.grading) console.log(`   ${report.grading}`);
    console.log("");
  }
  for (const ayat of event.ayat ?? []) {
    console.log(
      `── ${ayat.kind} ${ayat.from}–${ayat.to}${ayat.about ? ` (${ayat.about})` : ""}`,
    );
    for (const evidence of ayat.evidence) console.log(`   «${evidence.quote}»`);
    for (const other of ayat.others ?? [])
      for (const evidence of other.evidence)
        console.log(`   ${other.label}: «${evidence.quote}»`);
  }
});

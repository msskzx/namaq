import { readdirSync } from "node:fs";
import path from "node:path";
import { mergedPrs, parseUsedLine, usedLine } from "./usage";

const prs = mergedPrs(process.argv);

const recordsDir = path.join(__dirname, "../../docs/records");
const slugs = readdirSync(recordsDir).filter((f) => /^R\d{4}-.*\.md$/.test(f)).map((f) => f.slice(0, -3));

const uses = new Map<string, number[]>();
const unresolved: string[] = [];
let withLine = 0;
for (const pr of prs) {
  const line = usedLine(pr.body);
  if (line === null) continue;
  withLine++;
  const parsed = parseUsedLine(line, slugs);
  for (const id of parsed.used) uses.set(id, [...(uses.get(id) ?? []), pr.number]);
  for (const u of parsed.unresolved) unresolved.push(`#${pr.number} "${u.text}": ${u.reason}`);
}

console.log(`${prs.length} merged PRs read, ${withLine} with a "Records used:" line.\n`);
for (const [id, nums] of [...uses].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${nums.length}  ${id}  PRs ${nums.map((n) => "#" + n).join(" ")}`);
}
const unused = slugs.filter((s) => !uses.has(`namaq/${s}`));
if (unused.length) console.log(`\nNever used: ${unused.join(", ")}`);
if (unresolved.length) console.log(`\nNot counted:\n${unresolved.join("\n")}`);

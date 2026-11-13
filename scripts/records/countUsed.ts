// Counts the "Records used:" line across merged PRs. Needs the gh CLI signed in.
// Usage: npm run records:used [-- --limit 500]
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";

const limitArg = process.argv.indexOf("--limit");
const limit = limitArg > -1 ? process.argv[limitArg + 1] : "1000";

const prs: { number: number; body: string }[] = JSON.parse(
  execFileSync(
    "gh",
    ["pr", "list", "--state", "merged", "--limit", limit, "--json", "number,body"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  ),
);

const recordsDir = path.join(__dirname, "../../docs/records");
const titles = new Map(
  readdirSync(recordsDir)
    .filter((f) => /^\d{4}-.*\.md$/.test(f))
    .map((f) => [f.slice(0, 4), f.slice(5, -3)]),
);

const uses = new Map<string, number[]>();
let withLine = 0;
for (const pr of prs) {
  const line = pr.body?.match(/^Records used:(.*)$/im);
  if (!line) continue;
  withLine++;
  for (const id of new Set(line[1].match(/\b\d{4}\b/g) ?? [])) {
    uses.set(id, [...(uses.get(id) ?? []), pr.number]);
  }
}

console.log(`${prs.length} merged PRs read, ${withLine} with a "Records used:" line.\n`);
for (const [id, nums] of [...uses].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${id}  ${nums.length}  ${titles.get(id) ?? "(no such record)"}  PRs ${nums.map((n) => "#" + n).join(" ")}`);
}
const unused = [...titles.keys()].filter((id) => !uses.has(id));
if (unused.length) console.log(`\nNever used: ${unused.join(", ")}`);

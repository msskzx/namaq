import { spawnSync } from 'node:child_process';

// Step order and what each one owns: README.md's "Local setup" and docs/data-pipelines.md.
// Quiz review/approval gates: docs/quiz-question-review.md.
const steps: { label: string; args: string[] }[] = [
  { label: 'catalog:validate', args: ['run', 'catalog:validate'] },
  { label: 'catalog:project --apply', args: ['run', 'catalog:project', '--', '--apply'] },
  { label: 'people:sync --apply', args: ['run', 'people:sync', '--', '--apply'] },
  { label: 'catalog:project-graph --apply', args: ['run', 'catalog:project-graph', '--', '--apply'] },
  { label: 'battles:sync --apply', args: ['run', 'battles:sync', '--', '--apply'] },
  { label: 'titles:sync --apply', args: ['run', 'titles:sync', '--', '--apply'] },
  { label: 'events:sync --apply', args: ['run', 'events:sync', '--', '--apply'] },
  { label: 'graph:layout --apply', args: ['run', 'graph:layout', '--', '--apply'] },
  { label: 'quiz:generate', args: ['run', 'quiz:generate'] },
  { label: 'quiz:validate', args: ['run', 'quiz:validate'] },
  { label: 'quiz:project (dry run)', args: ['run', 'quiz:project'] },
];

for (const step of steps) {
  console.log(`\n▶ ${step.label}`);
  const result = spawnSync('npm', step.args, { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`\n✗ ${step.label} failed — stopping.`);
    process.exit(result.status ?? 1);
  }
}

console.log(
  '\n✓ Catalog synced to PostgreSQL and Neo4j, layout recomputed, questions generated.\n' +
    'quiz:project ran as a dry run only — review pending questions per docs/quiz-question-review.md,\n' +
    'then run `npm run quiz:project -- --apply` yourself once satisfied.',
);

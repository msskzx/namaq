# Namaq

نَمَق تطبيق تعليمي موجّه للمسلمين وطلاب العلم، والعربية لغته الأساسية.
يعين على تعلّم القرآن الكريم والحديث النبوي وتاريخ صدر الإسلام من خلال
التصورات التفاعلية والاختبارات، مع إتاحة نصوص المصادر للقراءة المتعمقة.
التركيز الحالي على تدبّر القرآن.

[افتح نَمَق](https://namaq.app).

Namaq is an Arabic-first learning application for Muslims and students of Islamic
knowledge. It helps people learn the Quran, Hadith, and early Islamic history
through interactive visualizations and quizzes, with source texts available
for deeper reading. The current public focus is Quran learning and reflection.

[Open Namaq](https://namaq.app).

## Documentation

- [Product goal and phases](docs/product-roadmap.md).
- [Local setup and verification](docs/local-setup.md).
- [Shared ayah openings](docs/plans/quran-shared-openings.md): opening trees and phrase trees inside ayat, with scoped search, juz filtering, and word matches checked against corpus roots.
- Data architecture and design: [data pipelines](docs/data-pipelines.md),
  [the data-model plan](docs/plans/data-model/plan.md), and
  [architecture decisions](docs/adr/).
- Graph design: [exploration](docs/graph-exploration.md),
  [search](docs/graph-search.md), and [layout](docs/graph-layout.md).
- [Contribution rules](AGENTS.md).

## Data and evidence

[Data pipelines](docs/data-pipelines.md) explains how source pages, claims, and
catalog records build the data served by the app. The
[extraction checklist](docs/extraction-checklist.md) describes how to check an
entry's completeness and account for values whose evidence is still owed.
[Quiz question review](docs/quiz-question-review.md) covers the question bank's
evidence and publication checks.

Source text, attributed claims, editorial analysis, and review status have
separate roles. The [attribution rules](docs/adr/0022-a-shown-value-rests-on-an-attributed-statement.md)
and [data-model plan](docs/plans/data-model/plan.md) describe the intended model
for those distinctions. Its [progress record](docs/plans/data-model/progress.md)
tracks implementation.

The reasoning and lessons from building Namaq live in
[Distillate](https://distillate-kappa.vercel.app/):

- [Text to evidence](https://distillate-kappa.vercel.app/text-to-evidence)
  follows the design of turning printed sources into cited claims.
- [Where text becomes citable](https://distillate-kappa.vercel.app/text-to-evidence/0001-where-text-becomes-citable)
  explains the connection between source text and evidence.
- [Who owns a page](https://distillate-kappa.vercel.app/text-to-evidence/0002-who-owns-a-page)
  explains why source pages belong to the book rather than to a reader or claim.
- [A check that exists but doesn't run](https://distillate-kappa.vercel.app/text-to-evidence/0003-a-check-that-exists-but-doesnt-run)
  examines failures in verification.
- [Namaq records](https://distillate-kappa.vercel.app/records?project=namaq)
  collect challenges, decisions, and findings from the project.

## License and source rights

The [MIT license](LICENSE) covers this repository's files, including the
structured data under `data/`.

Source editions have separate rights. Historical entries draw on
*Siyar A'lam al-Nubala'* by al-Dhahabi, consulted through published digital
editions and a scanned printed edition. The MIT license does not grant rights
in an editor's or publisher's footnotes, typography, or scans. See the site's
[attributions](https://namaq.app/attributions) and check an edition's terms
before republishing its pages.

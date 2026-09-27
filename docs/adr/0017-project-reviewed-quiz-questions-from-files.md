---
status: accepted
---

# Project reviewed quiz questions from files

Quiz candidates are derived from cited historical claims, but an agent's
approval, rejection reason and wording override are authored editorial data.
Keep the complete reviewed question bank in versioned files under `data/quiz/`
and project it into PostgreSQL for filtering and quiz assembly, rather than
making either runtime generation or mutable database rows the only record of
those decisions. This follows the historical catalog's file-authority pattern:
Git preserves review history and makes the bank rebuildable, while PostgreSQL
serves the application efficiently.

The projection stores pending, approved, rejected and retired candidates, but
learner quizzes sample only approved rows. Regeneration merges by a stable
question key; an unchanged fingerprint preserves the decision, a changed
fingerprint returns the candidate to pending, and a candidate no longer
generated becomes retired. English question content, database-first admin
authoring and question-bank export from an admin UI remain later decisions.

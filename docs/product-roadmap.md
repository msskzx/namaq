# Product goal and phases

Namaq helps people learn Islamic knowledge through two connected journeys:

- Explore interactive visualizations and discover relationships and patterns.
- Test and learn through quizzes, using those visualizations where useful.

Short, interactive experiences make learning approachable. Source texts remain
available for reading in depth. The current public focus is **تدبّر القرآن**.

## Phase 1: Quran launch

Focus the public journey on متشابهات القرآن, the Quran reader, and Quran quizzes.
Reuse the existing solo and party modes; building a new party mode is outside
this phase. A next-ayah quiz mode is planned for this scope but is not part of
the current tree and quiz refinements.

Verify the Quran data obtained from the API, recheck the branches algorithm,
and harden the visualizations. Improve interactions for desktop and phones in
the current React framework. No frontend rewrite or feature flags for now.

Homepage, navigation and footer expose the selected features. Other tools remain
reachable by URL and through the unlisted `/experiments` directory. Standalone
comparison needs more work; keep its current limited use inside branches.

## Phase 2: Release further learning features individually

Likely next additions are أسباب النزول / في من نزلت, nasab, and relationships.
Finish the existing companion biographies, including the four caliphs, and
improve the quizzes and timeline. Choose the order by learning impact, effort,
available sources and capacity for qualified review, rather than completing
every existing feature before releasing anything.

## Phase 3: Broader visual learning

Make relationship exploration easier for non-experts. Use graphs in quizzes:
find an answer by exploring relations, or open a person's ancestors, descendants,
spouses and other connections through simple controls. Later, add selected
hadith and use their visual plots or bubbles in questions. Continue improving
tools for Quran learning and reflection throughout these releases.

## Mobile app: after the interactions are established

Phones are a primary audience from phase 1. First improve the shared browser and
phone experience in React, then translate the established interactions into a
suitable mobile framework. This later step need not wait for every content
feature above to be finished.

The launch scope is agreed; later priorities are a direction, not a fixed
delivery schedule. Implementation details live in the
[launch plan](plans/quran-launch-home.md) and
[quiz refinements plan](plans/quran-quiz-refinements.md).

# Branches

| Branch | Holds | Ships |
| --- | --- | --- |
| `main` | Release 1: fixes, design polish and search only (feature freeze since 2026-11-24). | Every merge publishes to Expo. |
| `release-2` | New features and deferred work that is not in release 1. | Nothing until release 2. |

Rules:

- A pull request for release 1 targets `main`. A pull request for a new feature or deferred work targets `release-2`.
- Never merge `release-2` into `main` before release 2. A release-2 change must not reach `main`, because `main` publishes to Expo.
- Merge `main` into `release-2` regularly (after each batch of release-1 fixes), so release 2 starts from the fixed app.
- The release plan and the list of release-2 items: `/mnt/project-files/release-1/plan.md` (project files).

On `release-2` so far:

- Ibn Rajab's eight hadith added to the Forty («زوائد ابن رجب»), which #1216 hid on `main`.

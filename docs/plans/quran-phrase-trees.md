# Phrase trees inside ayat

Extend `/quran/branches` with shared wording at any word position. Reuse the current multiple-start layout: prefixes on the right converge on the shared phrase, and continuations branch left. The owner approved proceeding after identifying the existing يطوف عليهم layout as the visual model.

## Acceptance criteria

- Match consecutive words by normalized letters, roots, and the existing spelling-or-lemma node rule. Fold hamza seats for phrase matching without changing opening membership or original display.
- Include runs shared by at least two distinct ayat: two words require roots on both words, otherwise require three words. At least one occurrence is inside an ayah.
- Keep maximal runs for each exact ayah membership. Track every occurrence with its original word offsets. Cut large groups into small entries using the opening subtree strategy.
- The five occurrences in 23:82, 37:16, 37:53, 50:3 and 56:47 share أءذا متنا وكنا ترابا. Preserve prefixes and continuations, original spellings, context offsets, path controls and surrounding ayat.
- Use the existing BranchTree and multiple-start fan. Whole prefixes replace first-word variants for phrase entries; empty prefixes start at the trunk. No new visual design.
- Add a URL-backed scope selector: الكل, أول الآية, داخل الآية. Default to all. Search, pagination, juz and surah filtering retain scope. Mixed results identify their kind. Existing opening links still work.
- Keep the opening artifact and quiz pool unchanged. Generate a separate compact phrase artifact from all reader ayat. Avoid serializing the entire added phrase inventory to the client.
- Cover matching and navigation with automated tests. Run lint, tsc, tests and build, inspect rendered desktop/mobile and light/dark output, and supply screenshots before one PR. Follow the repository review cycle.
- Update CONTEXT.md and the shared-openings plan. No new ADR, quiz category, compare links or same-root-only trees.

## Work areas

Data and matching live in src/lib/quran/phraseTrees.ts and the branches build script. Page integration lives in the existing branches route and controls. Preserve the existing opening path and its tests.

## Generated inventory

The full reader corpus yields 4,819 maximal phrase groups: 1,197 two-word
rooted runs and 3,622 longer runs, covering 4,314 ayat. They produce 6,058
browse pieces, with two to six ayat per piece. Generation takes about 1.2
seconds locally and writes a 6.0 MB server-side artifact. Sixty-nine groups
contain a repeated occurrence within one ayah. The opening artifact remains
byte-identical after generation. These figures come from the implemented
word classes and containing-run maximality, not the earlier seed estimates.

The added suggestion inventory is served by a cached route; only displayed
trees and filtered suggestions reach the client. The existing search reset
records Distillate 0004 and 0005 informed the delayed-response regression.

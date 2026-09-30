# Batch: al-Kilabiyyah, contested wife identity

This batch preserves al-Dhahabi's account of the Prophet's marriage(s) to a
woman known by the nisba الكلابية and supports the canonical records selected
from it. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/al-kilabiyyah/](accounts/al-kilabiyyah/)

## Source account

*Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985), volume 2
(السيرة النبوية ج٢), edited by Hussein Asad under Shuayb al-Arnaut, printed
pages 492-494. The passage is a shared discussion of several of the Prophet's
disputed or unconsummated marriages, not a single self-contained entry with
its own heading; al-Kilabiyyah's paragraphs sit among a run naming Qutaylah,
al-Kindiyyah, al-Jawniyyah, Mulaykah bint Ka'b, Khawlah bint Hudhayl, and a
woman of Banu Ghifar. Only the paragraphs naming a candidate for her identity
are claimed here.

## What the entry supports

Three claims, four citations, all `DISPUTED`.

**No single identity is settled, and none is picked.** The retired
`prisma/personSeedData10.ts` entry for `al-kilabiyyah` already presented her
as a composite of four names: Fatimah bint al-Dahhak ibn Sufyan, Amrah bint
Zayd, al-'Aliyah bint Zabyan, and Sana' bint Sufyan al-Kilabiyyah. This
account confirms three of the four as reports in this edition, each kept as
its own `DISPUTED` claim on the `WIFE`/`HUSBAND` relation to `prophet-muhammad`
rather than merged into one:

- **Fatimah bint al-Dahhak** — she sought refuge from him and he divorced
  her; the account adds that she was reduced to gathering dung and saying
  "I am the wretched one" (`2/492-p4`, `2/492-p5`).
- **Sana' bint Sufyan al-Kilabiyyah** — reported via Ibn Umar, and
  al-Dhahabi himself flags the chain as unsound (`من وجه لا يصح`)
  (`2/493-p6`).
- **al-'Aliyah bint Zabyan** — two reports, one naming her as "a woman of
  Banu Kilab" the Prophet married and separated from, the other saying the
  marriage lasted some time before he divorced her (`2/494-p5`, `2/494-p6`).

**The fourth candidate, unclaimed.** Amrah bint Zayd al-Kilabiyyah, attributed
to Ibn Ishaq's *Sira* in secondary sources, does not appear anywhere in this
Risalah edition's account of pages 492-494 or the pages immediately
surrounding it. No claim cites her: inventing one would misrepresent what
this source says. She stays an open candidate the seed named and this batch
could not confirm.

**Cross-reference to سناء (checklist line 165, batch `sanaa-bint-asma-al-sulami`).**
That batch's own subject, سناء بنت أسماء بن الصلت, carries "bint Sufyan
al-Kilabiyyah" as an unreconciled alternate identification in her catalog
file's comment — the same Sana' bint Sufyan named here as one of
al-Kilabiyyah's four candidates. The two are kept as separate batches and
separate catalog people despite the overlapping candidate name, because the
two accounts report different outcomes: سناء's entry says she died before
the marriage was consummated, while this entry's Sana' bint Sufyan report
says she was counted among his wives and says nothing about her death. One
overlapping name does not make these the same report, so neither is merged
into the other.

**What the source does not say.** No account here or on the surrounding pages
states a kunya, physical appearance, virtues, or siblings for any of the three
named candidates, so `kunya`, `appearance`, `manaqeb`, and `siblings` are
marked `notInSource` on the account. No single nasab is settled either, so no
`fullName` claim is authored; `catalog:checklist` will report it unresolved,
which is accurate — the source names four candidate women, not zero.

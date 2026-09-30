# Batch: Khadijah bint Khuwaylid, Siyar entry 16

This batch preserves al-Dhahabi's complete entry on Khadijah bint Khuwaylid
and supports the canonical values selected from it. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/khadijah-bint-khuwaylid/](accounts/khadijah-bint-khuwaylid/)

## Source account

Entry 16 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 2, edited by Hussein Asad under Shuayb al-Arnaut. The account starts
on printed page 109 and ends on page 117.

Page 109 also closes entry 15, Kisra Yazdegerd. The extraction starts at
`109-p6`, the Khadijah heading, and drops Kisra's preceding source list and
note. Khadijah's `(* *)` source list and its note remain. Page 117 closes with
the two reports that place her death three years before the Hijra; no following
entry shares the page.

The heading calls her `أم المؤمنين` and the account identifies her as the
first believer. She is therefore in scope as a Companion, not merely a person
mentioned in another biography.

## What the entry supports

Six claims select values already represented by the catalog model.

The opening gives her full nasab through Kilab, her Qurashi and Asadi
affiliations, and her kunya, `أم القاسم`. The same nasab supports the existing
daughter relation to Khuwaylid ibn Asad. The heading supports her Mother of the
Believers title. Page 110 says the Prophet had married no woman before her,
supporting the First Wife title. Page 114 states that she offered herself to
the Prophet and he married her, supporting the existing wife relation.

The account contains many virtues, including her precedence in faith, the
Prophet's praise of her, and the promised house in Paradise. The catalog's
current virtues wording remains tied to its earlier citation from the Sira
account because this entry's corresponding report omits one clause from that
stored value. The complete evidence remains in these source pages rather than
being attached as partial support for a longer field value.

## Checklist and legacy values

The entry gives no physical description and names no sibling, so the account
marks `appearance` and `siblings` as absent. It names two husbands before the
Prophet, but neither has a catalog person entry, so those marriages stay in the
source text. It also names her children; this batch does not expand the
existing graph beyond the relations it was assigned to evidence.

The scoped legacy ledger leaves two values honestly unresolved. The generic
Companion title is inherited from the retired seeds rather than stated in the
entry's wording, and the sibling relation to Hizam is not mentioned. All other
legacy values on Khadijah that this entry supports are promoted to cited
claims.

## Review

Nothing is marked reviewed. The claims remain `NOT_REVIEWED`; this batch has
not received publication approval or source review.

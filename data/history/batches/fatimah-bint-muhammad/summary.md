# Batch: Fatimah bint Muhammad, Siyar entry 18

This batch preserves al-Dhahabi's complete entry on Fatimah bint Muhammad and
supports the canonical values selected from it. It follows the
[data quality and references workflow](../../../../docs/data-pipelines.md) and
[extraction checklist](../../../../docs/extraction-checklist.md).

- Batch definition: [batch.json](batch.json)
- Source pages: [accounts/fatimah-bint-muhammad/](accounts/fatimah-bint-muhammad/)

## Scope

Fatimah is in scope as the Prophet's daughter and a Companion. The entry calls
her the foremost woman of her time, identifies her as the Prophet's daughter,
and records her marriage to Ali ibn Abi Talib.

## Source account

Entry 18 of *Siyar A'lam al-Nubala'*, Risalah third edition (1405/1985),
volume 2 of the Siyar proper (`volumeNumber: 5` in the source's complete
28-volume list). The entry runs from printed page 118 to page 134 (Shamela
2098–2114). Page 118 also closes Fatimah bint Asad's entry, so the body starts
at `118-p11` and the notes start at Fatimah bint Muhammad's bibliography.
Page 134 closes Fatimah's entry; Aisha's entry opens on page 135 and is not
included.

Reproduce the extraction with:

```bash
npm run history:extract -- --book 10906 --from 2098 --to 2114 \
  --out data/history/batches/fatimah-bint-muhammad \
  --subject-slug fatimah-bint-muhammad \
  --source-slug siyar-alam-al-nubala-risalah \
  --start-anchor p11 --notes-start-marker "(* *) مسند أحمد" --volume 5
```

## Selected evidence

Seven claims promote values already modeled in the catalog: her full name,
resemblance to the Prophet in gait and speech, the existing composite virtues
field, the Daughter of the Prophet and Mistress of the Women of Paradise
titles, her daughter relation to the Prophet, and her wife relation to Ali.
The appearance claim joins the two separate reports needed by the catalog's
existing wording. The virtues claim cites only the passages that support its
four selected clauses.

The entry names her children, reports several ages and intervals for her
death, and preserves many additional virtues. Those details remain in the
source pages because this batch does not add values that the model does not
currently hold. It gives no kunya or sibling, so both are marked absent. The
generic Companion title, sex, and Qur'an links remain `legacy-unreviewed`
because this entry does not directly support their present catalog form.

## Review

All claims remain Not reviewed. The batch has no publication approval and has
not been imported.

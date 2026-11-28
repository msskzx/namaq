# الآيات

`mobile/src/app/(tabs)/(quran)/ayat.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الآيات"]
  style me stroke-width:3px
  in0(["القرآن"]) --> me
  me -- "…" --> out0["صفحة الآية"]
  me -- "…" --> out1["آيات السورة"]
```

## Ways in

- [القرآن](quran.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `AyahListRow` | ‹›: ‹› | [صفحة الآية](ayah.md) | [components/AyahListRow.tsx:32](../../mobile/src/components/AyahListRow.tsx#L32) |
| `AyatScreen` | (onOpen) | [آيات السورة](ayat-surah.md) | [screens/ayat.tsx:39](../../mobile/src/screens/ayat.tsx#L39) |

## Sheets

None of its own.

# الأدوات والأذكار

`mobile/src/app/(tabs)/(home)/utilities.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الأدوات والأذكار"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["الذكر"]) --> me
  me -- "…" --> out0["الذكر"]
  me -- "اقرأ جزء اليوم: ‹›" --> out1["المصحف"]
  me -.-> sheet0{{"PlaceSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [الذكر](dhikr.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `DhikrRow` | ‹›‹› | [الذكر](dhikr.md) | [components/Adhkar.tsx:110](../../mobile/src/components/Adhkar.tsx#L110) |
| `Month` | اقرأ جزء اليوم: ‹› | [المصحف](read.md) | [components/Utilities.tsx:381](../../mobile/src/components/Utilities.tsx#L381) |
| `Calendar` | اقرأ جزء اليوم: ‹› | [المصحف](read.md) | [components/Utilities.tsx:411](../../mobile/src/components/Utilities.tsx#L411) |

## Sheets

- `PlaceSheet`

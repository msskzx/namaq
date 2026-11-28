# ترتيب السور

`mobile/src/app/(tabs)/(quran)/order.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["ترتيب السور"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["الاختبارات"]) --> me
  in2(["مدونتي"]) --> me
  in3(["القرآن"]) --> me
  me -- "…" --> out0["المصحف"]
  me -.-> sheet0{{"HelpSheet"}}
  me -.-> sheet1{{"SurahSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)
- [مدونتي](library.md)
- [القرآن](quran.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `SurahCard` | ‹›:1 | [المصحف](read.md) | [components/OrderSurah.tsx:105](../../mobile/src/components/OrderSurah.tsx#L105) |

## Sheets

- `HelpSheet`
- `SurahSheet`

# مقارنة السور

`mobile/src/app/(tabs)/(quran)/compare.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["مقارنة السور"]
  style me stroke-width:3px
  me -- "اقرأ ‹› في المصحف" --> out0["المصحف"]
  me -- "افتح في متشابهات القرآن" --> out1["متشابهات القرآن"]
  me -.-> sheet0{{"CompareSheet"}}
  me -.-> sheet1{{"HelpSheet"}}
  me -.-> sheet2{{"VideoSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [قصص الأنبياء](prophets.md)
- [قصة النبي](prophets-slug.md)
- [الاختبارات](quizzes.md)
- [غرفة الاختبار الجماعي](quiz-party-code.md)
- [الاختبار](quiz-play.md)
- [البحث](search.md)
- [القرآن](quran.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `SideHead` | (onPress) | [المصحف](read.md) | [components/CompareCard.tsx:111](../../mobile/src/components/CompareCard.tsx#L111) |
|  | افتح في متشابهات القرآن | [متشابهات القرآن](branches.md) | [components/CompareCard.tsx:112](../../mobile/src/components/CompareCard.tsx#L112) |
| `LaneHead` | اقرأ ‹› في المصحف | [المصحف](read.md) | [components/CompareCard.tsx:124](../../mobile/src/components/CompareCard.tsx#L124) |
|  | افتح في متشابهات القرآن | [متشابهات القرآن](branches.md) | [components/CompareCard.tsx:125](../../mobile/src/components/CompareCard.tsx#L125) |
| `CompareCard` | اقرأ ‹› في المصحف | [المصحف](read.md) | [components/CompareCard.tsx:376](../../mobile/src/components/CompareCard.tsx#L376) |
|  | افتح في متشابهات القرآن | [متشابهات القرآن](branches.md) | [components/CompareCard.tsx:385](../../mobile/src/components/CompareCard.tsx#L385) |

## Sheets

- `CompareSheet`
- `HelpSheet`
- `VideoSheet`

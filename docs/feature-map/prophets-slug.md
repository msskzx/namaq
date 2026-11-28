# قصة النبي

`mobile/src/app/prophets/[slug].tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["قصة النبي"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["الاختبارات"]) --> me
  in2(["مدونتي"]) --> me
  in3(["البحث"]) --> me
  in4(["القرآن"]) --> me
  in5(["صفحة الآية"]) --> me
  me -- "افتح ‹› في المصحف" --> out0["المصحف"]
  me -- "قارن ‹›" --> out1["مقارنة السور"]
  me -- "…" --> out2["قصص الأنبياء"]
  me -.-> sheet0{{"CompareTargetsSheet"}}
  me -.-> sheet1{{"HelpSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)
- [مدونتي](library.md)
- [البحث](search.md)
- [القرآن](quran.md)
- [صفحة الآية](ayah.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `EventPlaces` | افتح ‹› في المصحف | [المصحف](read.md) | [components/EventPlaces.tsx:101](../../mobile/src/components/EventPlaces.tsx#L101) |
|  | (onPick) | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:117](../../mobile/src/components/EventPlaces.tsx#L117) |
| `CompareButton` | قارن ‹› | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:129](../../mobile/src/components/EventPlaces.tsx#L129) |
| `ProphetScreen` | (back) | [قصص الأنبياء](prophets.md) | [screens/prophets/slug.tsx:9](../../mobile/src/screens/prophets/slug.tsx#L9) |

## Sheets

- `CompareTargetsSheet`
- `HelpSheet`

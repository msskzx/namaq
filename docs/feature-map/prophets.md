# قصص الأنبياء

`mobile/src/app/(tabs)/(quran)/prophets.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["قصص الأنبياء"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["قصة النبي"]) --> me
  in3(["القرآن"]) --> me
  me -- "افتح ‹› في المصحف" --> out0["المصحف"]
  me -- "قارن ‹›" --> out1["مقارنة السور"]
  me -.-> sheet0{{"CompareTargetsSheet"}}
  me -.-> sheet1{{"HelpSheet"}}
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [قصة النبي](prophets-slug.md)
- [القرآن](quran.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `EventPlaces` | افتح ‹› في المصحف | [المصحف](read.md) | [components/EventPlaces.tsx:101](../../mobile/src/components/EventPlaces.tsx#L101) |
|  | (onPick) | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:117](../../mobile/src/components/EventPlaces.tsx#L117) |
| `CompareButton` | قارن ‹› | [مقارنة السور](compare.md) | [components/EventPlaces.tsx:129](../../mobile/src/components/EventPlaces.tsx#L129) |

## Sheets

- `CompareTargetsSheet`
- `HelpSheet`

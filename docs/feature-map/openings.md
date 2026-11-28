# فواتح السور

`mobile/src/app/(tabs)/(quran)/openings.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["فواتح السور"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["صفحة الآية"]) --> me
  in3(["القرآن"]) --> me
  me -- "افتح ‹› في المصحف" --> out0["المصحف"]
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [صفحة الآية](ayah.md)
- [القرآن](quran.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `OpeningRows` | افتح ‹› في المصحف | [المصحف](read.md) | [screens/openings.tsx:74](../../mobile/src/screens/openings.tsx#L74) |

## Sheets

None of its own.

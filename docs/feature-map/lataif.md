# مشاهد

`mobile/src/app/(tabs)/(quran)/lataif.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["مشاهد"]
  style me stroke-width:3px
  in0(["المشهد"]) --> me
  in1(["الرئيسية"]) --> me
  in2(["مدونتي"]) --> me
  in3(["القرآن"]) --> me
  me -- "افتح الحديث كاملًا: ‹›" --> out0["حديث الصحيح"]
  me -- "…" --> out1["المشهد"]
```

## Ways in

- [المشهد](scene.md)
- [الرئيسية](home.md)
- [مدونتي](library.md)
- [القرآن](quran.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `Hadith` | افتح الحديث كاملًا: ‹› | [حديث الصحيح](hadith-sahih.md) | [components/scenes/RahmanPage.tsx:143](../../mobile/src/components/scenes/RahmanPage.tsx#L143) |
| `LataifScreen` | (onPress) | [المشهد](scene.md) | [screens/lataif.tsx:31](../../mobile/src/screens/lataif.tsx#L31) |
|  | (onPress) | [المشهد](scene.md) | [screens/lataif.tsx:34](../../mobile/src/screens/lataif.tsx#L34) |

## Sheets

None of its own.

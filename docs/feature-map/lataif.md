# مشاهد

`mobile/src/app/(tabs)/(quran)/lataif.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["مشاهد"]
  style me stroke-width:3px
  in0(["المشهد"]) --> me
  in1(["الرئيسية"]) --> me
  in2(["مدونتي"]) --> me
  me -- "افتح الحديث كاملًا: ‹›" --> out0["حديث الصحيح"]
  me -- "…" --> out1["المشهد"]
```

## Ways in

- [المشهد](scene.md)
- [الرئيسية](home.md)
- [مدونتي](library.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `Hadith` | افتح الحديث كاملًا: ‹› | [حديث الصحيح](hadith-sahih.md) | [components/scenes/RahmanPage.tsx:119](../../mobile/src/components/scenes/RahmanPage.tsx#L119) |
| `LataifScreen` | (onPress) | [المشهد](scene.md) | [screens/lataif.tsx:25](../../mobile/src/screens/lataif.tsx#L25) |
|  | (onPress) | [المشهد](scene.md) | [screens/lataif.tsx:28](../../mobile/src/screens/lataif.tsx#L28) |

## Sheets

None of its own.

# المشهد

`mobile/src/app/scene.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["المشهد"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["مشاهد"]) --> me
  me -- "رجوع" --> out0["مشاهد"]
  me -- "افتح الحديث كاملًا: ‹›" --> out1["حديث الصحيح"]
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [مشاهد](lataif.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `DarkSea` | رجوع | [مشاهد](lataif.md) | [components/DarkSea.tsx:138](../../mobile/src/components/DarkSea.tsx#L138) |
| `RahmanScene` | رجوع | [مشاهد](lataif.md) | [components/RahmanScene.tsx:121](../../mobile/src/components/RahmanScene.tsx#L121) |
| `Hadith` | افتح الحديث كاملًا: ‹› | [حديث الصحيح](hadith-sahih.md) | [components/scenes/RahmanPage.tsx:119](../../mobile/src/components/scenes/RahmanPage.tsx#L119) |

## Sheets

None of its own.

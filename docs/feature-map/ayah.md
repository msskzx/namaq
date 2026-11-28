# صفحة الآية

`mobile/src/app/ayah.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["صفحة الآية"]
  style me stroke-width:3px
  in0(["مدونتي"]) --> me
  in1(["الرئيسية"]) --> me
  in2(["الاختبارات"]) --> me
  in3(["المصحف"]) --> me
  in4(["حديث الصحيح"]) --> me
  in5(["الترجمة"]) --> me
  me -- "افتح ‹›" --> out0["الترجمة"]
  me -- "…" --> out1["الرئيسية"]
  me -- "افتح ‹› في المصحف" --> out2["المصحف"]
  me -- "افتح «‹›» في فواتح السور" --> out3["فواتح السور"]
  me -- "افتح ‹› في الأقسام" --> out4["الأقسام"]
  me -- "افتح ‹› في القصة" --> out5["قصة النبي"]
  me -- "افتح ‹›" --> out6["القصة"]
  me -- "…" --> out7["حديث الصحيح"]
  me -.-> sheet0{{"AyahPreviewSheet"}}
  me -.-> sheet1{{"BalaghaSheet"}}
  me -.-> sheet2{{"GharibSheet"}}
  me -.-> sheet3{{"IrabSheet"}}
  me -.-> sheet4{{"NoteSheet"}}
  me -.-> sheet5{{"TopicSheet"}}
```

## Ways in

- [مدونتي](library.md)
- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)
- [المصحف](read.md)
- [حديث الصحيح](hadith-sahih.md)
- [الترجمة](person.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `People` | (onPress) | [الترجمة](person.md) | [components/battles/BattleParts.tsx:113](../../mobile/src/components/battles/BattleParts.tsx#L113) |
| `AyahScreen` | (back) | [الرئيسية](home.md) | [screens/ayah.tsx:105](../../mobile/src/screens/ayah.tsx#L105) |
|  | افتح ‹› في المصحف | [المصحف](read.md) | [screens/ayah.tsx:108](../../mobile/src/screens/ayah.tsx#L108) |
|  | سمّع من هذه الآية | [المصحف](read.md) | [screens/ayah.tsx:110](../../mobile/src/screens/ayah.tsx#L110) |
|  | (onJump) | [المصحف](read.md) | [screens/ayah.tsx:138](../../mobile/src/screens/ayah.tsx#L138) |
| `SectionPart` | افتح «‹›» في فواتح السور | [فواتح السور](openings.md) | [screens/ayah.tsx:233](../../mobile/src/screens/ayah.tsx#L233) |
|  | افتح ‹› في الأقسام | [الأقسام](oaths.md) | [screens/ayah.tsx:241](../../mobile/src/screens/ayah.tsx#L241) |
|  | افتح ‹› في القصة | [قصة النبي](prophets-slug.md) | [screens/ayah.tsx:252](../../mobile/src/screens/ayah.tsx#L252) |
|  | افتح ‹› | [القصة](story.md) | [screens/ayah.tsx:261](../../mobile/src/screens/ayah.tsx#L261) |
|  | (onPress) | [حديث الصحيح](hadith-sahih.md) | [screens/ayah.tsx:270](../../mobile/src/screens/ayah.tsx#L270) |
|  | افتح ‹› | [الترجمة](person.md) | [screens/ayah.tsx:288](../../mobile/src/screens/ayah.tsx#L288) |

## Sheets

- `AyahPreviewSheet`
- `BalaghaSheet`
- `GharibSheet`
- `IrabSheet`
- `NoteSheet`
- `TopicSheet`

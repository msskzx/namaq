# صفحة الآية

`mobile/src/app/ayah.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["صفحة الآية"]
  style me stroke-width:3px
  in0(["مدونتي"]) --> me
  in1(["الرئيسية"]) --> me
  in2(["الاختبارات"]) --> me
  in3(["حديث الصحيح"]) --> me
  in4(["الترجمة"]) --> me
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
- [حديث الصحيح](hadith-sahih.md)
- [الترجمة](person.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `People` | (onPress) | [الترجمة](person.md) | [components/battles/BattleParts.tsx:130](../../mobile/src/components/battles/BattleParts.tsx#L130) |
| `AyahScreen` | (back) | [الرئيسية](home.md) | [screens/ayah.tsx:116](../../mobile/src/screens/ayah.tsx#L116) |
|  | افتح ‹› في المصحف | [المصحف](read.md) | [screens/ayah.tsx:119](../../mobile/src/screens/ayah.tsx#L119) |
|  | سمّع من هذه الآية | [المصحف](read.md) | [screens/ayah.tsx:121](../../mobile/src/screens/ayah.tsx#L121) |
|  | (onJump) | [المصحف](read.md) | [screens/ayah.tsx:150](../../mobile/src/screens/ayah.tsx#L150) |
| `SectionPart` | افتح «‹›» في فواتح السور | [فواتح السور](openings.md) | [screens/ayah.tsx:250](../../mobile/src/screens/ayah.tsx#L250) |
|  | افتح ‹› في الأقسام | [الأقسام](oaths.md) | [screens/ayah.tsx:258](../../mobile/src/screens/ayah.tsx#L258) |
|  | افتح ‹› في القصة | [قصة النبي](prophets-slug.md) | [screens/ayah.tsx:269](../../mobile/src/screens/ayah.tsx#L269) |
|  | افتح ‹› | [القصة](story.md) | [screens/ayah.tsx:278](../../mobile/src/screens/ayah.tsx#L278) |
|  | (onPress) | [حديث الصحيح](hadith-sahih.md) | [screens/ayah.tsx:290](../../mobile/src/screens/ayah.tsx#L290) |
|  | افتح ‹› | [الترجمة](person.md) | [screens/ayah.tsx:309](../../mobile/src/screens/ayah.tsx#L309) |

## Sheets

- `AyahPreviewSheet`
- `BalaghaSheet`
- `GharibSheet`
- `IrabSheet`
- `NoteSheet`
- `TopicSheet`

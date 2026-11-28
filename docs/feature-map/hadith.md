# الحديث

`mobile/src/app/(tabs)/(hadith)/hadith.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الحديث"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["الاختبارات"]) --> me
  in2(["مدونتي"]) --> me
  in3(["كتاب الحديث"]) --> me
  in4(["حديث الأربعين"]) --> me
  in5(["أبواب الكتاب"]) --> me
  in6(["حديث الصحيح"]) --> me
  in7(["رواية الصحيح"]) --> me
  me -- "افتح ‹›" --> out0["حديث الصحيح"]
  me -- "…" --> out1["حديث الأربعين"]
  me -- "…" --> out2["أبواب الكتاب"]
  me -- "…" --> out3["كتاب الحديث"]
```

## Ways in

- The tab bar's «الحديث».
- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)
- [مدونتي](library.md)
- [كتاب الحديث](hadith-book.md)
- [حديث الأربعين](hadith-forty.md)
- [أبواب الكتاب](hadith-kitab.md)
- [حديث الصحيح](hadith-sahih.md)
- [رواية الصحيح](hadith-unit.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `ContinueCard` | افتح ‹› | [حديث الصحيح](hadith-sahih.md) | [screens/hadith.tsx:54](../../mobile/src/screens/hadith.tsx#L54) |
| `FortyShape` | (onOpen) | [حديث الأربعين](hadith-forty.md) | [screens/hadith.tsx:72](../../mobile/src/screens/hadith.tsx#L72) |
| `Hit` | (onPress) | [حديث الصحيح](hadith-sahih.md) | [screens/hadith.tsx:87](../../mobile/src/screens/hadith.tsx#L87) |
|  | (onPress) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadith.tsx:87](../../mobile/src/screens/hadith.tsx#L87) |
|  | (onPress) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadith.tsx:87](../../mobile/src/screens/hadith.tsx#L87) |
| `HadithScreen` | (onPress) | [حديث الأربعين](hadith-forty.md) | [screens/hadith.tsx:135](../../mobile/src/screens/hadith.tsx#L135) |
|  | (onOpenBook) | [كتاب الحديث](hadith-book.md) | [screens/hadith.tsx:149](../../mobile/src/screens/hadith.tsx#L149) |
|  | (onOpenKitab) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadith.tsx:149](../../mobile/src/screens/hadith.tsx#L149) |
|  | (onOpenBook) | [كتاب الحديث](hadith-book.md) | [screens/hadith.tsx:153](../../mobile/src/screens/hadith.tsx#L153) |

## Sheets

None of its own.

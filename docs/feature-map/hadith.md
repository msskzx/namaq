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
| `ContinueCard` | افتح ‹› | [حديث الصحيح](hadith-sahih.md) | [screens/hadith.tsx:53](../../mobile/src/screens/hadith.tsx#L53) |
| `FortyShape` | (onOpen) | [حديث الأربعين](hadith-forty.md) | [screens/hadith.tsx:71](../../mobile/src/screens/hadith.tsx#L71) |
| `Hit` | (onPress) | [حديث الصحيح](hadith-sahih.md) | [screens/hadith.tsx:86](../../mobile/src/screens/hadith.tsx#L86) |
|  | (onPress) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadith.tsx:86](../../mobile/src/screens/hadith.tsx#L86) |
|  | (onPress) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadith.tsx:86](../../mobile/src/screens/hadith.tsx#L86) |
| `HadithScreen` | (onPress) | [حديث الأربعين](hadith-forty.md) | [screens/hadith.tsx:134](../../mobile/src/screens/hadith.tsx#L134) |
|  | (onOpenBook) | [كتاب الحديث](hadith-book.md) | [screens/hadith.tsx:148](../../mobile/src/screens/hadith.tsx#L148) |
|  | (onOpenKitab) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadith.tsx:148](../../mobile/src/screens/hadith.tsx#L148) |
|  | (onOpenBook) | [كتاب الحديث](hadith-book.md) | [screens/hadith.tsx:152](../../mobile/src/screens/hadith.tsx#L152) |

## Sheets

None of its own.

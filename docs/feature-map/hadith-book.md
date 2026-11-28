# كتاب الحديث

`mobile/src/app/(tabs)/(hadith)/hadith-book.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["كتاب الحديث"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["الاختبارات"]) --> me
  in2(["مدونتي"]) --> me
  in3(["المكتبة"]) --> me
  in4(["الحديث"]) --> me
  me -- "…" --> out0["الحديث"]
  me -- "…" --> out1["حديث الأربعين"]
  me -- "…" --> out2["أبواب الكتاب"]
```

## Ways in

- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)
- [مدونتي](library.md)
- [المكتبة](books.md)
- [الحديث](hadith.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `HadithBookScreen` | (back) | [الحديث](hadith.md) | [screens/hadithBook.tsx:32](../../mobile/src/screens/hadithBook.tsx#L32) |
|  | (onPress) | [حديث الأربعين](hadith-forty.md) | [screens/hadithBook.tsx:41](../../mobile/src/screens/hadithBook.tsx#L41) |
|  | (onOpenKitab) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadithBook.tsx:51](../../mobile/src/screens/hadithBook.tsx#L51) |
|  | (onOpen) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadithBook.tsx:56](../../mobile/src/screens/hadithBook.tsx#L56) |
|  | (onOpenBab) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadithBook.tsx:56](../../mobile/src/screens/hadithBook.tsx#L56) |

## Sheets

None of its own.

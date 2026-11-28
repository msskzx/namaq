# أبواب الكتاب

`mobile/src/app/(tabs)/(hadith)/hadith-kitab.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["أبواب الكتاب"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["الاختبارات"]) --> me
  in2(["البحث"]) --> me
  in3(["القرآن"]) --> me
  in4(["الحديث"]) --> me
  in5(["كتاب الحديث"]) --> me
  in6(["حديث الصحيح"]) --> me
  me -- "…" --> out0["الحديث"]
  me -- "…" --> out1["حديث الصحيح"]
```

## Ways in

- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)
- [البحث](search.md)
- [القرآن](quran.md)
- [الحديث](hadith.md)
- [كتاب الحديث](hadith-book.md)
- [حديث الصحيح](hadith-sahih.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `BabRow` | (onPress) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadithKitab.tsx:36](../../mobile/src/screens/hadithKitab.tsx#L36) |
| `KitabIndex` | (back) | [الحديث](hadith.md) | [screens/hadithKitab.tsx:58](../../mobile/src/screens/hadithKitab.tsx#L58) |
| `BabPage` | (back) | [الحديث](hadith.md) | [screens/hadithKitab.tsx:92](../../mobile/src/screens/hadithKitab.tsx#L92) |
|  | (go) | [أبواب الكتاب](hadith-kitab.md) | [screens/hadithKitab.tsx:93](../../mobile/src/screens/hadithKitab.tsx#L93) |
|  | ‹›‹› | [أبواب الكتاب](hadith-kitab.md) | [screens/hadithKitab.tsx:103](../../mobile/src/screens/hadithKitab.tsx#L103) |
|  | (onPress) | [حديث الصحيح](hadith-sahih.md) | [screens/hadithKitab.tsx:116](../../mobile/src/screens/hadithKitab.tsx#L116) |
| `HadithKitabScreen` | (back) | [الحديث](hadith.md) | [screens/hadithKitab.tsx:132](../../mobile/src/screens/hadithKitab.tsx#L132) |

## Sheets

None of its own.

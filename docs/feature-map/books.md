# المكتبة

`mobile/src/app/(tabs)/(library)/books.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["المكتبة"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  me -- "…" --> out0["الرئيسية"]
  me -- "…" --> out1["تحفة الأطفال"]
  me -- "…" --> out2["كتاب الحديث"]
  me -- "…" --> out3["الكتاب"]
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `LibraryScreen` | (back) | [الرئيسية](home.md) | [screens/books.tsx:57](../../mobile/src/screens/books.tsx#L57) |
|  | (onPress) | [تحفة الأطفال](tuhfa.md) | [screens/books.tsx:66](../../mobile/src/screens/books.tsx#L66) |
| `BookCard` | (open) | [كتاب الحديث](hadith-book.md) | [screens/books.tsx:77](../../mobile/src/screens/books.tsx#L77) |
|  | (open) | [الكتاب](book.md) | [screens/books.tsx:78](../../mobile/src/screens/books.tsx#L78) |

## Sheets

None of its own.

# الكتاب

`mobile/src/app/(tabs)/(library)/book.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["الكتاب"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["المكتبة"]) --> me
  me -- "…" --> out0["المصحف"]
  me -.-> sheet0{{"BookSheet"}}
  me -.-> sheet1{{"FloatingMenu"}}
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [المكتبة](books.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `BookReader` | (openAyah) | [المصحف](read.md) | [screens/book.tsx:122](../../mobile/src/screens/book.tsx#L122) |

## Sheets

- `BookSheet`
- `FloatingMenu`

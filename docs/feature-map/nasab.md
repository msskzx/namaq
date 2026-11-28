# النسب

`mobile/src/app/(tabs)/(tarajim)/nasab.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["النسب"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["الاختبارات"]) --> me
  in2(["مدونتي"]) --> me
  in3(["الترجمة"]) --> me
  in4(["التراجم"]) --> me
  in5(["الصلات"]) --> me
  me -- "…" --> out0["الترجمة"]
  me -- "…" --> out1["التراجم"]
```

## Ways in

- [الرئيسية](home.md)
- [الاختبارات](quizzes.md)
- [مدونتي](library.md)
- [الترجمة](person.md)
- [التراجم](tarajim.md)
- [الصلات](ties.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `Box` | (onPress) | [الترجمة](person.md) | [screens/nasab.tsx:31](../../mobile/src/screens/nasab.tsx#L31) |
| `NasabScreen` | (back) | [التراجم](tarajim.md) | [screens/nasab.tsx:163](../../mobile/src/screens/nasab.tsx#L163) |

## Sheets

None of its own.

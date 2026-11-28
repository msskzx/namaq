# قصص السيرة

`mobile/src/app/(tabs)/(tarajim)/stories.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["قصص السيرة"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["البحث"]) --> me
  in3(["القرآن"]) --> me
  in4(["التراجم"]) --> me
  me -- "…" --> out0["القصة"]
  me -- "…" --> out1["الغزوة"]
```

## Ways in

- [الرئيسية](home.md)
- [مدونتي](library.md)
- [البحث](search.md)
- [القرآن](quran.md)
- [التراجم](tarajim.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `StoryRow` | (onPress) | [القصة](story.md) | [screens/stories.tsx:35](../../mobile/src/screens/stories.tsx#L35) |
| `ChapterCard` | (onPress) | [الغزوة](battle.md) | [screens/stories.tsx:56](../../mobile/src/screens/stories.tsx#L56) |

## Sheets

None of its own.

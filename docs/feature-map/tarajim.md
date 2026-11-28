# التراجم

`mobile/src/app/(tabs)/(tarajim)/tarajim.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["التراجم"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  in1(["مدونتي"]) --> me
  in2(["بين عدة أشخاص"]) --> me
  in3(["حياتهم جنبًا إلى جنب"]) --> me
  in4(["النسب"]) --> me
  in5(["الترجمة"]) --> me
  in6(["الصلات"]) --> me
  me -- "…" --> out0["الترجمة"]
  me -- "كل التراجم" --> out1["كل التراجم"]
  me -- "قصص السيرة" --> out2["قصص السيرة"]
  me -- "الغزوات والمعارك" --> out3["الغزوات والمعارك"]
  me -- "الأطلس" --> out4["الأطلس"]
  me -- "النسب" --> out5["النسب"]
  me -- "بين عدة أشخاص" --> out6["بين عدة أشخاص"]
  me -- "حياتهم جنبًا إلى جنب" --> out7["حياتهم جنبًا إلى جنب"]
```

## Ways in

- The tab bar's «التراجم».
- [الرئيسية](home.md)
- [مدونتي](library.md)
- [بين عدة أشخاص](between.md)
- [حياتهم جنبًا إلى جنب](life.md)
- [النسب](nasab.md)
- [الترجمة](person.md)
- [الصلات](ties.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `PersonRows` | (onPress) | [الترجمة](person.md) | [components/tarajim/PersonRows.tsx:16](../../mobile/src/components/tarajim/PersonRows.tsx#L16) |
| `TarajimScreen` | كل التراجم | [كل التراجم](people.md) | [screens/tarajim.tsx:43](../../mobile/src/screens/tarajim.tsx#L43) |
|  | قصص السيرة | [قصص السيرة](stories.md) | [screens/tarajim.tsx:46](../../mobile/src/screens/tarajim.tsx#L46) |
|  | الغزوات والمعارك | [الغزوات والمعارك](battles.md) | [screens/tarajim.tsx:47](../../mobile/src/screens/tarajim.tsx#L47) |
|  | الأطلس | [الأطلس](atlas.md) | [screens/tarajim.tsx:48](../../mobile/src/screens/tarajim.tsx#L48) |
|  | النسب | [النسب](nasab.md) | [screens/tarajim.tsx:52](../../mobile/src/screens/tarajim.tsx#L52) |
|  | بين عدة أشخاص | [بين عدة أشخاص](between.md) | [screens/tarajim.tsx:53](../../mobile/src/screens/tarajim.tsx#L53) |
|  | حياتهم جنبًا إلى جنب | [حياتهم جنبًا إلى جنب](life.md) | [screens/tarajim.tsx:54](../../mobile/src/screens/tarajim.tsx#L54) |

## Sheets

None of its own.

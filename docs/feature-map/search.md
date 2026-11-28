# البحث

`mobile/src/app/(tabs)/(home)/search.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["البحث"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  me -.-> sheet0{{"WordSheet"}}
```

## Ways in

- [الرئيسية](home.md)

## What it opens

| Part of the screen | Label | Opens | Code |
| --- | --- | --- | --- |
| `HitRow` | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:49](../../mobile/src/components/SearchResults.tsx#L49) |
|  | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:56](../../mobile/src/components/SearchResults.tsx#L56) |
|  | (onPress) | [متشابهات القرآن](branches.md) | [components/SearchResults.tsx:70](../../mobile/src/components/SearchResults.tsx#L70) |
|  | (onPress) | [مقارنة السور](compare.md) | [components/SearchResults.tsx:76](../../mobile/src/components/SearchResults.tsx#L76) |
|  | (onPress) | [قصة النبي](prophets-slug.md) | [components/SearchResults.tsx:83](../../mobile/src/components/SearchResults.tsx#L83) |
|  | (onPress) | [القصة](story.md) | [components/SearchResults.tsx:84](../../mobile/src/components/SearchResults.tsx#L84) |
|  | (onPress) | [قصص السيرة](stories.md) | [components/SearchResults.tsx:84](../../mobile/src/components/SearchResults.tsx#L84) |
|  | (onPress) | [الترجمة](person.md) | [components/SearchResults.tsx:91](../../mobile/src/components/SearchResults.tsx#L91) |
|  | (onPress) | [الغزوة](battle.md) | [components/SearchResults.tsx:91](../../mobile/src/components/SearchResults.tsx#L91) |
|  | (onPress) | [حديث الأربعين](hadith-forty.md) | [components/SearchResults.tsx:98](../../mobile/src/components/SearchResults.tsx#L98) |
|  | (onPress) | [حديث الصحيح](hadith-sahih.md) | [components/SearchResults.tsx:98](../../mobile/src/components/SearchResults.tsx#L98) |
|  | (onPress) | [أبواب الكتاب](hadith-kitab.md) | [components/SearchResults.tsx:98](../../mobile/src/components/SearchResults.tsx#L98) |
|  | (onPress) | [تحفة الأطفال](tuhfa.md) | [components/SearchResults.tsx:109](../../mobile/src/components/SearchResults.tsx#L109) |
|  | (onPress) | [الذكر](dhikr.md) | [components/SearchResults.tsx:119](../../mobile/src/components/SearchResults.tsx#L119) |
|  | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:125](../../mobile/src/components/SearchResults.tsx#L125) |
| `WordView` | (open) | [المصحف](read.md) | [components/WordSheet.tsx:111](../../mobile/src/components/WordSheet.tsx#L111) |

## Sheets

- `WordSheet`

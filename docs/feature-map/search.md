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
| `HitRow` | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:47](../../mobile/src/components/SearchResults.tsx#L47) |
|  | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:54](../../mobile/src/components/SearchResults.tsx#L54) |
|  | (onPress) | [متشابهات القرآن](branches.md) | [components/SearchResults.tsx:68](../../mobile/src/components/SearchResults.tsx#L68) |
|  | (onPress) | [مقارنة السور](compare.md) | [components/SearchResults.tsx:74](../../mobile/src/components/SearchResults.tsx#L74) |
|  | (onPress) | [قصة النبي](prophets-slug.md) | [components/SearchResults.tsx:81](../../mobile/src/components/SearchResults.tsx#L81) |
|  | (onPress) | [القصة](story.md) | [components/SearchResults.tsx:82](../../mobile/src/components/SearchResults.tsx#L82) |
|  | (onPress) | [قصص السيرة](stories.md) | [components/SearchResults.tsx:82](../../mobile/src/components/SearchResults.tsx#L82) |
|  | (onPress) | [الترجمة](person.md) | [components/SearchResults.tsx:89](../../mobile/src/components/SearchResults.tsx#L89) |
|  | (onPress) | [الغزوة](battle.md) | [components/SearchResults.tsx:89](../../mobile/src/components/SearchResults.tsx#L89) |
|  | (onPress) | [حديث الأربعين](hadith-forty.md) | [components/SearchResults.tsx:96](../../mobile/src/components/SearchResults.tsx#L96) |
|  | (onPress) | [حديث الصحيح](hadith-sahih.md) | [components/SearchResults.tsx:96](../../mobile/src/components/SearchResults.tsx#L96) |
|  | (onPress) | [أبواب الكتاب](hadith-kitab.md) | [components/SearchResults.tsx:96](../../mobile/src/components/SearchResults.tsx#L96) |
|  | (onPress) | [تحفة الأطفال](tuhfa.md) | [components/SearchResults.tsx:107](../../mobile/src/components/SearchResults.tsx#L107) |
|  | (onPress) | [الذكر](dhikr.md) | [components/SearchResults.tsx:117](../../mobile/src/components/SearchResults.tsx#L117) |
|  | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:123](../../mobile/src/components/SearchResults.tsx#L123) |
| `WordView` | (open) | [المصحف](read.md) | [components/WordSheet.tsx:111](../../mobile/src/components/WordSheet.tsx#L111) |

## Sheets

- `WordSheet`

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
|  | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:58](../../mobile/src/components/SearchResults.tsx#L58) |
|  | (onPress) | [متشابهات القرآن](branches.md) | [components/SearchResults.tsx:72](../../mobile/src/components/SearchResults.tsx#L72) |
|  | (onPress) | [مقارنة السور](compare.md) | [components/SearchResults.tsx:78](../../mobile/src/components/SearchResults.tsx#L78) |
|  | (onPress) | [قصة النبي](prophets-slug.md) | [components/SearchResults.tsx:86](../../mobile/src/components/SearchResults.tsx#L86) |
|  | (onPress) | [القصة](story.md) | [components/SearchResults.tsx:87](../../mobile/src/components/SearchResults.tsx#L87) |
|  | (onPress) | [قصص السيرة](stories.md) | [components/SearchResults.tsx:87](../../mobile/src/components/SearchResults.tsx#L87) |
|  | (onPress) | [الترجمة](person.md) | [components/SearchResults.tsx:94](../../mobile/src/components/SearchResults.tsx#L94) |
|  | (onPress) | [الغزوة](battle.md) | [components/SearchResults.tsx:94](../../mobile/src/components/SearchResults.tsx#L94) |
|  | (onPress) | [حديث الأربعين](hadith-forty.md) | [components/SearchResults.tsx:102](../../mobile/src/components/SearchResults.tsx#L102) |
|  | (onPress) | [حديث الصحيح](hadith-sahih.md) | [components/SearchResults.tsx:102](../../mobile/src/components/SearchResults.tsx#L102) |
|  | (onPress) | [أبواب الكتاب](hadith-kitab.md) | [components/SearchResults.tsx:102](../../mobile/src/components/SearchResults.tsx#L102) |
|  | (onPress) | [تحفة الأطفال](tuhfa.md) | [components/SearchResults.tsx:113](../../mobile/src/components/SearchResults.tsx#L113) |
|  | (onPress) | [الذكر](dhikr.md) | [components/SearchResults.tsx:123](../../mobile/src/components/SearchResults.tsx#L123) |
|  | (onPress) | [المصحف](read.md) | [components/SearchResults.tsx:129](../../mobile/src/components/SearchResults.tsx#L129) |
| `WordView` | (open) | [المصحف](read.md) | [components/WordSheet.tsx:140](../../mobile/src/components/WordSheet.tsx#L140) |

## Sheets

- `WordSheet`

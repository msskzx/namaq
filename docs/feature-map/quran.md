# القرآن

`mobile/src/app/(tabs)/(quran)/quran.tsx` · [the whole map](../feature-map.md)

```mermaid
flowchart RL
  me["القرآن"]
  style me stroke-width:3px
  in0(["الرئيسية"]) --> me
  me -.-> sheet0{{"WordSheet"}}
```

## Ways in

- The tab bar's «القرآن».
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
| `QURAN_TILES` | المصحف | [المصحف](read.md) | [screens/quran.tsx:20](../../mobile/src/screens/quran.tsx#L20) |
|  | متشابهات القرآن | [متشابهات القرآن](branches.md) | [screens/quran.tsx:21](../../mobile/src/screens/quran.tsx#L21) |
|  | مقارنة السور | [مقارنة السور](compare.md) | [screens/quran.tsx:22](../../mobile/src/screens/quran.tsx#L22) |
|  | قصص الأنبياء | [قصص الأنبياء](prophets.md) | [screens/quran.tsx:23](../../mobile/src/screens/quran.tsx#L23) |
|  | تحفة الأطفال | [تحفة الأطفال](tuhfa.md) | [screens/quran.tsx:24](../../mobile/src/screens/quran.tsx#L24) |
|  | ألفاظ القرآن | [ألفاظ القرآن](words.md) | [screens/quran.tsx:25](../../mobile/src/screens/quran.tsx#L25) |
|  | الأقسام | [الأقسام](oaths.md) | [screens/quran.tsx:26](../../mobile/src/screens/quran.tsx#L26) |
|  | مشاهد | [مشاهد](lataif.md) | [screens/quran.tsx:27](../../mobile/src/screens/quran.tsx#L27) |
|  | مصطلحات البلاغة | [مصطلحات البلاغة](terms.md) | [screens/quran.tsx:28](../../mobile/src/screens/quran.tsx#L28) |
|  | القراءات | [القراءات](qiraat.md) | [screens/quran.tsx:29](../../mobile/src/screens/quran.tsx#L29) |
|  | فواتح السور | [فواتح السور](openings.md) | [screens/quran.tsx:30](../../mobile/src/screens/quran.tsx#L30) |
|  | ترتيب السور | [ترتيب السور](order.md) | [screens/quran.tsx:31](../../mobile/src/screens/quran.tsx#L31) |

## Sheets

- `WordSheet`

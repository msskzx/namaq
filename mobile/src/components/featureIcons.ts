import { ArrowLeftRight, BookOpenText, BookMarked, DoorOpen, Gem, GitCommitVertical, Layers, Link2, ListTree, MessagesSquare, Milestone, Network,
  NotebookText, Presentation, ScrollText, SunMoon, Swords, TextSearch, type LucideProps } from 'lucide-react-native';
import type { FeedKind } from '@shared/quiz/feedQuiz';
import TreeIcon from './TreeIcon';
import OrderIcon from './OrderIcon';
import LifeIcon from './LifeIcon';

type Icon = (props: LucideProps) => React.ReactNode;

/**
 * One icon for each feature (owner, 2026-11-22): its page's tile, its feed card's head and its question card's head all
 * take it from here, so they never drift apart. The mushaf has the open book with lines of the tab bar; a commentary
 * (al-Sa'di's tafsir, Ibn Rajab's sharh) the notebook; who recorded a hadith and who narrated it share the chain.
 */
export const FEATURE_ICON = {
  mushaf: BookOpenText, tafsir: NotebookText, trees: TreeIcon, compare: ArrowLeftRight, openings: DoorOpen, order: OrderIcon,
  oaths: SunMoon, words: TextSearch, balagha: Gem, qiraat: Layers, irab: ListTree, tuhfa: BookMarked, prophets: ScrollText,
  scenes: Presentation, person: Milestone, life: LifeIcon, nasab: Network, ties: Link2, battles: Swords, hadith: MessagesSquare,
  chain: GitCommitVertical, stories: ScrollText,
} satisfies Record<string, Icon>;

/** Each question kind wears the icon of the feature it asks about. */
export const QUIZ_ICON = {
  SURAH: FEATURE_ICON.mushaf, RECITE: FEATURE_ICON.mushaf, ORDER: FEATURE_ICON.order, ORDER_JUZ: FEATURE_ICON.order,
  SURAH_AIM: FEATURE_ICON.order, BRANCHES: FEATURE_ICON.trees, COMPARE: FEATURE_ICON.compare, OPENINGS: FEATURE_ICON.openings,
  MEANING: FEATURE_ICON.words, TAFSIR: FEATURE_ICON.tafsir, BALAGHA: FEATURE_ICON.balagha, TERM: FEATURE_ICON.balagha, IRAB: FEATURE_ICON.irab,
  QIRAAT: FEATURE_ICON.qiraat, QIRAAT_WHO: FEATURE_ICON.qiraat, TUHFA_COMPLETE: FEATURE_ICON.tuhfa, TUHFA_NEXT: FEATURE_ICON.tuhfa,
  TUHFA_RULE: FEATURE_ICON.tuhfa, TARAJIM_NASAB: FEATURE_ICON.nasab, TARAJIM_NASAB_FILL: FEATURE_ICON.nasab, TARAJIM_VIRTUE: FEATURE_ICON.person,
  TARAJIM_TIE: FEATURE_ICON.ties, TARAJIM_LIFE: FEATURE_ICON.life, TARAJIM_LAQAB: FEATURE_ICON.person, TARAJIM_KUNYA: FEATURE_ICON.person,
  PROPHET_NAMES: FEATURE_ICON.person, SIRA: FEATURE_ICON.battles, HADITH_NARRATOR: FEATURE_ICON.hadith, HADITH_COMPLETE: FEATURE_ICON.hadith,
  HADITH_BOOK: FEATURE_ICON.chain, HADITH_CHAIN: FEATURE_ICON.chain, SAHIH_KITAB: FEATURE_ICON.hadith,
} satisfies Record<FeedKind, Icon>;

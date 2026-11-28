import { AlignRight, ArrowDownWideNarrow, ArrowLeftRight, BookOpenText, BookMarked, DoorOpen, Gem, GitCommitVertical, Layers, Link2, ListTree, MessagesSquare, Milestone, Network,
  Map as MapIcon, NotebookText, Presentation, ScrollText, SunMoon, Swords, TextSearch, type LucideProps } from 'lucide-react-native';
import type { FeedKind } from '@shared/quiz/feedQuiz';
import TreeIcon from './TreeIcon';
import LifeIcon from './LifeIcon';

type Icon = (props: LucideProps) => React.ReactNode;

export const FEATURE_ICON = {
  mushaf: BookOpenText, ayat: AlignRight, tafsir: NotebookText, trees: TreeIcon, compare: ArrowLeftRight, openings: DoorOpen, order: ArrowDownWideNarrow,
  oaths: SunMoon, words: TextSearch, balagha: Gem, qiraat: Layers, irab: ListTree, tuhfa: BookMarked, prophets: ScrollText,
  scenes: Presentation, person: Milestone, life: LifeIcon, nasab: Network, ties: Link2, battles: Swords, hadith: MessagesSquare,
  chain: GitCommitVertical, stories: ScrollText, adhkar: SunMoon, atlas: MapIcon,
} satisfies Record<string, Icon>;

export const QUIZ_ICON = {
  SURAH: FEATURE_ICON.mushaf, RECITE: FEATURE_ICON.mushaf, ORDER: FEATURE_ICON.order, ORDER_JUZ: FEATURE_ICON.order,
  SURAH_AIM: FEATURE_ICON.order, BRANCHES: FEATURE_ICON.trees, COMPARE: FEATURE_ICON.compare, OPENINGS: FEATURE_ICON.openings,
  MEANING: FEATURE_ICON.words, TAFSIR: FEATURE_ICON.tafsir, BALAGHA: FEATURE_ICON.balagha, TERM: FEATURE_ICON.balagha, IRAB: FEATURE_ICON.irab,
  QIRAAT: FEATURE_ICON.qiraat, QIRAAT_WHO: FEATURE_ICON.qiraat, TUHFA_COMPLETE: FEATURE_ICON.tuhfa, TUHFA_NEXT: FEATURE_ICON.tuhfa,
  TUHFA_RULE: FEATURE_ICON.tuhfa, TARAJIM_NASAB: FEATURE_ICON.nasab, TARAJIM_NASAB_FILL: FEATURE_ICON.nasab, TARAJIM_VIRTUE: FEATURE_ICON.person,
  TARAJIM_TIE: FEATURE_ICON.ties, TARAJIM_LIFE: FEATURE_ICON.life, TARAJIM_LAQAB: FEATURE_ICON.person, TARAJIM_KUNYA: FEATURE_ICON.person,
  PROPHET_NAMES: FEATURE_ICON.person, PROPHET_STORY: FEATURE_ICON.prophets, SIRA: FEATURE_ICON.battles, HADITH_NARRATOR: FEATURE_ICON.hadith, HADITH_COMPLETE: FEATURE_ICON.hadith,
  HADITH_BOOK: FEATURE_ICON.chain, HADITH_CHAIN: FEATURE_ICON.chain, SAHIH_KITAB: FEATURE_ICON.hadith,
  ADHKAR_COMPLETE: FEATURE_ICON.adhkar, ATLAS_WHERE: FEATURE_ICON.atlas,
} satisfies Record<FeedKind, Icon>;

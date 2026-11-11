import { useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Share, View } from 'react-native';
import { Text, TextInput } from '@/components/Text';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Circle, CircleCheck, Crown, Hourglass, LogOut, Play, RotateCcw, Send, UserCheck, X } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { leaderboard, NAME_MAX, QUESTION_SECONDS, TREE_SECONDS, type ActionError, type PartyQuestion, type PartySettings, type PartyView, type PlayerAction, type PlayerView } from '@shared/party/rules';
import { emptyBranchAnswers, type QuestionAnswer } from '@shared/quiz/score';
import { QUIZ_LENGTHS } from '@shared/quiz/settings';
type QuestionChoice = { value: string; labelArabic: string };
import BackBar from '@/components/BackBar';
import Button, { Row } from '@/components/Button';
import LoadingDots from '@/components/LoadingDots';
import QuestionDots from '@/components/QuestionDots';
import QrCode from '@/components/QrCode';
import QuizExplainer from '@/components/QuizExplainer';
import { LeavesPicker, Section } from '@/components/QuizForm';
import { FilterFields } from '@/components/FilterFields';
import { applyDraft, draftOf, EMPTY_LIST, type FilterDraft } from '@/lib/branchList';
import { QuizFeedback, QuizInputs, type TreeQuestion } from '@/components/QuizTree';
import { useKeyboardShown } from '@/lib/keyboard';
import { WEBSITE } from '@/lib/branches';
import { scopeSummary } from '@shared/quiz/scopeSummary';
import { playerId, saveName, savedName, usePartySocket, type PartyStatus } from '@/lib/party';
import type { QuestionState } from '@/lib/quiz';
import { usePalette, type Palette } from '@/lib/theme';

type Send = (action: PlayerAction) => void;
type Question = PartyQuestion & { promptArabic?: string; choices?: QuestionChoice[] };

const ERRORS: Record<ActionError, string> = {
  'name-taken': 'في الفريق من يحمل هذا الاسم.',
  'name-empty': 'اكتب اسمًا.',
  started: 'بدأ هذا الاختبار.',
  removed: 'أخرجك المضيف من هذا الاختبار.',
  'not-host': 'هذا للمضيف وحده.',
  'not-ready': 'لم يستعد الجميع.',
  'unknown-player': 'انضم إلى الفريق أولًا.',
  'wrong-phase': 'لا يمكن هذا الآن.',
};

const duration = (seconds: number) => seconds < 60 ? `${num(seconds)} ث` : `${num(seconds / 60)} د`;
const openAyat = (keys: string[]) => router.push({ pathname: '/ayah', params: { keys: keys.join(',') } });
const isTree = (question: Question): question is Question & TreeQuestion => Boolean(question.tree);

function Label({ children, palette, muted }: { children: React.ReactNode; palette: Palette; muted?: boolean }) {
  return <Text style={{ color: muted ? palette.muted : palette.ink, fontSize: 15, lineHeight: 23, textAlign: 'right' }}>{children}</Text>;
}

function NameForm({ initial, error, onSubmit, palette }: { initial: string; error: string | null; onSubmit: (name: string) => void; palette: Palette }) {
  const [name, setName] = useState(initial);
  const [sent, setSent] = useState(initial.trim());
  const submit = () => { if (name.trim()) { setSent(name.trim()); onSubmit(name.trim()); } };
  return (
    <View style={{ padding: 16 }}>
      <Section title="اسمك" palette={palette}>
        <TextInput value={name} onChangeText={setName} onSubmitEditing={submit} maxLength={NAME_MAX} autoFocus accessibilityLabel="اسمك"
          style={{ fontSize: 18, color: palette.ink, borderWidth: 1, borderColor: palette.rule, borderRadius: 8, paddingHorizontal: 12, height: 48, textAlign: 'right' }} />
        {/* A name error belongs to the name that was sent; editing the name clears it. */}
        {error && name.trim() === sent ? <Text accessibilityRole="alert" style={{ color: palette.accent, textAlign: 'right' }}>{error}</Text> : null}
        <View style={{ alignItems: 'flex-start' }}><Button variant="primary" label="انضم" disabled={!name.trim()} onPress={submit} /></View>
      </Section>
    </View>
  );
}

/** Time left on the party's clock (the worker's time, corrected by `offset`), with a bar that empties. */
function Countdown({ deadline, total, offset, palette, big }: { deadline: number; total: number; offset: number; palette: Palette; big?: boolean }) {
  const [now, setNow] = useState(() => Date.now() + offset);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now() + offset), 250);
    return () => clearInterval(timer);
  }, [offset]);
  const left = Math.max(0, Math.ceil((deadline - now) / 1000));
  const urgent = left <= 10;
  const fill = urgent ? palette.accent : 'transparent';
  const ink = urgent ? palette.onAccent : palette.ink;
  return (
    <View accessibilityRole="timer" accessibilityLabel="الوقت المتبقي" style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: big ? 220 : 128, height: big ? 76 : 40, borderRadius: 40, borderWidth: 2, borderColor: palette.accent, backgroundColor: fill, overflow: 'hidden' }}>
      <Hourglass size={big ? 28 : 18} color={ink} />
      <Text style={{ color: ink, fontSize: big ? 40 : 22, fontWeight: '700', fontVariant: ['tabular-nums'] }}>{`${num(Math.floor(left / 60))}:${num(left % 60).padStart(2, '٠')}`}</Text>
      <View style={{ position: 'absolute', bottom: 0, start: 0, height: 4, width: `${Math.min(1, Math.max(0, (deadline - now) / total)) * 100}%`, backgroundColor: urgent ? palette.onAccent : palette.accent }} />
    </View>
  );
}

function Leaderboard({ players, you, palette, final, answering }: { players: PlayerView[]; you: string; palette: Palette; final?: boolean; answering?: boolean }) {
  const ranked = leaderboard(players);
  const top = Math.max(1, ...ranked.map(player => player.score));
  return (
    <Section title={final ? 'الترتيب النهائي' : 'الترتيب'} palette={palette}>
      {ranked.map(player => {
        const rank = ranked.findIndex(other => other.score === player.score) + 1;
        const earlier = player.score - (final ? 0 : player.earned ?? 0);
        return (
          <View key={player.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 6, backgroundColor: player.id === you ? palette.paperDeep : 'transparent' }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: rank === 1 ? palette.green : palette.rule }}>
              <Text style={{ color: rank === 1 ? palette.green : palette.muted, fontWeight: '700' }}>{num(rank)}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 16, flexShrink: 1 }}>{player.name}</Text>
                {answering && (player.submitted ? <CircleCheck size={16} color={palette.green} accessibilityLabel="أجاب" /> : <LoadingDots />)}
              </View>
              {/* Faded green is the score before this question, full green what this question added. */}
              <View style={{ flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: palette.rule }}>
                <View style={{ width: `${(earlier / top) * 100}%`, backgroundColor: palette.green, opacity: final ? 1 : 0.5 }} />
                {!final && !!player.earned && <View style={{ width: `${(player.earned / top) * 100}%`, backgroundColor: palette.green }} />}
              </View>
            </View>
            {player.earned !== null && !final && <Text style={{ color: player.earned ? palette.green : palette.muted, fontSize: 14 }}>{`+${num(player.earned)}`}</Text>}
            <Text style={{ color: palette.ink, fontWeight: '700', minWidth: 28, textAlign: 'left' }}>{num(player.score)}</Text>
          </View>
        );
      })}
    </Section>
  );
}

function Invite({ code, palette }: { code: string; palette: Palette }) {
  const link = `${WEBSITE}/quizzes/party/${code}`;
  return (
    <Section title="رقم الاختبار" palette={palette}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <QrCode value={link} size={128} ink={palette.ink} paper={palette.card} />
        <View style={{ flex: 1, gap: 10, alignItems: 'flex-start' }}>
          <Text style={{ color: palette.ink, fontSize: 34, fontWeight: '700', letterSpacing: 6, writingDirection: 'ltr' }}>{code}</Text>
          <Button Icon={Send} label="شارك الرابط" onPress={() => void Share.share({ message: `اختبار جماعي في نمق: ${code}\n${link}` })} />
        </View>
      </View>
    </Section>
  );
}

/** The branches tab's filters for the host (saved only is left out: each phone saves its own trees). */
function PartyFilters({ settings, change, palette }: { settings: PartySettings; change: (next: Partial<PartySettings>) => void; palette: Palette }) {
  const range = settings.juzFrom === 1 && settings.juzTo === 30 ? null : { from: settings.juzFrom, to: settings.juzTo };
  const [draft, setDraftState] = useState<FilterDraft>(() => draftOf({ ...EMPTY_LIST, filters: settings.filters ?? {}, range }));
  const setDraft = (next: FilterDraft) => {
    setDraftState(next);
    const applied = applyDraft(next);
    if (applied) change({ juzFrom: applied.range?.from ?? 1, juzTo: applied.range?.to ?? 30, filters: applied.filters });
  };
  return <FilterFields draft={draft} setDraft={setDraft} palette={palette} sort={false} savedOnly={false} />;
}

/** What the host chose; the host can change it until the quiz starts, everyone else only reads it. */
function Settings({ settings, editable, send, palette }: { settings: PartySettings; editable: boolean; send: Send; palette: Palette }) {
  const change = (next: Partial<PartySettings>) => send({ type: 'settings', settings: next });
  const branches = settings.topics.includes('BRANCHES');
  const others = settings.topics.some(topic => topic !== 'BRANCHES');
  if (!editable) {
    const rows: [string, string][] = [
      ['عدد الأسئلة', num(settings.length)],
      ...(branches ? [['الأشجار', scopeSummary(settings, true)], ['الإجابات في كل شجرة', num(settings.leaves)], ['وقت سؤال الشجرة', duration(settings.treeSeconds)]] as [string, string][] : []),
      ...(others ? [['وقت السؤال', duration(settings.seconds)]] as [string, string][] : []),
    ];
    return (
      <Section title="إعدادات الاختبار" palette={palette}>
        <Label palette={palette} muted>يختارها المضيف.</Label>
        {rows.map(([label, value]) => (
          <View key={label} style={{ flexDirection: 'row', gap: 12 }}>
            <Text style={{ color: palette.muted, fontSize: 15, minWidth: 130, textAlign: 'right' }}>{label}</Text>
            <Text style={{ color: palette.ink, fontSize: 15 }}>{value}</Text>
          </View>
        ))}
        {branches && <QuizExplainer leaves={settings.leaves} palette={palette} />}
      </Section>
    );
  }
  return (
    <Section title="إعدادات الاختبار" palette={palette}>
      {!branches && (
        <View style={{ alignItems: 'flex-start' }}>
          <Button label="متشابهات القرآن" onPress={() => change({ topics: ['BRANCHES'] })} />
        </View>
      )}
      {branches && (
        <>
          <PartyFilters settings={settings} change={change} palette={palette} />
          <LeavesPicker value={settings.leaves} onChange={leaves => change({ leaves })} palette={palette} />
          <QuizExplainer leaves={settings.leaves} palette={palette} />
          <Label palette={palette}>وقت سؤال الشجرة</Label>
          <Row>{TREE_SECONDS.map(value => <Button key={value} label={duration(value)} active={settings.treeSeconds === value} onPress={() => change({ treeSeconds: value })} />)}</Row>
        </>
      )}
      {others && (
        <>
          <Label palette={palette}>وقت السؤال</Label>
          <Row>{QUESTION_SECONDS.map(value => <Button key={value} label={duration(value)} active={settings.seconds === value} onPress={() => change({ seconds: value })} />)}</Row>
        </>
      )}
      <Label palette={palette}>عدد الأسئلة</Label>
      <Row>{QUIZ_LENGTHS.map(value => <Button key={value} label={num(value)} active={settings.length === value} onPress={() => change({ length: value })} />)}</Row>
    </Section>
  );
}

function Lobby({ view, send, error, palette }: { view: PartyView; send: Send; error: ActionError | null; palette: Palette }) {
  const isHost = view.you === view.hostId;
  const me = view.players.find(player => player.id === view.you);
  const others = view.players.filter(player => player.id !== view.hostId);
  const readyCount = others.filter(player => player.ready).length;
  const [confirming, setConfirming] = useState(false);
  useEffect(() => { if (error === 'not-ready') setConfirming(true); }, [error]);
  useEffect(() => { if (readyCount === others.length) setConfirming(false); }, [readyCount, others.length]);
  return (
    <>
      <Invite code={view.code} palette={palette} />
      <Section title={`اللاعبون (${num(view.players.length)})`} palette={palette}>
        {view.players.map(player => (
          <View key={player.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, opacity: player.connected ? 1 : 0.5 }}>
            {player.id === view.hostId ? <Crown size={18} color={palette.accent} /> : player.ready ? <CircleCheck size={18} color={palette.green} /> : <Circle size={18} color={palette.rule} />}
            <Text numberOfLines={1} style={{ flex: 1, color: palette.ink, fontSize: 16, textAlign: 'right' }}>{player.name}{player.id === view.you ? ' (أنت)' : ''}</Text>
            <Text style={{ color: palette.muted, fontSize: 14 }}>{player.id === view.hostId ? 'المضيف' : !player.connected ? 'غائب' : player.ready ? 'مستعد' : 'ينتظر'}</Text>
            {isHost && player.id !== view.hostId && <Button variant="plain" Icon={X} accessibilityLabel={`أخرج ${player.name}`} onPress={() => send({ type: 'remove', target: player.id })} />}
          </View>
        ))}
      </Section>
      <Settings settings={view.settings} editable={isHost} send={send} palette={palette} />
      {view.error ? <Text accessibilityRole="alert" style={{ color: palette.accent, textAlign: 'right' }}>{view.error === 'Not enough approved questions' ? 'لا توجد أسئلة كافية لهذه الإعدادات.' : 'تعذر إنشاء الاختبار.'}</Text> : null}
      {isHost ? (confirming ? (
        <Section title="تأكيد البدء" palette={palette}>
          <Label palette={palette}>{`استعد ${num(readyCount)} من ${num(others.length)}. أتبدأ الآن؟`}</Label>
          <Row>
            <Button variant="primary" Icon={Play} label="ابدأ الآن" onPress={() => { setConfirming(false); send({ type: 'start', early: true }); }} />
            <Button label="انتظر" onPress={() => setConfirming(false)} />
          </Row>
        </Section>
      ) : (
        <Row gap={12}>
          <Button big variant="primary" Icon={Play} label="ابدأ الاختبار" disabled={!view.settings.topics.length} onPress={() => send({ type: 'start' })} />
          <Label palette={palette} muted>{`استعد ${num(readyCount)} من ${num(others.length)}`}</Label>
        </Row>
      )) : (
        <Row gap={12}>
          <Button big variant={me?.ready ? 'outline' : 'primary'} Icon={UserCheck} label={me?.ready ? 'لست مستعدًا' : 'أنا مستعد'} onPress={() => send({ type: 'ready', ready: !me?.ready })} />
          <Label palette={palette} muted>{me?.ready ? 'ينتظر المضيف ليبدأ.' : 'اضغط حين تستعد.'}</Label>
        </Row>
      )}
    </>
  );
}

function Choices({ question, answer, revealed, onPick, palette }: { question: Question; answer: QuestionAnswer | null; revealed: boolean; onPick: (value: string) => void; palette: Palette }) {
  return (
    <View style={{ gap: 8, padding: 16 }}>
      {(question.choices ?? []).map(choice => {
        const given = answer === choice.value;
        const right = revealed && choice.value === question.correctAnswer;
        const wrong = revealed && given && !right;
        return (
          <Pressable key={choice.value} onPress={() => { if (answer === null && !revealed) onPick(choice.value); }} accessibilityRole="button" accessibilityState={{ selected: given }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 10, borderWidth: right ? 2 : 1, borderColor: right ? palette.green : given ? palette.accent : palette.rule }}>
            {right ? <CircleCheck size={20} color={palette.green} /> : wrong ? <X size={20} color={palette.accent} /> : given ? <Check size={20} color={palette.accent} /> : <Circle size={20} color={palette.rule} />}
            <Text style={{ flex: 1, color: palette.ink, fontSize: 17, textAlign: 'right' }}>{choice.labelArabic}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function QuestionStage({ view, send, offset, palette }: { view: PartyView; send: Send; offset: number; palette: Palette }) {
  const insets = useSafeAreaInsets();
  const typing = useKeyboardShown();
  const question = view.question as Question;
  // On a tree the prompt scrolls away with it; the countdown stays.
  const prompt = question.promptArabic ? <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 24, textAlign: 'right', paddingHorizontal: 16 }}>{question.promptArabic}</Text> : null;
  const revealed = view.phase === 'reveal';
  const [typed, setTyped] = useState<string[]>(() => emptyBranchAnswers(question));
  const sent = view.answer !== null;
  const isHost = view.you === view.hostId;
  const last = view.index + 1 >= view.total;
  const total = (question.tree ? view.settings.treeSeconds : view.settings.seconds) * 1000;
  const started = typed.some((text, index) => question.asked?.includes(index) && text.trim());

  if (!revealed && sent) return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {view.deadline !== null && <Countdown big deadline={view.deadline} total={total} offset={offset} palette={palette} />}
      <Label palette={palette} muted>أُرسلت إجابتك، وتظهر الإجابة حين يجيب الجميع.</Label>
      <Leaderboard players={view.players} you={view.you} palette={palette} answering />
    </ScrollView>
  );
  if (revealed) return (
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24, gap: 12 }}>
      {question.promptArabic ? <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right', paddingHorizontal: 16, paddingTop: 12 }}>{question.promptArabic}</Text> : null}
      {isTree(question)
        ? <View style={{ height: 420 }}><QuizFeedback question={question} typed={Array.isArray(view.answer) ? view.answer : emptyBranchAnswers(question)} palette={palette} names={view.surahNames} onTap={openAyat} /></View>
        : <Choices question={question} answer={view.answer} revealed onPick={() => {}} palette={palette} />}
      {view.result && (
        <Text style={{ color: palette.ink, fontSize: 17, fontWeight: '600', textAlign: 'right', paddingHorizontal: 16 }}>
          {question.tree ? `${num(view.result.earned)} من ${num(view.result.total)} أطراف` : view.answer === null ? 'لم تجب في الوقت.' : view.result.earned ? 'إجابة صحيحة' : 'إجابة خاطئة'}
        </Text>
      )}
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        <Leaderboard players={view.players} you={view.you} palette={palette} />
        {isHost
          ? <View style={{ alignItems: 'flex-start' }}><Button big variant="primary" Icon={Play} label={last ? 'الترتيب النهائي' : 'السؤال التالي'} onPress={() => send({ type: 'next' })} /></View>
          : <Label palette={palette} muted>ينتظر المضيف ليكمل.</Label>}
      </View>
    </ScrollView>
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 10, gap: 8 }}>
        {view.deadline !== null && <Countdown deadline={view.deadline} total={total} offset={offset} palette={palette} />}
        {!isTree(question) && prompt}
      </View>
      {isTree(question) ? (
        <>
          <View style={{ flex: 1 }}>
            <QuizInputs question={question} typed={typed} onType={(node, text) => setTyped(values => values.map((value, i) => i === node ? text : value))} palette={palette} names={view.surahNames} header={prompt} />
          </View>
          {!typing && <View style={{ padding: 12, paddingBottom: insets.bottom + 12, borderTopWidth: 1, borderColor: palette.rule, alignItems: 'flex-start' }}>
            <Button big variant="primary" Icon={Check} label="أرسل" disabled={!started} onPress={() => send({ type: 'submit', answer: typed })} />
          </View>}
        </>
      ) : <Choices question={question} answer={view.answer} revealed={false} onPick={value => send({ type: 'submit', answer: value })} palette={palette} />}
    </View>
  );
}

function FinalResults({ view, send, palette }: { view: PartyView; send: Send; palette: Palette }) {
  const insets = useSafeAreaInsets();
  const [review, setReview] = useState<number | null>(null);
  const entries = view.review ?? [];
  const states: QuestionState[] = entries.map(entry => entry.result.earned === entry.result.total ? 'correct' : entry.result.earned > 0 ? 'partial' : entry.answer === null ? 'unanswered' : 'incorrect');
  const entry = review !== null ? entries[review] : null;
  const question = entry?.question as Question | undefined;
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: insets.bottom + 24 }}>
      <Leaderboard players={view.players} you={view.you} palette={palette} final />
      {entries.length > 0 && <Label palette={palette} muted>اضغط سؤالًا لتراجع إجابتك فيه.</Label>}
      {entries.length > 0 && <QuestionDots states={states} current={review ?? -1} onPick={setReview} palette={palette} />}
      {entry && question && (isTree(question)
        ? <View style={{ height: 420 }}><QuizFeedback question={question} typed={Array.isArray(entry.answer) ? entry.answer : emptyBranchAnswers(question)} palette={palette} names={view.surahNames} onTap={openAyat} /></View>
        : <Choices question={question} answer={entry.answer} revealed onPick={() => {}} palette={palette} />)}
      {view.you === view.hostId && <View style={{ alignItems: 'flex-start' }}><Button big variant="primary" Icon={RotateCcw} label="اختبار آخر بالفريق نفسه" onPress={() => send({ type: 'again' })} /></View>}
    </ScrollView>
  );
}

function Notice({ status, palette }: { status: PartyStatus | 'started'; palette: Palette }) {
  const text = status === 'missing' ? 'لا يوجد اختبار بهذا الرقم، أو انتهى.'
    : status === 'started' ? 'بدأ هذا الاختبار، فلا يمكن الانضمام إليه الآن.'
    : 'أخرجك المضيف من هذا الاختبار.';
  return (
    <View style={{ padding: 24, gap: 16, alignItems: 'flex-start' }}>
      <Label palette={palette}>{text}</Label>
      <Button variant="primary" Icon={RotateCcw} label="اختبار جماعي جديد" onPress={() => router.back()} />
    </View>
  );
}

/** A party room: the lobby, then each question for everyone at once, the reveal with the leaderboard, and the final results. */
export default function PartyRoom() {
  const palette = usePalette();
  const { code = '' } = useLocalSearchParams<{ code: string }>();
  const id = useMemo(() => playerId(), []);
  const [name, setName] = useState<string | null>(() => savedName() || null);
  const { view, error, status, send, offset } = usePartySocket(code, id, name);
  const joined = view !== null && view.players.some(player => player.id === view.you);
  const nameError = !joined && error && (error === 'name-taken' || error === 'name-empty') ? ERRORS[error] : null;
  const leave = () => { if (joined) send({ type: 'leave' }); router.back(); };
  let body: React.ReactNode;
  if (status === 'missing' || status === 'removed') body = <Notice status={status} palette={palette} />;
  else if (!joined && error === 'started') body = <Notice status="started" palette={palette} />;
  else if (!name || nameError) body = <NameForm initial={name ?? ''} error={nameError} palette={palette} onSubmit={value => { saveName(value); setName(value); }} />;
  else if (!view) body = <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><LoadingDots /></View>;
  else if (view.phase === 'lobby') body = <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }} keyboardShouldPersistTaps="handled"><Lobby view={view} send={send} error={error} palette={palette} /></ScrollView>;
  else if (view.phase === 'loading') body = <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}><LoadingDots /><Label palette={palette} muted>تُجهَّز الأسئلة…</Label></View>;
  else if (view.phase === 'final') body = <FinalResults view={view} send={send} palette={palette} />;
  else body = <QuestionStage key={`${view.index}:${view.question?.key}`} view={view} send={send} offset={offset} palette={palette} />;
  const title = view && (view.phase === 'question' || view.phase === 'reveal') ? `السؤال ${num(view.index + 1)} من ${num(view.total)}` : 'اختبار جماعي';
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: palette.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BackBar title={title}>
        {(status === 'connecting' || status === 'closed') && view ? <Text style={{ color: palette.muted, fontSize: 14 }}>يعيد الاتصال…</Text> : null}
        {joined && <Button variant="plain" Icon={LogOut} accessibilityLabel="غادر" onPress={leave} />}
      </BackBar>
      {joined && error && !['not-ready', 'name-taken', 'name-empty'].includes(error) ? <Text accessibilityRole="alert" style={{ color: palette.accent, textAlign: 'right', padding: 12 }}>{ERRORS[error]}</Text> : null}
      {body}
    </KeyboardAvoidingView>
  );
}

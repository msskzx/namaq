import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Text, TextInput } from '@/components/Text';
import { router } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import { NAME_MAX } from '@shared/party/rules';
import BackBar from '@/components/BackBar';
import Button from '@/components/Button';
import { Section } from '@/components/QuizForm';
import { playerId, saveName, savedName, startParty } from '@/lib/party';
import { usePalette } from '@/lib/theme';

const toLatin = (text: string) => text.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/\D/g, '');

/** Start a party and share its number, or join one by its number (the website's /quizzes/party). */
export default function PartyStart() {
  const palette = usePalette();
  const [name, setName] = useState(savedName);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = { fontSize: 18, color: palette.ink, borderWidth: 1, borderColor: palette.rule, borderRadius: 8, paddingHorizontal: 12, height: 48 } as const;
  const start = async () => {
    if (busy || !name.trim()) return;
    setBusy(true);
    setError(null);
    saveName(name);
    try {
      router.push(`/quiz/party/${await startParty(playerId(), name.trim())}`);
    } catch {
      setError('تعذر بدء الاختبار. حاول مرة أخرى.');
    }
    setBusy(false);
  };
  const join = () => {
    if (!/^\d{6}$/.test(code)) return;
    if (name.trim()) saveName(name);
    router.push(`/quiz/party/${code}`);
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: palette.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <BackBar title="اختبار جماعي" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
        <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>
          يبدأ أحدكم الاختبار ويشارك رقمه، ويدخل الباقون من أجهزتهم. يجيب الجميع السؤال نفسه، وتظهر الإجابة والترتيب بعد أن يجيب الكل.
        </Text>
        <Section title="اسمك" palette={palette}>
          <TextInput value={name} onChangeText={setName} maxLength={NAME_MAX} autoComplete="nickname" accessibilityLabel="اسمك"
            style={{ ...input, textAlign: 'right' }} />
        </Section>
        <Section title="ابدأ اختبارًا" palette={palette}>
          {error ? <Text accessibilityRole="alert" style={{ color: palette.accent, textAlign: 'right' }}>{error}</Text> : null}
          <View style={{ alignItems: 'flex-start' }}>
            <Button variant="primary" Icon={Play} label={busy ? 'يبدأ…' : 'ابدأ'} disabled={!name.trim() || busy} onPress={start} />
          </View>
        </Section>
        <Section title="انضم إلى اختبار" palette={palette}>
          <TextInput value={code} onChangeText={text => setCode(toLatin(text).slice(0, 6))} keyboardType="number-pad" maxLength={6} placeholder="رقم الاختبار"
            placeholderTextColor={palette.muted} accessibilityLabel="رقم الاختبار"
            style={{ ...input, fontSize: 26, letterSpacing: 6, textAlign: 'center', writingDirection: 'ltr', height: 56 }} />
          <View style={{ alignItems: 'flex-start' }}>
            <Button variant="primary" Icon={ArrowLeft} label="انضم" disabled={code.length !== 6} onPress={join} />
          </View>
        </Section>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Text } from '@/ui/Text';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { NAME_MAX } from '@shared/party/rules';
import TopBar from '@/ui/TopBar';
import Button from '@/ui/Button';
import { Section } from '@/components/QuizForm';
import { NoPartyServer, playerId, saveName, savedName, startParty } from '@/lib/party';
import { usePalette } from '@/lib/theme';
import Field from '@/ui/Field';

const toLatin = (text: string) => text.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/\D/g, '');

/** Start a party and share its number, or join one by its number (the website's /quizzes/party). */
export default function PartyStart() {
  const palette = usePalette();
  const [name, setName] = useState(savedName);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const start = async () => {
    if (busy || !name.trim()) return;
    setBusy(true);
    setError(null);
    saveName(name);
    try {
      router.push(`/quiz/party/${await startParty(playerId(), name.trim())}`);
    } catch (problem) {
      setError(problem instanceof NoPartyServer ? 'لم يُضبط خادم الاختبار الجماعي في هذه النسخة.' : 'تعذر بدء الاختبار. تحقق من الاتصال وحاول مرة أخرى.');
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
      <TopBar back={() => router.back()} title="اختبار جماعي" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
        <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 24, textAlign: 'right' }}>
          يبدأ أحدكم الاختبار ويشارك رقمه، ويدخل الباقون من أجهزتهم. يجيب الجميع السؤال نفسه، وتظهر الإجابة والترتيب بعد أن يجيب الكل.
        </Text>
        <Section title="اسمك" palette={palette}>
          <Field value={name} onChangeText={setName} maxLength={NAME_MAX} autoComplete="nickname" label="اسمك" placeholder="اكتب اسمك" palette={palette} />
        </Section>
        <Section title="ابدأ اختبارًا" palette={palette}>
          {error ? <Text accessibilityRole="alert" style={{ color: palette.accent, textAlign: 'right' }}>{error}</Text> : null}
          {!name.trim() ? <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>اكتب اسمك أولًا.</Text> : null}
          <View style={{ alignItems: 'flex-start' }}>
            <Button variant="primary" Icon={ArrowLeft} label={busy ? 'يبدأ…' : 'ابدأ'} disabled={!name.trim() || busy} onPress={start} />
          </View>
        </Section>
        <Section title="انضم إلى اختبار" palette={palette}>
          <Field code value={code} onChangeText={text => setCode(toLatin(text).slice(0, 6))} keyboardType="number-pad" maxLength={6} placeholder="رقم الاختبار" label="رقم الاختبار" palette={palette} />
          <View style={{ alignItems: 'flex-start' }}>
            <Button variant="primary" Icon={ArrowLeft} label="انضم" disabled={code.length !== 6} onPress={join} />
          </View>
        </Section>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


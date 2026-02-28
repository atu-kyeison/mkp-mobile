import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';
import { getJournalEntries, JournalEntry } from '../storage/journalStore';

const SAMPLE_MOODS = ['peaceful', 'rushed', 'anxious', 'grateful', 'tired', 'focused'] as const;

const buildPreviewEntries = (): JournalEntry[] => {
  const today = new Date();

  return SAMPLE_MOODS.map((mood, index) => {
    const entryDate = new Date(today);
    entryDate.setDate(today.getDate() - index);
    entryDate.setHours(9, 0, 0, 0);

    return {
      id: `insight-preview-${mood}-${index}`,
      createdAt: entryDate.toISOString(),
      body: `Preview reflection for ${mood}.`,
      invitationText: 'Preview rhythm entry.',
      journalVariant: 'mid_week',
      mood,
      linkedSermonTitle: index % 2 === 0 ? 'Abide and Remain' : undefined,
      linkedSermonUrl: index % 2 === 0 ? 'https://www.youtube.com/' : undefined,
    };
  });
};

const MOOD_COLORS: Record<string, string> = {
  peaceful: 'rgba(130, 154, 177, 0.82)',
  rushed: 'rgba(212, 163, 115, 0.82)',
  anxious: 'rgba(122, 162, 247, 0.82)',
  grateful: 'rgba(229, 185, 95, 0.88)',
  tired: 'rgba(148, 163, 184, 0.78)',
  focused: 'rgba(168, 218, 220, 0.82)',
};

const MOOD_SCORES: Record<string, number> = {
  anxious: -2,
  rushed: -1,
  tired: -1,
  focused: 1,
  grateful: 1,
  peaceful: 2,
};

const average = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);

export const InsightsScreen = () => {
  const { t, locale } = useI18n();
  const navigation = useNavigation<any>();
  const [entriesThisWeek, setEntriesThisWeek] = useState(0);
  const [moodHistory, setMoodHistory] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 6);
      weekAgo.setHours(0, 0, 0, 0);

      const savedEntries = getJournalEntries();
      const sourceEntries = savedEntries.length > 0 ? savedEntries : buildPreviewEntries();
      const weeklyEntries = sourceEntries.filter((entry) => {
        const created = new Date(entry.createdAt);
        return !Number.isNaN(created.getTime()) && created >= weekAgo && created <= now;
      });

      const uniqueDays = new Set(
        weeklyEntries.map((entry) => entry.createdAt.slice(0, 10))
      );
      setEntriesThisWeek(uniqueDays.size);
      setMoodHistory(
        weeklyEntries
          .filter((entry) => Boolean(entry.mood))
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((entry) => entry.mood as string)
          .slice(-6)
      );
    }, [])
  );

  const reflectionStatText = useMemo(() => {
    if (locale === 'es') {
      if (entriesThisWeek === 1) return 'Hiciste una pausa para reflexionar 1 día esta semana';
      return `Hiciste una pausa para reflexionar ${entriesThisWeek} días esta semana`;
    }
    if (entriesThisWeek === 1) return 'You paused to reflect 1 day this week';
    return `You paused to reflect ${entriesThisWeek} days this week`;
  }, [entriesThisWeek, locale]);

  const uniqueMoods = useMemo(
    () => Array.from(new Set(moodHistory)),
    [moodHistory]
  );
  const lastMood = useMemo(
    () => moodHistory[moodHistory.length - 1],
    [moodHistory]
  );
  const dominantMood = useMemo(
    () =>
      uniqueMoods
        .map((mood) => ({ mood, count: moodHistory.filter((entry) => entry === mood).length }))
        .sort((a, b) => b.count - a.count)[0],
    [moodHistory, uniqueMoods]
  );

  const rhythmExplanation = useMemo(() => {
    if (locale === 'es') {
      return 'Cada color representa el estado que registraste ese día, de antes hacia ahora.';
    }
    return 'Each color marks the mood you logged that day, moving from earlier to now.';
  }, [locale]);

  const reflectionSubtext = useMemo(() => {
    if (locale === 'es') {
      if (entriesThisWeek >= 4) return 'Volviste de forma consistente esta semana.';
      if (entriesThisWeek >= 2) return 'Ya hay un ritmo formándose esta semana.';
      if (entriesThisWeek === 1) return 'Un solo momento de atención ya empieza a formar un ritmo.';
      return 'Aún no hay suficientes pausas esta semana para detectar un patrón.';
    }
    if (entriesThisWeek >= 4) return 'You returned consistently this week.';
    if (entriesThisWeek >= 2) return 'A rhythm is beginning to take shape this week.';
    if (entriesThisWeek === 1) return 'Even one honest pause begins to form a rhythm.';
    return 'There are not enough pauses yet this week to detect a pattern.';
  }, [entriesThisWeek, locale]);

  const noticedText = useMemo(() => {
    const moodScores = moodHistory.map((mood) => MOOD_SCORES[mood] ?? 0);
    const splitIndex = Math.max(1, Math.floor(moodScores.length / 2));
    const earlierAvg = average(moodScores.slice(0, splitIndex));
    const laterAvg = average(moodScores.slice(splitIndex));
    const trendDelta = laterAvg - earlierAvg;
    if (locale === 'es') {
      if (moodHistory.length >= 4 && trendDelta >= 1) {
        return '"Tus registros avanzaron hacia un estado más estable al final de la semana. Vale la pena notar qué te ayudó a bajar el ritmo."';
      }
      if (moodHistory.length >= 4 && trendDelta <= -1) {
        return '"La segunda mitad de la semana cargó más tensión que la primera. Un descanso intencional hoy puede ayudarte a resetear."';
      }
      if (dominantMood && dominantMood.count >= 3) {
        return `"El estado que más se repitió fue ${t(`mood.label.${dominantMood.mood}`)}. Eso parece estar marcando el tono de tu semana."`;
      }
      if (uniqueMoods.length >= 4) {
        return '"Tus registros muestran bastante variación esta semana. No estás en un solo estado; tu ritmo ha cambiado día a día."';
      }
      if (entriesThisWeek === 1) return '"Un momento de reflexión abre espacio para escuchar mejor."';
      return '"Aún no registras pausas esta semana. Empieza con una sola reflexión breve."';
    }

    if (moodHistory.length >= 4 && trendDelta >= 1) {
      return '"Your check-ins moved toward a steadier place later in the week. Notice what helped you slow down or settle."';
    }
    if (moodHistory.length >= 4 && trendDelta <= -1) {
      return '"The second half of the week carried more strain than the first. A deliberate pause today may help you reset."';
    }
    if (dominantMood && dominantMood.count >= 3) {
      return `"${t(`mood.label.${dominantMood.mood}`)} showed up most often this week. That seems to be shaping the tone of your days."`;
    }
    if (uniqueMoods.length >= 4) {
      return '"Your check-ins varied quite a bit this week. You were not in one fixed state; your rhythm shifted day by day."';
    }
    if (entriesThisWeek === 1) return '"One reflective pause can open room to listen more clearly."';
    return '"No reflection pauses logged yet this week. Start with one short entry."';
  }, [dominantMood, entriesThisWeek, locale, moodHistory, t, uniqueMoods]);

  const insightSummary = useMemo(() => {
    if (locale === 'es') {
      if (lastMood) {
        return `Estado más reciente: ${t(`mood.label.${lastMood}`)}. ${moodHistory.length} registros recientes alimentan esta lectura.`;
      }
      return 'Agrega algunos registros de estado para que esta lectura sea más útil.';
    }
    if (lastMood) {
      return `Most recent posture: ${t(`mood.label.${lastMood}`)}. This reading is built from ${moodHistory.length} recent check-ins.`;
    }
    return 'Add a few mood check-ins to make this view more meaningful.';
  }, [lastMood, locale, moodHistory.length, t]);

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back-ios-new" size={20} color={Colors.accentGold} />
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>{t('insights.header')}</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>{t('insights.title')}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>{t('insights.rhythm')}</Text>
            <View style={styles.moodArcContainer}>
              <View style={styles.moodArcTrack}>
                {moodHistory.map((mood, index) => (
                  <View
                    key={`${mood}-${index}`}
                    style={[
                      styles.moodArcSegment,
                      { backgroundColor: MOOD_COLORS[mood] || 'rgba(130, 154, 177, 0.7)' },
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.arcLabels}>
              <Text style={styles.arcLabel}>{t('insights.earlier')}</Text>
              <Text style={styles.arcLabel}>{t('insights.now')}</Text>
            </View>
            <Text style={styles.sectionNote}>{rhythmExplanation}</Text>
            {uniqueMoods.length > 0 ? (
              <View style={styles.legendWrap}>
                {uniqueMoods.map((mood) => (
                  <View key={mood} style={styles.legendChip}>
                    <View style={[styles.legendSwatch, { backgroundColor: MOOD_COLORS[mood] || Colors.accentGold }]} />
                    <Text style={styles.legendChipText}>{t(`mood.label.${mood}`)}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </GlassCard>

          <GlassCard style={[styles.sectionCard, styles.centeredCard]}>
            <Text style={styles.sectionLabel}>{t('insights.reflectionPresence')}</Text>
            <Text style={styles.statText}>{reflectionStatText}</Text>
            <View style={styles.smallDivider} />
            <Text style={styles.statSubtext}>
              {reflectionSubtext}
            </Text>
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>{t('insights.notice')}</Text>
            <Text style={styles.noticeText}>{noticedText}</Text>
            <Text style={styles.insightSummary}>{insightSummary}</Text>
          </GlassCard>

          <Text style={styles.footerText}>
            {t('insights.footer')}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 40,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 4,
    marginBottom: 12,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 36,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 150,
  },
  sectionCard: {
    padding: 24,
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  centeredCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    letterSpacing: 2,
    marginBottom: 24,
    textTransform: 'uppercase',
  },
  moodArcContainer: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  moodArcTrack: {
    width: '100%',
    height: 18,
    borderRadius: 999,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.12)',
  },
  moodArcSegment: {
    flex: 1,
  },
  arcLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  arcLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 18,
  },
  legendWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
    justifyContent: 'center',
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.14)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  legendSwatch: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendChipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.72)',
  },
  statText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 28,
  },
  smallDivider: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  statSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '300',
  },
  noticeText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    lineHeight: 28,
  },
  insightSummary: {
    marginTop: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.52)',
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 40,
  }
});

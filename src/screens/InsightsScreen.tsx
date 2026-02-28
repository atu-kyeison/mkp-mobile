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
import { generateFormationInsight, generateMonthComparison } from '../utils/insightsEngine';

const SAMPLE_MOODS = ['peaceful', 'rushed', 'anxious', 'grateful', 'tired', 'focused'] as const;

const buildPreviewEntries = (locale: 'en' | 'es'): JournalEntry[] => {
  const today = new Date();
  const totalDays = 42;

  return Array.from({ length: totalDays }, (_, index) => {
    const mood = SAMPLE_MOODS[index % SAMPLE_MOODS.length];
    const entryDate = new Date(today);
    entryDate.setDate(today.getDate() - index);
    entryDate.setHours(9, 0, 0, 0);

    return {
      id: `insight-preview-${mood}-${index}`,
      createdAt: entryDate.toISOString(),
      body:
        locale === 'es'
          ? `Reflexión de prueba para ${mood}.`
          : `Preview reflection for ${mood}.`,
      invitationText:
        locale === 'es'
          ? 'Entrada de ritmo de prueba.'
          : 'Preview rhythm entry.',
      journalVariant: 'mid_week',
      mood,
      linkedSermonTitle: index % 3 === 0 ? (locale === 'es' ? 'Permanece y descansa' : 'Abide and Remain') : undefined,
      linkedSermonUrl: index % 3 === 0 ? 'https://www.youtube.com/' : undefined,
    };
  });
};

const MOOD_COLORS: Record<string, string> = {
  peaceful: 'rgba(186, 175, 142, 0.62)',
  rushed: 'rgba(176, 132, 96, 0.56)',
  anxious: 'rgba(114, 136, 168, 0.56)',
  grateful: 'rgba(229, 185, 95, 0.72)',
  tired: 'rgba(123, 133, 151, 0.5)',
  focused: 'rgba(154, 178, 170, 0.58)',
};

export const InsightsScreen = () => {
  const { t, locale } = useI18n();
  const navigation = useNavigation<any>();
  const [entriesThisWeek, setEntriesThisWeek] = useState(0);
  const [moodHistory, setMoodHistory] = useState<string[]>([]);
  const [currentWeekEntries, setCurrentWeekEntries] = useState<JournalEntry[]>([]);
  const [previousWeekEntries, setPreviousWeekEntries] = useState<JournalEntry[]>([]);
  const [currentMonthEntries, setCurrentMonthEntries] = useState<JournalEntry[]>([]);
  const [previousMonthEntries, setPreviousMonthEntries] = useState<JournalEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 6);
      weekAgo.setHours(0, 0, 0, 0);
      const previousWeekStart = new Date(weekAgo);
      previousWeekStart.setDate(weekAgo.getDate() - 7);
      previousWeekStart.setHours(0, 0, 0, 0);
      const previousWeekEnd = new Date(weekAgo);
      previousWeekEnd.setDate(weekAgo.getDate() - 1);
      previousWeekEnd.setHours(23, 59, 59, 999);
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonthComparableEnd = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        Math.min(now.getDate(), new Date(now.getFullYear(), now.getMonth(), 0).getDate()),
        23,
        59,
        59,
        999
      );

      const savedEntries = getJournalEntries();
      const sourceEntries = savedEntries.length > 0 ? savedEntries : buildPreviewEntries(locale);
      const weeklyEntries = sourceEntries.filter((entry) => {
        const created = new Date(entry.createdAt);
        return !Number.isNaN(created.getTime()) && created >= weekAgo && created <= now;
      });
      const priorEntries = sourceEntries.filter((entry) => {
        const created = new Date(entry.createdAt);
        return !Number.isNaN(created.getTime()) && created >= previousWeekStart && created <= previousWeekEnd;
      });
      const monthEntries = sourceEntries.filter((entry) => {
        const created = new Date(entry.createdAt);
        return !Number.isNaN(created.getTime()) && created >= currentMonthStart && created <= now;
      });
      const priorMonthEntries = sourceEntries.filter((entry) => {
        const created = new Date(entry.createdAt);
        return !Number.isNaN(created.getTime()) && created >= previousMonthStart && created <= previousMonthComparableEnd;
      });

      const uniqueDays = new Set(
        weeklyEntries.map((entry) => entry.createdAt.slice(0, 10))
      );
      setEntriesThisWeek(uniqueDays.size);
      setCurrentWeekEntries(weeklyEntries);
      setPreviousWeekEntries(priorEntries);
      setCurrentMonthEntries(monthEntries);
      setPreviousMonthEntries(priorMonthEntries);
      setMoodHistory(
        weeklyEntries
          .filter((entry) => Boolean(entry.mood))
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((entry) => entry.mood as string)
          .slice(-6)
      );
    }, [locale])
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

  const formationInsight = useMemo(
    () => generateFormationInsight({ locale, t, currentWeekEntries, previousWeekEntries }),
    [currentWeekEntries, locale, previousWeekEntries, t]
  );
  const monthComparison = useMemo(
    () => generateMonthComparison({ locale, t, currentMonthEntries, previousMonthEntries }),
    [currentMonthEntries, locale, previousMonthEntries, t]
  );

  const insightSummary = useMemo(() => {
    if (lastMood) {
      return locale === 'es'
        ? `Estado más reciente: ${t(`mood.label.${lastMood}`)}.`
        : `Most recent posture: ${t(`mood.label.${lastMood}`)}.`;
    }
    return '';
  }, [lastMood, locale, t]);

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
            <Text style={styles.noticeText}>{formationInsight.noticeText}</Text>
            <Text style={styles.insightSummary}>{formationInsight.summaryText}</Text>
            {formationInsight.signalLabels.length > 0 ? (
              <View style={styles.signalWrap}>
                {formationInsight.signalLabels.map((signal) => (
                  <View key={signal} style={styles.signalChip}>
                    <Text style={styles.signalChipText}>{signal}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            <Text style={styles.metricsText}>{formationInsight.metricsText}</Text>
            {insightSummary ? <Text style={styles.recentPostureText}>{insightSummary}</Text> : null}
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>{monthComparison.titleText}</Text>
            <Text style={styles.noticeText}>{monthComparison.bodyText}</Text>
            <Text style={styles.insightSummary}>{monthComparison.supportingText}</Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.08)',
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
    height: 72,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodArcTrack: {
    width: '100%',
    height: 22,
    borderRadius: 999,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.12)',
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  moodArcSegment: {
    flex: 1,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255,255,255,0.08)',
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
    color: 'rgba(255, 255, 255, 0.54)',
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
    borderColor: 'rgba(229, 185, 95, 0.16)',
    backgroundColor: 'rgba(229, 185, 95, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  legendSwatch: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: 8,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  legendChipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.78)',
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
  signalWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  signalChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.2)',
    backgroundColor: 'rgba(229, 185, 95, 0.09)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  signalChipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.accentGold,
  },
  metricsText: {
    marginTop: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  recentPostureText: {
    marginTop: 10,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.42)',
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

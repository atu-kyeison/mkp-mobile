import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';
import { getJournalEntries, JournalEntry } from '../storage/journalStore';
import { buildJourneyPreviewEntries } from '../utils/journeyPreview';

const MOOD_EMOJI: Record<string, string> = {
  peaceful: '🌤️',
  rushed: '🌬️',
  anxious: '⛈️',
  grateful: '☀️',
  tired: '🌙',
  focused: '🌅',
};

export const PastAwarenessListScreen = ({ navigation }: any) => {
  const { t, locale } = useI18n();
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      setEntries(getJournalEntries());
    }, [])
  );

  const moodEntries = useMemo(() => {
    const sourceEntries = entries.length > 0 ? entries : buildJourneyPreviewEntries(locale);
    return sourceEntries.filter((entry) => Boolean(entry.mood));
  }, [entries, locale]);

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="rgba(229, 185, 95, 0.6)" />
          </TouchableOpacity>
          <Text style={styles.kicker}>{t('moodDetail.subtitle')}</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>{t('journey.pastAwareness.title')}</Text>
          <Text style={styles.subtitle}>{t('journey.pastAwareness.subtitle')}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {moodEntries.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyText}>{t('journey.pastAwareness.empty')}</Text>
            </GlassCard>
          ) : (
            moodEntries.map((entry) => {
              const moodId = String(entry.mood || 'peaceful').toLowerCase();
              const dateLabel = new Date(entry.createdAt)
                .toLocaleDateString(localeTag, { weekday: 'long', month: 'short', day: 'numeric' })
                .replace(',', ' -');

              return (
                <TouchableOpacity
                  key={entry.id}
                  onPress={() =>
                    navigation.navigate('MoodDetail', {
                      moodId,
                      date: dateLabel,
                      entryId: entry.id,
                      entry,
                    })
                  }
                >
                  <GlassCard style={styles.entryCard}>
                    <View style={styles.entryTopRow}>
                      <View style={styles.moodPill}>
                        <Text style={styles.moodEmoji}>{MOOD_EMOJI[moodId] || '🌿'}</Text>
                        <Text style={styles.moodLabel}>{t(`mood.label.${moodId}`)}</Text>
                      </View>
                      <MaterialIcons name="chevron-right" size={16} color="rgba(229,185,95,0.42)" />
                    </View>
                    <Text style={styles.entryDate}>{dateLabel.toUpperCase()}</Text>
                    <Text style={styles.entryBody} numberOfLines={3}>
                      {entry.body}
                    </Text>
                  </GlassCard>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 12,
  },
  kicker: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 4,
    marginBottom: 12,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 28,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.62)',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 160,
    gap: 14,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 24,
  },
  emptyText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    lineHeight: 30,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
  },
  entryCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(13, 27, 42, 0.62)',
    marginBottom: 14,
  },
  entryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(229,185,95,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229,185,95,0.18)',
  },
  moodEmoji: {
    fontSize: 18,
  },
  moodLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  entryDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.42)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  entryBody: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 17,
    lineHeight: 27,
    color: 'rgba(255,255,255,0.88)',
  },
});

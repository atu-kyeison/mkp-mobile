import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../theme/ThemeProvider';
import { getJournalEntryById } from '../storage/journalStore';

const MOOD_DETAILS: Record<
  string,
  {
    icon: keyof typeof MaterialIcons.glyphMap;
    titleKey: string;
    descriptionKey: string;
    iconOffset?: { x?: number; y?: number };
  }
> = {
  tired: {
    icon: 'dark-mode',
    titleKey: 'moodDetail.title.tired',
    descriptionKey: 'moodDetail.desc.tired',
    iconOffset: { x: 0, y: 1 },
  },
  rushed: {
    icon: 'bolt',
    titleKey: 'moodDetail.title.rushed',
    descriptionKey: 'moodDetail.desc.rushed',
    iconOffset: { x: 1, y: 0 },
  },
  grateful: {
    icon: 'favorite',
    titleKey: 'moodDetail.title.grateful',
    descriptionKey: 'moodDetail.desc.grateful',
    iconOffset: { x: -1, y: 1 },
  },
  peaceful: {
    icon: 'yard',
    titleKey: 'moodDetail.title.peaceful',
    descriptionKey: 'moodDetail.desc.peaceful',
    iconOffset: { x: -1, y: 2 },
  },
  focused: {
    icon: 'center-focus-strong',
    titleKey: 'moodDetail.title.focused',
    descriptionKey: 'moodDetail.desc.focused',
    iconOffset: { x: 0, y: 0 },
  },
  anxious: {
    icon: 'waves',
    titleKey: 'moodDetail.title.anxious',
    descriptionKey: 'moodDetail.desc.anxious',
    iconOffset: { x: 0, y: 1 },
  }
};

export const MoodDetailScreen = ({ navigation, route }: any) => {
  const { t, locale } = useI18n();
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  const insets = useSafeAreaInsets();
  const moodId = route.params?.moodId || 'tired';
  const detail = MOOD_DETAILS[moodId] || MOOD_DETAILS.tired;
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';
  const fallbackDate = useMemo(
    () =>
      new Date()
        .toLocaleDateString(localeTag, { weekday: 'long', month: 'short', day: 'numeric' })
        .replace(',', ' -'),
    [localeTag]
  );
  const dateStr = route.params?.date || fallbackDate || t('moodDetail.defaultDate');
  const linkedEntry = route.params?.entryId ? getJournalEntryById(route.params.entryId) : null;

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="rgba(229, 185, 95, 0.6)" />
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>{t('moodDetail.subtitle')}</Text>
          <View style={styles.divider} />
          <Text style={styles.date}>{dateStr}</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 112 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
          <GlassCard variant="large" style={styles.detailCard}>
            <Text style={styles.cardSubtitle}>{t('moodDetail.innerPosture')}</Text>

            <View style={styles.iconContainer}>
              <View style={styles.iconFrame}>
                <MaterialIcons
                  name={detail.icon}
                  size={68}
                  color={Colors.accentGold}
                  style={[
                    styles.icon,
                    detail.iconOffset
                      ? {
                          transform: [
                            { translateX: detail.iconOffset.x || 0 },
                            { translateY: detail.iconOffset.y || 0 },
                          ],
                        }
                      : null,
                  ]}
                />
              </View>
            </View>

            <Text style={styles.title}>{t(detail.titleKey)}</Text>
            <Text style={styles.description}>{t(detail.descriptionKey)}</Text>

            <TouchableOpacity
              style={styles.journalButton}
              onPress={() => {
                if (linkedEntry) {
                  navigation.navigate('ReflectionDetail', {
                    entryId: linkedEntry.id,
                    date: dateStr.toUpperCase(),
                    invitation: linkedEntry.invitationText || '',
                    mood: linkedEntry.mood,
                    fromSunday: Boolean(linkedEntry.linkedSermonTitle),
                    content: linkedEntry.body,
                  });
                  return;
                }

                navigation.navigate('ReflectionEntry', {
                  journalVariant: 'mid_week',
                  fromMoodDetail: true,
                });
              }}
              >
              <MaterialIcons name="history-edu" size={24} color={Colors.accentGold} />
              <Text style={styles.journalButtonText}>{t('moodDetail.journalEntry')}</Text>
            </TouchableOpacity>
          </GlassCard>

          <View style={styles.footerNoteContainer}>
            <Text style={styles.footerNote}>{t('moodDetail.footer')}</Text>
          </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    flexGrow: 1,
  },
  header: {
    paddingTop: 12,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 8,
  },
  headerSubtitle: {
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
    marginBottom: 24,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  detailCard: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 28,
  },
  cardSubtitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: Colors.accentGold,
    letterSpacing: 3,
    marginBottom: 28,
    textAlign: 'center',
  },
  iconContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(229, 185, 95, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.24)',
  },
  iconFrame: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    opacity: 0.9,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 18,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 28,
  },
  journalButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 240,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.accentGold,
    backgroundColor: 'rgba(13, 27, 42, 0.5)',
    gap: 12,
  },
  journalButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: Colors.accentGold,
    letterSpacing: 2.5,
  },
  footerNoteContainer: {
    marginTop: 32,
    opacity: 0.4,
  },
  footerNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
});

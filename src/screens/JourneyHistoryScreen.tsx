import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal, StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated, PanResponder } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../theme/ThemeProvider';
import { getJournalEntries, JournalEntry } from '../storage/journalStore';

type CalendarDay = {
  day: number;
  isoDate: string;
  muted?: boolean;
  reflection?: boolean;
  mood?: boolean;
  sunday?: boolean;
};

const SAMPLE_MOODS = ['peaceful', 'rushed', 'anxious', 'grateful', 'tired', 'focused'] as const;

const MOOD_EMOJI: Record<string, string> = {
  anxious: '⛈️',
  rushed: '🌬️',
  tired: '🌙',
  grateful: '☀️',
  peaceful: '🌤️',
  focused: '🌅',
};

const buildSampleEntries = (locale: 'en' | 'es'): JournalEntry[] => {
  const today = new Date();

  return SAMPLE_MOODS.map((mood, index) => {
    const entryDate = new Date(today);
    entryDate.setDate(today.getDate() - index);
    entryDate.setHours(9, 0, 0, 0);

    return {
      id: `sample-${mood}-${index}`,
      createdAt: entryDate.toISOString(),
      body:
        locale === 'es'
          ? mood === 'peaceful'
            ? 'Hoy sentí una quietud serena y noté cuánto se aligeró mi espíritu cuando bajé el ritmo.'
            : mood === 'rushed'
              ? 'Todo se sintió rápido hoy. Necesité pausar y dejar que Dios reiniciara mi ritmo.'
              : mood === 'anxious'
                ? 'Había tensión bajo la superficie, pero nombrarla me ayudó a dejar de cargarla solo.'
                : mood === 'grateful'
                  ? 'Noté varios regalos pequeños hoy y sentí cómo mi corazón se suavizaba en gratitud.'
                  : mood === 'tired'
                    ? 'Mi cuerpo y mi mente se sintieron agotados, así que elegí el descanso en lugar de forzar más.'
                    : 'Mi atención se sintió inusualmente clara hoy, y quise mantenerme alineado con lo que más importa.'
          : mood === 'peaceful'
            ? 'I felt a quiet steadiness today and noticed how much lighter my spirit became when I slowed down.'
            : mood === 'rushed'
              ? 'Everything felt fast today. I needed to pause and let God reset my pace.'
              : mood === 'anxious'
                ? 'There was tension under the surface, but naming it helped me stop carrying it alone.'
                : mood === 'grateful'
                  ? 'I noticed several small gifts today and felt my heart soften in gratitude.'
                  : mood === 'tired'
                    ? 'My body and mind felt worn down, so I chose rest over forcing more output.'
                    : 'My attention felt unusually clear today, and I wanted to stay aligned with what mattered most.',
      invitationText:
        locale === 'es'
          ? 'Un momento sencillo de conciencia se volvió parte de la formación de hoy.'
          : 'A simple moment of awareness became part of today’s formation.',
      journalVariant: 'mid_week',
      mood,
      linkedSermonTitle: index % 2 === 0 ? (locale === 'es' ? 'Permanece y descansa' : 'Abide and Remain') : undefined,
      linkedSermonUrl: index % 2 === 0 ? 'https://www.youtube.com/' : undefined,
    };
  });
};

const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildCalendarDays = (monthCursor: Date, entriesByDate: Map<string, JournalEntry[]>) => {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = firstDayOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 35; i += 1) {
    const current = new Date(gridStart);
    current.setDate(gridStart.getDate() + i);
    const isoDate = toIsoDate(current);
    const dayEntries = entriesByDate.get(isoDate) || [];
    days.push({
      day: current.getDate(),
      isoDate,
      muted: current.getMonth() !== month,
      reflection: dayEntries.length > 0,
      mood: dayEntries.some((entry) => Boolean(entry.mood)),
      sunday: current.getDay() === 0,
    });
  }
  return days;
};

export const JourneyHistoryScreen = ({ navigation }: any) => {
  const { t, locale } = useI18n();
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'LIBRARY' | 'FAVORITES' | 'CALENDAR'>('LIBRARY');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [detailState, setDetailState] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [selectedDayEntries, setSelectedDayEntries] = useState<JournalEntry[]>([]);
  const sheetTranslateY = useMemo(() => new Animated.Value(0), []);

  const displayEntries = useMemo(
    () => (entries.length > 0 ? entries : buildSampleEntries(locale)),
    [entries, locale]
  );

  useFocusEffect(
    useCallback(() => {
      setEntries(getJournalEntries());
    }, [])
  );

  const entriesByDate = useMemo(() => {
    const map = new Map<string, JournalEntry[]>();
    displayEntries.forEach((entry) => {
      const key = toIsoDate(new Date(entry.createdAt));
      const current = map.get(key) || [];
      current.push(entry);
      map.set(key, current);
    });
    return map;
  }, [displayEntries]);

  const calendarDays = useMemo(() => buildCalendarDays(monthCursor, entriesByDate), [monthCursor, entriesByDate]);

  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';
  const quickMoodDate = useMemo(
    () =>
      new Date()
        .toLocaleDateString(localeTag, { weekday: 'long', month: 'short', day: 'numeric' })
        .replace(',', ' -'),
    [localeTag]
  );

  const journeyItems = useMemo(
    () =>
      displayEntries.map((entry) => ({
        id: entry.id,
        date: new Date(entry.createdAt).toLocaleDateString(localeTag, { weekday: 'long', month: 'short', day: 'numeric' }).replace(',', ' -'),
        type: t('journey.dayDetail.reflection'),
        content: entry.body,
        invitation: entry.invitationText || '',
        mood: entry.mood,
        fromSunday: Boolean(entry.linkedSermonTitle),
        sermonUrl: entry.linkedSermonUrl,
        isItalic: false,
      })),
    [displayEntries, localeTag, t]
  );

  const latestMoodEntry = useMemo(
    () => displayEntries.find((entry) => Boolean(entry.mood)) || null,
    [displayEntries]
  );

  const detailTitle = useMemo(() => {
    if (!selectedDay) return '';
    const date = new Date(selectedDay.isoDate);
    return date.toLocaleDateString(localeTag, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  }, [localeTag, selectedDay]);
  const isSelectedDayToday = useMemo(
    () => (selectedDay ? selectedDay.isoDate === toIsoDate(new Date()) : false),
    [selectedDay]
  );

  const activeDayEntry = selectedDayEntries[0];

  const favoriteItems = useMemo(
    () => journeyItems.filter((item) => favoriteIds.includes(item.id)),
    [favoriteIds, journeyItems]
  );

  const resolveDayState = (day: CalendarDay) => {
    setDetailState('loading');
    setTimeout(() => {
      const dayEntries = entriesByDate.get(day.isoDate) || [];
      setSelectedDayEntries(dayEntries);
      setDetailState(dayEntries.length > 0 ? 'ready' : 'empty');
    }, 700);
  };

  const openDay = (day: CalendarDay) => {
    setSelectedDay(day);
    resolveDayState(day);
  };

  const retrySelectedDay = () => {
    if (!selectedDay) {
      setDetailState('error');
      return;
    }
    resolveDayState(selectedDay);
  };

  const toggleFavorite = (itemId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const closeSheet = () => {
    Animated.timing(sheetTranslateY, {
      toValue: 420,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      sheetTranslateY.setValue(0);
      setSelectedDay(null);
    });
  };

  const sheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 8 && Math.abs(gestureState.dx) < 20,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            sheetTranslateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 110 || gestureState.vy > 1.2) {
            closeSheet();
            return;
          }

          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        },
      }),
    [sheetTranslateY]
  );

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Text style={styles.headerKicker}>{t('journey.title')}</Text>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segmentedItem, activeTab === 'LIBRARY' && styles.segmentedItemActive]}
              onPress={() => setActiveTab('LIBRARY')}
            >
              <Text style={[styles.segmentedText, activeTab === 'LIBRARY' && styles.segmentedTextActive]}>{t('journey.library')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentedItem, activeTab === 'FAVORITES' && styles.segmentedItemActive]}
              onPress={() => setActiveTab('FAVORITES')}
            >
              <Text style={[styles.segmentedText, activeTab === 'FAVORITES' && styles.segmentedTextActive]}>{t('journey.favorites')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentedItem, activeTab === 'CALENDAR' && styles.segmentedItemActive]}
              onPress={() => setActiveTab('CALENDAR')}
            >
              <Text style={[styles.segmentedText, activeTab === 'CALENDAR' && styles.segmentedTextActive]}>{t('journey.calendar')}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>{t('journey.subtitle')}</Text>
        </View>

        {activeTab === 'LIBRARY' ? (
          <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 + insets.bottom }]} showsVerticalScrollIndicator={false}>
            <View style={styles.quickLinks}>
              <TouchableOpacity style={styles.quickLinkButton} onPress={() => navigation.navigate('Insights')}>
                <Text style={styles.quickLinkText}>{t('journey.quick.insights')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickLinkButton}
                onPress={() =>
                  navigation.navigate('MoodDetail', {
                    moodId: latestMoodEntry?.mood || 'peaceful',
                    date:
                      latestMoodEntry
                        ? new Date(latestMoodEntry.createdAt)
                            .toLocaleDateString(localeTag, { weekday: 'long', month: 'short', day: 'numeric' })
                            .replace(',', ' -')
                        : quickMoodDate,
                    entryId: latestMoodEntry?.id,
                  })
                }
              >
                <Text style={styles.quickLinkText}>{t('journey.quick.awareness')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timelineLine} />
            {journeyItems.length === 0 ? (
              <GlassCard style={styles.emptyPromptCard}>
                <Text style={styles.emptyPromptText}>{t('journey.favoritesEmpty')}</Text>
                <TouchableOpacity
                  style={styles.favoritesCta}
                  onPress={() =>
                    navigation.navigate('ReflectionEntry', {
                      journalVariant: 'mid_week',
                      openMoodOnEntry: false,
                    })
                  }
                >
                  <Text style={styles.favoritesCtaText}>{t('journey.favoritesCta')}</Text>
                </TouchableOpacity>
              </GlassCard>
            ) : null}
            {journeyItems.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <View style={styles.timelineDot} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemDate}>{item.date}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ReflectionDetail', {
                        entryId: item.id,
                        date: item.date.toUpperCase(),
                        invitation: item.invitation,
                        mood: item.mood,
                        fromSunday: item.fromSunday,
                        sermonUrl: item.sermonUrl,
                        content: item.content,
                      })
                    }
                  >
                    <GlassCard style={styles.itemCard}>
                      <View style={styles.itemHeaderRow}>
                        <Text style={styles.itemType}>{item.type}</Text>
                        <TouchableOpacity
                          onPress={(event) => {
                            event.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          hitSlop={10}
                        >
                          <MaterialIcons
                            name={favoriteIds.includes(item.id) ? 'star' : 'star-border'}
                            size={18}
                            color={Colors.accentGold}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.itemText, item.isItalic && styles.italicText]}>{item.content}</Text>
                    </GlassCard>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : activeTab === 'FAVORITES' ? (
          <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 + insets.bottom }]} showsVerticalScrollIndicator={false}>
            {favoriteItems.length === 0 ? (
              <GlassCard style={styles.favoritesEmptyCard}>
                <View style={styles.favoritesIconWrap}>
                  <MaterialIcons name="alt-route" size={28} color={Colors.accentGold} />
                </View>
                <Text style={styles.favoritesEmptyText}>{t('journey.favoritesEmpty')}</Text>
                <TouchableOpacity
                  style={styles.favoritesCta}
                  onPress={() =>
                    navigation.navigate('ReflectionEntry', {
                      journalVariant: 'mid_week',
                      openMoodOnEntry: false,
                    })
                  }
                >
                  <Text style={styles.favoritesCtaText}>{t('journey.favoritesCta')}</Text>
                </TouchableOpacity>
              </GlassCard>
            ) : (
              <View style={styles.favoritesList}>
                {favoriteItems.map((item) => (
                  <GlassCard key={item.id} style={styles.favoriteItemCard}>
                    <View style={styles.itemHeaderRow}>
                      <Text style={styles.itemType}>{item.type}</Text>
                      <TouchableOpacity onPress={() => toggleFavorite(item.id)} hitSlop={10}>
                        <MaterialIcons name="star" size={18} color={Colors.accentGold} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemDate}>{item.date}</Text>
                    <Text style={[styles.itemText, item.isItalic && styles.italicText]}>{item.content}</Text>
                  </GlassCard>
                ))}
              </View>
            )}
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={[styles.calendarScroll, { paddingBottom: 150 + insets.bottom }]} showsVerticalScrollIndicator={false}>
            <View style={styles.monthHeader}>
              <TouchableOpacity
                style={styles.chevronButton}
                onPress={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              >
                <MaterialIcons name="chevron-left" size={20} color="rgba(229, 185, 95, 0.45)" />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>
                {monthCursor.toLocaleDateString(localeTag, { month: 'long', year: 'numeric' }).toUpperCase()}
              </Text>
              <TouchableOpacity
                style={styles.chevronButton}
                onPress={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              >
                <MaterialIcons name="chevron-right" size={20} color="rgba(229, 185, 95, 0.45)" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekHeader}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                <Text key={`${d}-${idx}`} style={styles.weekDay}>{d}</Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {calendarDays.map((day, idx) => (
                <TouchableOpacity key={`${day.isoDate}-${idx}`} style={styles.dayCell} onPress={() => openDay(day)}>
                  {!day.muted && selectedDay?.isoDate === day.isoDate ? <View style={styles.selectedRing} /> : null}
                  <Text style={[styles.dayNumber, day.muted && styles.mutedDayNumber, !day.muted && selectedDay?.isoDate === day.isoDate && styles.selectedDayNumber]}>
                    {day.day}
                  </Text>
                  <View style={styles.dayMeta}>
                    {day.sunday ? <MaterialIcons name="auto-awesome" size={10} color={Colors.accentGold} /> : null}
                    {day.reflection ? <View style={[styles.dot, styles.reflectionDot]} /> : null}
                    {day.mood ? <View style={[styles.dot, styles.moodDot]} /> : null}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}><View style={[styles.dot, styles.reflectionDot]} /><Text style={styles.legendText}>{t('journey.legend.reflection')}</Text></View>
              <Text style={styles.legendSeparator}>-</Text>
              <View style={styles.legendItem}><View style={[styles.dot, styles.moodDot]} /><Text style={styles.legendText}>{t('journey.legend.mood')}</Text></View>
              <Text style={styles.legendSeparator}>-</Text>
              <View style={styles.legendItem}><MaterialIcons name="auto-awesome" size={10} color={Colors.accentGold} /><Text style={styles.legendText}>{t('journey.legend.sunday')}</Text></View>
            </View>

            <GlassCard style={styles.emptyPromptCard}>
              <Text style={styles.emptyPromptText}>{t('journey.emptyPrompt')}</Text>
            </GlassCard>
          </ScrollView>
        )}

        <Modal transparent visible={selectedDay !== null} animationType="fade" onRequestClose={() => setSelectedDay(null)}>
          <View style={styles.modalBackdrop}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={closeSheet} />
            <Animated.View
              {...sheetPanResponder.panHandlers}
              style={[
                styles.bottomSheet,
                {
                  paddingBottom: 38 + insets.bottom,
                  minHeight: '66%',
                  maxHeight: '84%',
                  transform: [{ translateY: sheetTranslateY }],
                },
              ]}
            >
              <View style={styles.sheetHandleWrap}>
                <View style={styles.sheetHandle} />
              </View>
              <View style={styles.sheetHeader}>
                <View style={styles.headerSpacer} />
                <View style={styles.sheetTitleWrap}>
                  <Text style={styles.sheetDate}>{detailTitle}</Text>
                  <Text style={styles.sheetTitle}>{t('journey.dayDetail.title')}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={closeSheet}>
                  <MaterialIcons name="close" size={18} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              </View>

              {detailState === 'loading' ? (
                <View style={styles.sheetBodyCentered}>
                  <ActivityIndicator size="large" color={Colors.accentGold} />
                  <Text style={styles.sheetLoadingText}>{t('journey.dayDetail.loading')}</Text>
                </View>
              ) : null}

              {detailState === 'ready' ? (
                <ScrollView
                  style={styles.sheetBodyReady}
                  contentContainerStyle={styles.sheetBodyReadyContent}
                  showsVerticalScrollIndicator={false}
                >
                  <TouchableOpacity
                    style={styles.readySection}
                    onPress={() =>
                      navigation.navigate('MoodDetail', {
                        moodId: activeDayEntry?.mood || 'peaceful',
                        date: detailTitle,
                        entryId: activeDayEntry?.id,
                      })
                    }
                  >
                    <View style={styles.readySectionHeader}>
                      <Text style={styles.readyLabel}>{t('journey.dayDetail.innerPosture')}</Text>
                      <MaterialIcons name="chevron-right" size={16} color="rgba(229,185,95,0.35)" />
                    </View>
                    <View style={styles.moodPill}>
                      <Text style={styles.moodEmoji}>
                        {activeDayEntry?.mood ? MOOD_EMOJI[String(activeDayEntry.mood).toLowerCase()] || '🌿' : '🌿'}
                      </Text>
                      <Text style={styles.moodPillText}>
                        {activeDayEntry?.mood ? t(`mood.label.${String(activeDayEntry.mood).toLowerCase()}`) : t('journey.dayDetail.fallbackMoodLogged')}
                      </Text>
                    </View>
                    <Text style={styles.readySubText}>{activeDayEntry?.invitationText || t('journey.dayDetail.fallbackSavedReflection')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.readySection}
                    onPress={() =>
                      navigation.navigate('ReflectionDetail', {
                        date: detailTitle,
                        invitation: activeDayEntry?.invitationText || '',
                        mood: activeDayEntry?.mood,
                        fromSunday: Boolean(activeDayEntry?.linkedSermonTitle),
                        sermonUrl: activeDayEntry?.linkedSermonUrl,
                        content: activeDayEntry?.body || '',
                      })
                    }
                  >
                    <View style={styles.readySectionHeader}>
                      <Text style={styles.readyLabel}>{t('journey.dayDetail.reflection')}</Text>
                      <MaterialIcons name="chevron-right" size={16} color="rgba(229,185,95,0.35)" />
                    </View>
                    <Text style={styles.readyReflectionText}>
                      {activeDayEntry?.body || t('journey.dayDetail.fallbackNoReflection')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.readySection, styles.readySundaySection]}
                    onPress={() => navigation.navigate('SundaySummaryDetail')}
                    disabled={!activeDayEntry?.linkedSermonTitle}
                  >
                    <View style={styles.readySectionHeader}>
                      <Text style={styles.readyLabel}>{t('journey.dayDetail.fromSunday')}</Text>
                      <MaterialIcons name="chevron-right" size={16} color="rgba(229,185,95,0.35)" />
                    </View>
                    <View style={styles.sundayRow}>
                      <View style={styles.sundayAccent} />
                      <Text style={styles.sundayText}>
                        {activeDayEntry?.linkedSermonTitle || t('journey.dayDetail.fallbackNoSundayLink')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              ) : null}

              {detailState === 'empty' ? (
                <View style={styles.sheetBodyCentered}>
                  <Text style={styles.sheetEmptyText}>{t('journey.dayDetail.empty')}</Text>
                  {isSelectedDayToday ? (
                    <>
                      <TouchableOpacity
                        style={styles.addReflectionButton}
                        onPress={() => {
                          setSelectedDay(null);
                          navigation.navigate('ReflectionEntry', {
                            journalVariant: 'mid_week',
                            openMoodOnEntry: false,
                          });
                        }}
                      >
                        <Text style={styles.addReflectionText}>{t('journey.dayDetail.addReflection')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.logMoodLink}
                        onPress={() => {
                          setSelectedDay(null);
                          navigation.navigate('MoodCheckIn', {
                            nextScreen: 'JourneyHistory',
                          });
                        }}
                      >
                        <Text style={styles.logMoodText}>{t('journey.dayDetail.logMood')}</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <Text style={styles.readOnlyNote}>{t('journey.dayDetail.readOnlyPast')}</Text>
                  )}
                </View>
              ) : null}

              {detailState === 'error' ? (
                <View style={styles.sheetBodyCentered}>
                  <Text style={styles.sheetErrorText}>{t('journey.dayDetail.error')}</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={retrySelectedDay}>
                    <Text style={styles.retryText}>{t('journey.dayDetail.retry')}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </Animated.View>
          </View>
        </Modal>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const createStyles = () => StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  headerRow: { paddingTop: 34, paddingHorizontal: 24, paddingBottom: 18, alignItems: 'center', justifyContent: 'center' },
  headerKicker: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 4, color: Colors.accentGold, marginBottom: 12 },
  headerTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 20, color: '#fff', marginTop: 14, textAlign: 'center' },
  segmentedControl: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(229,185,95,0.15)', borderRadius: 999, padding: 2 },
  segmentedItem: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999 },
  segmentedItemActive: { backgroundColor: 'rgba(229,185,95,0.16)' },
  segmentedText: { fontFamily: 'Cinzel_700Bold', fontSize: 9, letterSpacing: 1.6, color: 'rgba(255,255,255,0.45)' },
  segmentedTextActive: { color: Colors.accentGold },
  scrollContent: { paddingHorizontal: 24 },
  quickLinks: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickLinkButton: { flex: 1, borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.35)', borderRadius: 14, paddingVertical: 12, alignItems: 'center', backgroundColor: 'rgba(13, 27, 42, 0.45)' },
  quickLinkText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.8, color: Colors.accentGold },
  timelineLine: { position: 'absolute', left: 24, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(229, 185, 95, 0.2)' },
  itemContainer: { flexDirection: 'row', marginBottom: 32 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(229, 185, 95, 0.4)', borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.6)', position: 'absolute', left: -5.5, top: 16 },
  itemContent: { flex: 1, paddingLeft: 32 },
  itemDate: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
  itemCard: { padding: 20, backgroundColor: 'rgba(13, 27, 42, 0.6)' },
  itemHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  itemType: { fontFamily: 'Cinzel_700Bold', fontSize: 9, color: Colors.accentGold, letterSpacing: 2 },
  favoritesList: { gap: 14 },
  favoriteItemCard: { padding: 20, borderRadius: 20 },
  favoritesEmptyCard: { width: '100%', borderRadius: 34, paddingVertical: 52, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  favoritesIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(229,185,95,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229,185,95,0.06)',
    marginBottom: 22,
    alignSelf: 'center',
  },
  favoritesEmptyText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    lineHeight: 34,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    marginBottom: 40,
  },
  favoritesCta: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    borderRadius: 12,
    backgroundColor: Colors.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
  favoritesCtaText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    letterSpacing: 1.4,
    color: Colors.backgroundDark,
    textAlign: 'center',
  },
  itemText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 17, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 26 },
  italicText: { fontStyle: 'italic' },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calendarScroll: { paddingHorizontal: 24 },
  monthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, gap: 22 },
  chevronButton: { padding: 4 },
  monthTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 13, letterSpacing: 5, color: Colors.accentGold },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  weekDay: { width: '14.2%', textAlign: 'center', fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 2, color: 'rgba(229,185,95,0.45)' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 10, marginBottom: 20 },
  dayCell: { width: '14.2%', aspectRatio: 1, alignItems: 'center', paddingTop: 8, position: 'relative' },
  selectedRing: { position: 'absolute', top: 4, width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(229,185,95,0.75)' },
  dayNumber: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  mutedDayNumber: { color: 'rgba(255,255,255,0.18)' },
  selectedDayNumber: { color: Colors.accentGold },
  dayMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 3, minHeight: 12 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  reflectionDot: { backgroundColor: Colors.accentGold },
  moodDot: { backgroundColor: 'rgba(148, 163, 184, 0.85)' },
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 26, gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(229,185,95,0.6)' },
  legendSeparator: { color: 'rgba(229,185,95,0.25)' },
  emptyPromptCard: { borderRadius: 28, minHeight: 220, paddingVertical: 30, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'space-between' },
  emptyPromptText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 15, color: 'rgba(255,255,255,0.45)', textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: Colors.backgroundDark, borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 38, borderTopWidth: 1, borderTopColor: 'rgba(229,185,95,0.3)' },
  sheetHandleWrap: { alignItems: 'center', paddingBottom: 6 },
  sheetHandle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.18)', marginBottom: 18 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  headerSpacer: { width: 32 },
  sheetTitleWrap: { alignItems: 'center' },
  sheetDate: { fontFamily: 'Cinzel_700Bold', fontSize: 18, letterSpacing: 5, color: Colors.accentGold, marginBottom: 4 },
  sheetTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 18, color: 'rgba(255,255,255,0.92)' },
  closeButton: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  sheetBodyCentered: { flex: 1, minHeight: 170, alignItems: 'center', justifyContent: 'center', gap: 12 },
  sheetLoadingText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 16, color: 'rgba(229,185,95,0.85)' },
  sheetBodyReady: { flex: 1, paddingTop: 2 },
  sheetBodyReadyContent: { paddingBottom: 8 },
  readySection: { marginBottom: 20 },
  readySectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  readyLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 3, color: Colors.accentGold },
  moodPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(229,185,95,0.25)',
    backgroundColor: 'rgba(229,185,95,0.08)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  moodEmoji: { fontSize: 18 },
  moodPillText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  readySubText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 16, color: 'rgba(255,255,255,0.72)' },
  readyReflectionText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 18, lineHeight: 42, color: 'rgba(255,255,255,0.86)' },
  readySundaySection: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 16, marginBottom: 0 },
  sundayRow: { flexDirection: 'row', alignItems: 'center' },
  sundayAccent: { width: 5, height: 45, borderRadius: 3, backgroundColor: 'rgba(229,185,95,0.3)', marginRight: 12 },
  sundayText: { flex: 1, fontFamily: 'PlayfairDisplay_400Regular', fontSize: 16, color: 'rgba(255,255,255,0.78)' },
  sundayTextMuted: { color: 'rgba(255,255,255,0.42)' },
  sheetEmptyText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 17, color: 'rgba(148,163,184,0.88)' },
  addReflectionButton: {
    marginTop: 8,
    minWidth: 260,
    maxWidth: 320,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: Colors.accentGold,
    paddingVertical: 20,
    paddingHorizontal: 26,
    alignItems: 'center',
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 28,
    elevation: 8,
  },
  addReflectionText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    letterSpacing: 4,
    color: Colors.backgroundDark,
  },
  logMoodLink: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229,185,95,0.45)',
    paddingBottom: 2,
    alignSelf: 'center',
  },
  logMoodText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    letterSpacing: 4,
    color: Colors.accentGold,
  },
  sheetErrorText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 17, color: '#D97B66' },
  retryButton: { borderWidth: 1, borderColor: 'rgba(229,185,95,0.4)', borderRadius: 12, paddingHorizontal: 28, paddingVertical: 11, backgroundColor: 'rgba(255,255,255,0.03)', alignSelf: 'center' },
  retryText: { fontFamily: 'Cinzel_700Bold', fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.82)' },
  readOnlyNote: {
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 18,
  },
});

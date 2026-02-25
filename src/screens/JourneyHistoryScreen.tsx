import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';

const JOURNEY_ITEMS = [
  { id: '1', date: 'Friday - Sept 22', type: 'REFLECTION', content: "'I noticed God's hand in the quietness of the morning...'", isItalic: true },
  { id: '2', date: 'Thursday - Sept 21', type: 'FROM SUNDAY', content: 'Sermon Echo: Abiding teaches us to respond, not react.', isItalic: false },
  { id: '3', date: 'Wednesday - Sept 20', type: 'INNER AWARENESS', content: 'Posture: Peaceful', icon: 'psychology-alt' as const, isItalic: false, moodId: 'peaceful' },
];

type CalendarDay = {
  day: number;
  muted?: boolean;
  reflection?: boolean;
  mood?: boolean;
  sunday?: boolean;
  hasDetail?: boolean;
};

const CALENDAR_DAYS: CalendarDay[] = [
  { day: 1, reflection: true, mood: true, sunday: true, hasDetail: true },
  { day: 2, reflection: true, hasDetail: true },
  { day: 3, reflection: true, mood: true, hasDetail: true },
  { day: 4 }, { day: 5, mood: true, hasDetail: true }, { day: 6 }, { day: 7, reflection: true, hasDetail: true },
  { day: 8, sunday: true, hasDetail: true }, { day: 9, mood: true, hasDetail: true }, { day: 10 }, { day: 11, reflection: true, mood: true, hasDetail: true }, { day: 12 }, { day: 13 }, { day: 14, reflection: true, hasDetail: true },
  { day: 15, sunday: true, reflection: true, hasDetail: true }, { day: 16 }, { day: 17, hasDetail: true }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21 },
  { day: 22, sunday: true, hasDetail: true }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 },
  { day: 29, sunday: true, hasDetail: true }, { day: 30 },
  { day: 1, muted: true }, { day: 2, muted: true }, { day: 3, muted: true }, { day: 4, muted: true }, { day: 5, muted: true },
];

export const JourneyHistoryScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'LIBRARY' | 'CALENDAR'>('CALENDAR');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [detailState, setDetailState] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');

  const detailTitle = useMemo(() => {
    if (!selectedDay) return '';
    return `SEP ${selectedDay}, 2024`;
  }, [selectedDay]);

  const openDay = (day: CalendarDay) => {
    if (day.muted) return;
    setSelectedDay(day.day);
    setDetailState('loading');

    setTimeout(() => {
      if (day.hasDetail) {
        setDetailState(day.day === 17 ? 'empty' : 'ready');
      } else {
        setDetailState('error');
      }
    }, 700);
  };

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Journey</Text>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segmentedItem, activeTab === 'LIBRARY' && styles.segmentedItemActive]}
              onPress={() => setActiveTab('LIBRARY')}
            >
              <Text style={[styles.segmentedText, activeTab === 'LIBRARY' && styles.segmentedTextActive]}>LIBRARY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentedItem, activeTab === 'CALENDAR' && styles.segmentedItemActive]}
              onPress={() => setActiveTab('CALENDAR')}
            >
              <Text style={[styles.segmentedText, activeTab === 'CALENDAR' && styles.segmentedTextActive]}>CALENDAR</Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'LIBRARY' ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.quickLinks}>
              <TouchableOpacity style={styles.quickLinkButton} onPress={() => navigation.navigate('Insights')}>
                <Text style={styles.quickLinkText}>INSIGHTS HOME</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickLinkButton}
                onPress={() => navigation.navigate('MoodDetail', { moodId: 'peaceful', date: 'Wednesday - Sept 20' })}
              >
                <Text style={styles.quickLinkText}>PAST AWARENESS</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timelineLine} />
            {JOURNEY_ITEMS.map((item) => (
              <View key={item.id} style={styles.itemContainer}>
                <View style={styles.timelineDot} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemDate}>{item.date}</Text>
                  <TouchableOpacity onPress={() => item.moodId && navigation.navigate('MoodDetail', { moodId: item.moodId, date: item.date })}>
                    <GlassCard style={styles.itemCard}>
                      <Text style={styles.itemType}>{item.type}</Text>
                      {item.icon ? (
                        <View style={styles.iconRow}>
                          <MaterialIcons name={item.icon} size={20} color={Colors.accentGold} />
                          <Text style={styles.itemText}>{item.content}</Text>
                        </View>
                      ) : (
                        <Text style={[styles.itemText, item.isItalic && styles.italicText]}>{item.content}</Text>
                      )}
                    </GlassCard>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <ScrollView contentContainerStyle={styles.calendarScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.monthHeader}>
              <TouchableOpacity style={styles.chevronButton}>
                <MaterialIcons name="chevron-left" size={20} color="rgba(229, 185, 95, 0.45)" />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>SEPTEMBER 2024</Text>
              <TouchableOpacity style={styles.chevronButton}>
                <MaterialIcons name="chevron-right" size={20} color="rgba(229, 185, 95, 0.45)" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekHeader}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                <Text key={`${d}-${idx}`} style={styles.weekDay}>{d}</Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {CALENDAR_DAYS.map((day, idx) => (
                <TouchableOpacity key={`${day.day}-${idx}`} style={styles.dayCell} onPress={() => openDay(day)} disabled={day.muted}>
                  {!day.muted && selectedDay === day.day ? <View style={styles.selectedRing} /> : null}
                  <Text style={[styles.dayNumber, day.muted && styles.mutedDayNumber, !day.muted && selectedDay === day.day && styles.selectedDayNumber]}>
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
              <View style={styles.legendItem}><View style={[styles.dot, styles.reflectionDot]} /><Text style={styles.legendText}>Reflection</Text></View>
              <Text style={styles.legendSeparator}>-</Text>
              <View style={styles.legendItem}><View style={[styles.dot, styles.moodDot]} /><Text style={styles.legendText}>Mood</Text></View>
              <Text style={styles.legendSeparator}>-</Text>
              <View style={styles.legendItem}><MaterialIcons name="auto-awesome" size={10} color={Colors.accentGold} /><Text style={styles.legendText}>Sunday</Text></View>
            </View>

            <GlassCard style={styles.emptyPromptCard}>
              <Text style={styles.emptyPromptText}>Select a day to revisit your walk.</Text>
            </GlassCard>
          </ScrollView>
        )}

        <Modal transparent visible={selectedDay !== null} animationType="fade" onRequestClose={() => setSelectedDay(null)}>
          <View style={styles.modalBackdrop}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setSelectedDay(null)} />
            <View style={styles.bottomSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View style={styles.headerSpacer} />
                <View style={styles.sheetTitleWrap}>
                  <Text style={styles.sheetDate}>{detailTitle}</Text>
                  <Text style={styles.sheetTitle}>Day Detail</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedDay(null)}>
                  <MaterialIcons name="close" size={18} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              </View>

              {detailState === 'loading' ? (
                <View style={styles.sheetBodyCentered}>
                  <ActivityIndicator size="large" color={Colors.accentGold} />
                  <Text style={styles.sheetLoadingText}>Loading day...</Text>
                </View>
              ) : null}

              {detailState === 'ready' ? (
                <View style={styles.sheetBodyReady}>
                  <TouchableOpacity style={styles.readySection} onPress={() => navigation.navigate('MoodDetail', { moodId: 'peaceful', date: detailTitle })}>
                    <View style={styles.readySectionHeader}>
                      <Text style={styles.readyLabel}>INNER POSTURE</Text>
                      <MaterialIcons name="chevron-right" size={16} color="rgba(229,185,95,0.35)" />
                    </View>
                    <View style={styles.moodPill}>
                      <Text style={styles.moodEmoji}>🌿</Text>
                      <Text style={styles.moodPillText}>Peaceful</Text>
                    </View>
                    <Text style={styles.readySubText}>A quiet morning with the Word.</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.readySection} onPress={() => navigation.navigate('ReflectionEntry', { journalVariant: 'mid_week', openMoodOnEntry: false })}>
                    <View style={styles.readySectionHeader}>
                      <Text style={styles.readyLabel}>REFLECTION</Text>
                      <MaterialIcons name="chevron-right" size={16} color="rgba(229,185,95,0.35)" />
                    </View>
                    <Text style={styles.readyReflectionText}>
                      "I felt a deep sense of stillness this morning during the scripture reading. It reminded me that abiding isn't about..."
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.readySection, styles.readySundaySection]} onPress={() => navigation.getParent()?.navigate('Home')}>
                    <View style={styles.readySectionHeader}>
                      <Text style={styles.readyLabel}>FROM SUNDAY</Text>
                      <MaterialIcons name="chevron-right" size={16} color="rgba(229,185,95,0.35)" />
                    </View>
                    <View style={styles.sundayRow}>
                      <View style={styles.sundayAccent} />
                      <Text style={styles.sundayText}>
                        Abiding in Christ <Text style={styles.sundayTextMuted}>- The Vine and the Branches</Text>
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}

              {detailState === 'empty' ? (
                <View style={styles.sheetBodyCentered}>
                  <Text style={styles.sheetEmptyText}>No entries saved for this day.</Text>
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
                    <Text style={styles.addReflectionText}>ADD A REFLECTION</Text>
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
                    <Text style={styles.logMoodText}>LOG A MOOD</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {detailState === 'error' ? (
                <View style={styles.sheetBodyCentered}>
                  <Text style={styles.sheetErrorText}>Could not load this day.</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={() => setDetailState('loading')}>
                    <Text style={styles.retryText}>RETRY</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  headerRow: { paddingTop: 44, paddingHorizontal: 24, paddingBottom: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 50, color: '#fff' },
  segmentedControl: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(229,185,95,0.15)', borderRadius: 999, padding: 2 },
  segmentedItem: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999 },
  segmentedItemActive: { backgroundColor: 'rgba(229,185,95,0.16)' },
  segmentedText: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.45)' },
  segmentedTextActive: { color: Colors.accentGold },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 150 },
  quickLinks: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  quickLinkButton: { flex: 1, borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.35)', borderRadius: 14, paddingVertical: 12, alignItems: 'center', backgroundColor: 'rgba(13, 27, 42, 0.45)' },
  quickLinkText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.8, color: Colors.accentGold },
  timelineLine: { position: 'absolute', left: 24, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(229, 185, 95, 0.2)' },
  itemContainer: { flexDirection: 'row', marginBottom: 32 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(229, 185, 95, 0.4)', borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.6)', position: 'absolute', left: -5.5, top: 16 },
  itemContent: { flex: 1, paddingLeft: 32 },
  itemDate: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 },
  itemCard: { padding: 20, backgroundColor: 'rgba(13, 27, 42, 0.6)' },
  itemType: { fontFamily: 'Cinzel_700Bold', fontSize: 9, color: Colors.accentGold, letterSpacing: 2, marginBottom: 12 },
  itemText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 17, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 26 },
  italicText: { fontStyle: 'italic' },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calendarScroll: { paddingHorizontal: 24, paddingBottom: 150 },
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
  emptyPromptCard: { borderRadius: 28, paddingVertical: 34, alignItems: 'center' },
  emptyPromptText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 15, color: 'rgba(255,255,255,0.45)' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: 'rgba(13, 27, 42, 0.94)', borderTopLeftRadius: 34, borderTopRightRadius: 34, paddingHorizontal: 24, paddingTop: 10, paddingBottom: 38, minHeight: 300, borderTopWidth: 1, borderTopColor: 'rgba(229,185,95,0.25)' },
  sheetHandle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.18)', marginBottom: 18 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  headerSpacer: { width: 32 },
  sheetTitleWrap: { alignItems: 'center' },
  sheetDate: { fontFamily: 'Cinzel_700Bold', fontSize: 18, letterSpacing: 5, color: Colors.accentGold, marginBottom: 4 },
  sheetTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 18, color: 'rgba(255,255,255,0.92)' },
  closeButton: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  sheetBodyCentered: { flex: 1, minHeight: 170, alignItems: 'center', justifyContent: 'center', gap: 12 },
  sheetLoadingText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 16, color: 'rgba(229,185,95,0.85)' },
  sheetBodyReady: { flex: 1, minHeight: 300, paddingTop: 2 },
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
  },
  logMoodText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    letterSpacing: 4,
    color: Colors.accentGold,
  },
  sheetErrorText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 17, color: '#D97B66' },
  retryButton: { borderWidth: 1, borderColor: 'rgba(229,185,95,0.4)', borderRadius: 12, paddingHorizontal: 28, paddingVertical: 11, backgroundColor: 'rgba(255,255,255,0.03)' },
  retryText: { fontFamily: 'Cinzel_700Bold', fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.82)' },
});

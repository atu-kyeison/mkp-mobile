import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../../constants/Colors';

type ViewState = 'filled' | 'empty' | 'loading' | 'error';

export const SundaySummaryDetailScreen = ({ navigation, route }: any) => {
  const routeState = route?.params?.viewState;
  const initialState: ViewState =
    routeState === 'empty' || routeState === 'loading' || routeState === 'error' || routeState === 'filled'
      ? routeState
      : 'filled';
  const [viewState, setViewState] = useState<ViewState>(initialState);

  const showFilled = viewState === 'filled';
  const showEmpty = viewState === 'empty';
  const showLoading = viewState === 'loading';
  const showError = viewState === 'error';

  const retryLoading = () => {
    setViewState('loading');
    setTimeout(() => setViewState('filled'), 800);
  };

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.stickyHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={22} color={Colors.accentGold} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SUNDAY</Text>
          <View style={styles.backSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Weekly Summary</Text>
            <Text style={styles.summaryMeta}>SEPT 17 • 15TH SUNDAY AFTER PENTECOST</Text>
          </View>

          {showFilled ? (
            <>
              <GlassCard style={styles.heroCard}>
                <Text style={styles.heroTitle}>Abiding in Christ</Text>
                <Text style={styles.heroMeta}>SUNDAY - SEPT 15</Text>
                <Text style={styles.heroSubMeta}>PASTOR ELIAS VANCE - GRACE FELLOWSHIP</Text>
              </GlassCard>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>YOUR REFLECTIONS LINKED TO THIS SUNDAY</Text>
                <View style={styles.cardStack}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ReflectionDetail', {
                        date: 'MONDAY - SEPT 16',
                        invitation: '"What stayed with you today?"',
                        mood: 'Peaceful',
                        fromSunday: true,
                        content:
                          "The message about the vine and the branches really resonated this morning during my quiet time. I am learning to trust the pruning...",
                      })
                    }
                  >
                    <GlassCard style={styles.reflectionCard}>
                      <Text style={styles.reflectionDate}>MONDAY - SEPT 16</Text>
                      <Text style={styles.reflectionPreview}>
                        The message about the vine and the branches really resonated this morning during my quiet time. I am...
                      </Text>
                    </GlassCard>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ReflectionDetail', {
                        date: 'WEDNESDAY - SEPT 18',
                        invitation: '"What stayed with you today?"',
                        mood: 'Peaceful',
                        fromSunday: true,
                        content:
                          "Found myself coming back to the idea of remaining. It's not about striving, but about positioning myself near Him...",
                      })
                    }
                  >
                    <GlassCard style={styles.reflectionCard}>
                      <Text style={styles.reflectionDate}>WEDNESDAY - SEPT 18</Text>
                      <Text style={styles.reflectionPreview}>
                        Found myself coming back to the idea of remaining. It's not about striving, but about positioning myself...
                      </Text>
                    </GlassCard>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>MOOD CHECK-INS</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MoodDetail', { moodId: 'peaceful', date: 'Sunday - Sept 15' })}>
                  <GlassCard style={styles.moodCard}>
                    <View style={styles.moodIconWrap}>
                      <MaterialIcons name="filter-vintage" size={28} color={Colors.accentGold} />
                    </View>
                    <View>
                      <Text style={styles.moodTitle}>Peaceful</Text>
                      <Text style={styles.moodSubtitle}>Logged after the morning service</Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <GlassCard style={[styles.comingSoonCard, styles.comingSoonMuted]}>
                  <Text style={styles.comingSoonText}>Saved Scriptures</Text>
                  <View style={styles.comingSoonBadge}><Text style={styles.comingSoonBadgeText}>COMING SOON</Text></View>
                </GlassCard>
                <GlassCard style={[styles.comingSoonCard, styles.comingSoonMuted]}>
                  <Text style={styles.comingSoonText}>Prayer / Testimony</Text>
                  <View style={styles.comingSoonBadge}><Text style={styles.comingSoonBadgeText}>COMING SOON</Text></View>
                </GlassCard>
              </View>
            </>
          ) : null}

          {showEmpty ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitleFaint}>REFLECTIONS</Text>
                <GlassCard style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No reflections linked to this Sunday yet.</Text>
                  <TouchableOpacity
                    style={styles.writeButton}
                    onPress={() => navigation.navigate('ReflectionEntry', { journalVariant: 'mid_week', openMoodOnEntry: false })}
                  >
                    <Text style={styles.writeButtonText}>WRITE A REFLECTION</Text>
                  </TouchableOpacity>
                </GlassCard>
              </View>

              {showLoading ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitleFaint}>CURRENT STATE</Text>
                  <GlassCard style={styles.loadingCard}>
                    <ActivityIndicator size="small" color={Colors.accentGold} />
                    <Text style={styles.loadingText}>Retrieving your Sunday anchor...</Text>
                  </GlassCard>
                </View>
              ) : null}

              {showError ? (
                <View style={styles.errorWrap}>
                  <Text style={styles.errorText}>Something didn't load. Try again.</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={retryLoading}>
                    <Text style={styles.retryText}>RETRY</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  stickyHeader: {
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(13, 27, 42, 0.4)',
  },
  backButton: { width: 28, alignItems: 'flex-start' },
  backSpacer: { width: 28 },
  headerTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 11, letterSpacing: 6, color: Colors.accentGold },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 130 },
  summaryHeader: { alignItems: 'center', marginBottom: 26 },
  summaryTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 44, lineHeight: 58, color: 'rgba(255,255,255,0.85)', marginBottom: 6 },
  summaryMeta: { fontFamily: 'Inter_400Regular', fontSize: 10, letterSpacing: 2.2, color: 'rgba(255,255,255,0.4)' },

  heroCard: { padding: 22, borderRadius: 28, marginBottom: 28 },
  heroTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 24, lineHeight: 34, color: '#fff', marginBottom: 10 },
  heroMeta: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 3, color: Colors.accentGold, marginBottom: 6 },
  heroSubMeta: { fontFamily: 'Inter_500Medium', fontSize: 10, color: 'rgba(148,163,184,0.95)', letterSpacing: 1.4 },

  section: { marginBottom: 28 },
  sectionTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.accentGold, letterSpacing: 3, marginBottom: 12 },
  sectionTitleFaint: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.32)', letterSpacing: 3, marginBottom: 12 },
  cardStack: { gap: 12 },
  reflectionCard: { padding: 18, borderRadius: 20 },
  reflectionDate: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.accentGold, letterSpacing: 2, marginBottom: 8 },
  reflectionPreview: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 14, lineHeight: 22, color: 'rgba(255,255,255,0.8)' },

  moodCard: { padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 14 },
  moodIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(229,185,95,0.25)',
    backgroundColor: 'rgba(229,185,95,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#fff', marginBottom: 2 },
  moodSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.45)' },

  comingSoonCard: { padding: 18, borderRadius: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  comingSoonMuted: { opacity: 0.42 },
  comingSoonText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  comingSoonBadge: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.09)', paddingHorizontal: 10, paddingVertical: 4 },
  comingSoonBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 9, color: 'rgba(255,255,255,0.6)' },

  emptyCard: { borderRadius: 28, padding: 22, alignItems: 'center' },
  emptyText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 18, lineHeight: 30, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginBottom: 18 },
  writeButton: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: Colors.accentGold,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 8,
  },
  writeButtonText: { fontFamily: 'Cinzel_700Bold', fontSize: 12, letterSpacing: 3, color: Colors.backgroundDark },

  loadingCard: { borderRadius: 28, padding: 26, alignItems: 'center', gap: 12 },
  loadingText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 16, color: 'rgba(229,185,95,0.85)' },

  errorWrap: { alignItems: 'center', paddingTop: 6, paddingBottom: 12 },
  errorText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 18, color: '#D97B66', marginBottom: 14 },
  retryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(229,185,95,0.32)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingVertical: 12,
    paddingHorizontal: 34,
  },
  retryText: { fontFamily: 'Cinzel_700Bold', fontSize: 12, letterSpacing: 3, color: 'rgba(255,255,255,0.78)' },
});

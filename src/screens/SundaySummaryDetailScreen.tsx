import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../../constants/Colors';

export const SundaySummaryDetailScreen = ({ navigation }: any) => {
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
          <GlassCard style={styles.heroCard}>
            <Text style={styles.heroTitle}>Abiding in Christ</Text>
            <Text style={styles.heroMeta}>SUNDAY - SEPT 15</Text>
            <Text style={styles.heroSubMeta}>PASTOR ELIAS VANCE - GRACE FELLOWSHIP</Text>
          </GlassCard>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>YOUR REFLECTIONS LINKED TO THIS SUNDAY</Text>
            <View style={styles.cardStack}>
              <TouchableOpacity onPress={() => navigation.navigate('ReflectionEntry', { journalVariant: 'early_week', openMoodOnEntry: false })}>
                <GlassCard style={styles.reflectionCard}>
                  <Text style={styles.reflectionDate}>MONDAY - SEPT 16</Text>
                  <Text style={styles.reflectionPreview}>
                    The message about the vine and the branches really resonated this morning during my quiet time. I am...
                  </Text>
                </GlassCard>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ReflectionEntry', { journalVariant: 'mid_week', openMoodOnEntry: false })}>
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
    backgroundColor: 'rgba(13, 27, 42, 0.45)',
  },
  backButton: { width: 28, alignItems: 'flex-start' },
  backSpacer: { width: 28 },
  headerTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 12, letterSpacing: 6, color: Colors.accentGold },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 130 },
  heroCard: { padding: 22, borderRadius: 28, marginBottom: 28 },
  heroTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 24, lineHeight: 34, color: '#fff', marginBottom: 10 },
  heroMeta: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 3, color: Colors.accentGold, marginBottom: 6 },
  heroSubMeta: { fontFamily: 'Inter_500Medium', fontSize: 10, color: 'rgba(148,163,184,0.95)', letterSpacing: 1.4 },
  section: { marginBottom: 28 },
  sectionTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.accentGold, letterSpacing: 3, marginBottom: 12 },
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
});

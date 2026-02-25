import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../../constants/Colors';

export const ReflectionDetailScreen = ({ navigation, route }: any) => {
  const date = route.params?.date || 'MONDAY - SEPT 18';
  const invitation = route.params?.invitation || '"What stayed with you today?"';
  const content =
    route.params?.content ||
    "I felt a deep sense of stillness this morning during the scripture reading. It reminded me that abiding isn't about doing more, but about being present. I want to carry this unhurried peace into my meetings today.";
  const mood = route.params?.mood || 'Peaceful';
  const fromSunday = route.params?.fromSunday ?? true;

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={24} color={Colors.accentGold} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>REFLECTION</Text>
          <View style={styles.backSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.metaRow}>
            <Text style={styles.dateText}>{date}</Text>
            {fromSunday ? (
              <View style={styles.sundayPill}>
                <View style={styles.sundayDot} />
                <Text style={styles.sundayPillText}>SUNDAY'S MESSAGE</Text>
              </View>
            ) : null}
          </View>

          <GlassCard style={styles.invitationCard}>
            <Text style={styles.sectionLabel}>THE INVITATION</Text>
            <Text style={styles.invitationText}>{invitation}</Text>
          </GlassCard>

          <GlassCard style={styles.wordsCard}>
            <Text style={styles.sectionLabel}>YOUR WORDS</Text>
            <Text style={styles.wordsText}>{content}</Text>
            <View style={styles.moodPill}>
              <Text style={styles.moodEmoji}>🌿</Text>
              <Text style={styles.moodText}>{mood}</Text>
            </View>
          </GlassCard>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.backToJourneyButton} onPress={() => navigation.navigate('JourneyHistory')}>
            <Text style={styles.backToJourneyText}>BACK TO JOURNEY</Text>
          </TouchableOpacity>
          <Text style={styles.privacyText}>
            This space is between you and God. Your reflections stay private.
          </Text>
        </View>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(13, 27, 42, 0.75)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backButton: { width: 30, alignItems: 'flex-start' },
  backSpacer: { width: 30 },
  headerTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 11, letterSpacing: 6, color: Colors.accentGold },
  scrollContent: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 190, gap: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  dateText: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 2.5, color: Colors.accentGold },
  sundayPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sundayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(229,185,95,0.6)' },
  sundayPillText: { fontFamily: 'Inter_400Regular', fontSize: 11, letterSpacing: 1, color: 'rgba(255,255,255,0.62)' },
  invitationCard: { padding: 20, borderRadius: 28 },
  sectionLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 3, color: Colors.accentGold, marginBottom: 12 },
  invitationText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 18, lineHeight: 30, color: 'rgba(255,255,255,0.92)' },
  wordsCard: { padding: 20, borderRadius: 28, minHeight: 250 },
  wordsText: { fontFamily: 'Inter_300Light', fontSize: 16, lineHeight: 47, color: 'rgba(255,255,255,0.82)', marginBottom: 24 },
  moodPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodEmoji: { fontSize: 22 },
  moodText: { fontFamily: 'Inter_400Regular', fontSize: 17, color: 'rgba(255,255,255,0.86)' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: 'rgba(28, 34, 48, 0.9)',
  },
  backToJourneyButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(229,185,95,0.45)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  backToJourneyText: { fontFamily: 'Cinzel_700Bold', fontSize: 13, letterSpacing: 4, color: Colors.accentGold },
  privacyText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },
});

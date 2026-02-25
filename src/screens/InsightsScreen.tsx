import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';

export const InsightsScreen = () => {
  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>INSIGHTS</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>Notice how this week has felt.</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>THIS WEEK’S RHYTHM</Text>
            <View style={styles.moodArcContainer}>
              <View style={styles.moodArc} />
            </View>
            <View style={styles.arcLabels}>
              <Text style={styles.arcLabel}>Earlier</Text>
              <Text style={styles.arcLabel}>Now</Text>
            </View>
            <Text style={styles.sectionNote}>Based on your optional check-ins</Text>
          </GlassCard>

          <GlassCard style={[styles.sectionCard, styles.centeredCard]}>
            <Text style={styles.sectionLabel}>REFLECTION PRESENCE</Text>
            <Text style={styles.statText}>
              You paused to reflect 3 days this week
            </Text>
            <View style={styles.smallDivider} />
            <Text style={styles.statSubtext}>
              Reflection was part of your week
            </Text>
          </GlassCard>

          <GlassCard style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>SOMETHING WE NOTICED</Text>
            <Text style={styles.noticeText}>
              "Weeks where you pause midweek often feel steadier."
            </Text>
          </GlassCard>

          <Text style={styles.footerText}>
            These insights are for awareness, not evaluation.
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
    overflow: 'hidden',
  },
  moodArc: {
    width: '100%',
    height: 48,
    borderRadius: 50,
    backgroundColor: 'rgba(130, 154, 177, 0.6)', // Using peaceful color as base
    // In actual implementation, this would be a gradient
    opacity: 0.6,
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
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
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

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';

export default function Sunday() {
  return (
    <GradientBackground variant="sacred" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.topLabel}>Sunday • Sept 15</Text>
            <Text style={styles.title}>Abiding in Christ</Text>
            <Text style={styles.subtitle}>The Vine and the Branches • Part 1</Text>
            <Text style={styles.scriptureRef}>John 15:1-8</Text>
            <Text style={styles.pastorInfo}>Pastor Elias Vance • Grace Fellowship</Text>

            <TouchableOpacity style={styles.listenLink}>
              <Text style={styles.listenLinkText}>🔊 Listen to This Week’s Message</Text>
            </TouchableOpacity>

            <GlassCard style={styles.recapCard}>
              <Text style={styles.recapLabel}>Sunday Recap</Text>
              <Text style={styles.recapText}>
                "A serene reflection on abiding in the vine, emphasizing the sacred connection between the branch and the source. We are not called to produce, but to remain."
              </Text>
            </GlassCard>
          </View>

          <View style={styles.truthsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.glowLine} />
              <Text style={styles.sectionTitle}>Key Truths</Text>
              <View style={styles.glowLine} />
            </View>

            <View style={styles.truthsGrid}>
              <GlassCard style={styles.truthItem}>
                <View style={styles.truthDot} />
                <Text style={styles.truthText}>I am a branch, designed for dependence upon the True Vine.</Text>
              </GlassCard>
              <GlassCard style={styles.truthItem}>
                <View style={styles.truthDot} />
                <Text style={styles.truthText}>Pruning is not punishment; it is the invitation to fruitfulness.</Text>
              </GlassCard>
              <GlassCard style={styles.truthFull}>
                <View style={styles.truthDot} />
                <Text style={styles.truthText}>Apart from Him, my efforts are dry; in Him, my joy is made complete.</Text>
              </GlassCard>
            </View>
          </View>

          <View style={styles.scriptureSection}>
            <GlassCard style={styles.scriptureOuter}>
              <Text style={styles.scriptureSectionLabel}>Scripture</Text>
              <View style={styles.scriptureGrid}>
                <View style={styles.scriptureItem}>
                  <Text style={styles.bookIcon}>📖</Text>
                  <Text style={styles.scriptureQuote}>"Abide in me, and I in you. As the branch cannot bear fruit by itself..."</Text>
                  <Text style={styles.scriptureReference}>John 15:4</Text>
                </View>
                <View style={styles.scriptureItem}>
                  <Text style={styles.bookIcon}>📖</Text>
                  <Text style={styles.scriptureQuote}>"He is like a tree planted by streams of water that yields its fruit..."</Text>
                  <Text style={styles.scriptureReference}>Psalm 1:2-3</Text>
                </View>
              </View>
            </GlassCard>
          </View>

          <GlassCard style={styles.identitySection}>
            <View style={styles.glowDivider} />
            <Text style={styles.identityLabel}>Rest & Identity</Text>
            <Text style={styles.identityMainText}>
              May you find rest tonight knowing your identity is secure in the Beloved. You are held, you are known, and you are cherished.
            </Text>
            <View style={styles.glowDivider} />
          </GlassCard>

          <View style={styles.footer}>
            <Text style={styles.footerLabel}>Formation begins tomorrow.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 140,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  topLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 30,
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.subtleSlate,
    letterSpacing: 1,
    marginBottom: 4,
  },
  scriptureRef: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.accentGold,
    marginBottom: 4,
  },
  pastorInfo: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: 'rgba(148, 163, 184, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
  },
  listenLink: {
    marginBottom: 20,
  },
  listenLinkText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
  },
  recapCard: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  recapLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: Colors.accentGold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  recapText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  truthsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  glowLine: {
    height: 1,
    width: 24,
    backgroundColor: 'rgba(229, 185, 95, 0.3)',
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  truthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  truthItem: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    minHeight: 100,
  },
  truthFull: {
    width: '100%',
    padding: 16,
  },
  truthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentGold,
    marginBottom: 12,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  truthText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
  },
  scriptureSection: {
    marginBottom: 32,
  },
  scriptureOuter: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scriptureSectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
  },
  scriptureGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  scriptureItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  bookIcon: {
    fontSize: 18,
    color: Colors.accentGold,
    marginBottom: 8,
  },
  scriptureQuote: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 8,
  },
  scriptureReference: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: 'rgba(229, 185, 95, 0.5)',
    textTransform: 'uppercase',
  },
  identitySection: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  glowDivider: {
    height: 1,
    width: 96,
    backgroundColor: 'rgba(229, 185, 95, 0.3)',
    marginVertical: 24,
  },
  identityLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: 'rgba(229, 185, 95, 0.8)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  identityMainText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: Colors.accentGold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

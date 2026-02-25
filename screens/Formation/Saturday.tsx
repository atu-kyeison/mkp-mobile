import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';

export default function Saturday({ navigation }: any) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const allowScroll = height < 820;

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]} showsVerticalScrollIndicator={false} scrollEnabled={allowScroll}>
          <View style={styles.header}>
            <Text style={styles.topLabel}>TODAY'S FOCUS</Text>
            <View style={styles.divider} />
            <Text style={styles.italicLabel}>rest</Text>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.date}>Saturday • Sept 23</Text>
          </View>

          <GlassCard withGlow style={styles.mainCard}>
            <Text style={styles.cardLabel}>TODAY’S POSTURE</Text>
            <Text style={styles.mainText}>
              Nothing needs to be accomplished today. Rest is not a break from formation — it is part of it.
            </Text>
            <CustomButton
              title="BE STILL"
              onPress={() =>
                navigation.navigate('Journey', {
                  screen: 'ReflectionEntry',
                  params: { journalVariant: 'mid_week', openMoodOnEntry: true },
                })
              }
            />
          </GlassCard>

          <View style={styles.separator} />

          <GlassCard style={styles.prayerCard}>
            <View style={styles.prayerHeader}>
              <View style={styles.stars}>
                <View style={styles.starRow}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.star}>★</Text>
                </View>
                <Text style={styles.star}>★</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.cardLabel}>PRAYER</Text>
                <Text style={styles.prayerText}>
                  “God, help me release the need to manage everything. Teach me to trust You with what I cannot finish.”
                </Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.identityCard}>
            <Text style={styles.cardLabel}>IDENTITY</Text>
            <Text style={styles.identityText}>
              You are held, not measured. You are loved, not evaluated.
            </Text>
          </GlassCard>
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
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  topLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.3)',
    marginBottom: 8,
  },
  italicLabel: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: Colors.accentGold,
    letterSpacing: 1,
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
  },
  mainCard: {
    padding: 24,
    marginBottom: 16,
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: 'rgba(229, 185, 95, 0.7)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  mainText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 26,
    marginBottom: 32,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(229, 185, 95, 0.15)',
    marginVertical: 16,
    paddingHorizontal: 40,
  },
  prayerCard: {
    padding: 20,
    marginBottom: 16,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stars: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    color: Colors.accentGold,
    fontSize: 10,
  },
  flex1: {
    flex: 1,
  },
  prayerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  identityCard: {
    padding: 20,
  },
  identityText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
});

import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { getTimeAwareFormationGreeting, getTodayFormationDateLabel } from './dateUtils';
import { getFormationDayContent } from './formationContent';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function Saturday({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { locale } = useI18n();
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';
  const dateLabel = getTodayFormationDateLabel(localeTag);
  const greeting = getTimeAwareFormationGreeting(localeTag);
  const content = getFormationDayContent('saturday', locale);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 112 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.topLabel}>{content.topLabel}</Text>
            <View style={styles.divider} />
            <Text style={styles.italicLabel}>{content.focusTagline}</Text>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.date}>{dateLabel}</Text>
          </View>

          <GlassCard withGlow style={styles.mainCard}>
            <Text style={styles.cardLabel}>{content.practiceLabel}</Text>
            <Text style={styles.mainText}>{content.practiceText}</Text>
            <CustomButton
              title={content.practiceButton}
              onPress={() =>
                navigation.navigate('Journey', {
                  screen: 'ReflectionEntry',
                  params: { journalVariant: content.practiceVariant, openMoodOnEntry: true },
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
                <Text style={styles.cardLabel}>{content.prayerLabel}</Text>
                <Text style={styles.prayerText}>
                  {content.prayerText}
                </Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.identityCard}>
            <Text style={styles.cardLabel}>{content.identityLabel}</Text>
            <Text style={styles.identityText}>{content.identityText}</Text>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const createStyles = () => StyleSheet.create({
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
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 19,
    color: Colors.text,
    lineHeight: 30,
    marginBottom: 32,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(229, 185, 95, 0.15)',
    marginVertical: 8,
    alignSelf: 'center',
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

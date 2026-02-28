import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { openChurchMessage, openScriptureReference, speakWithTTS } from '../../constants/Actions';
import { getTimeAwareFormationGreeting, getTodayFormationDateLabel } from './dateUtils';
import { getFormationDayContent, getPrimaryScripture } from './formationContent';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function Thursday({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { locale } = useI18n();
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';
  const dateLabel = getTodayFormationDateLabel(localeTag);
  const greeting = getTimeAwareFormationGreeting(localeTag);
  const content = getFormationDayContent('thursday', locale);
  const scripture = getPrimaryScripture(content);

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

          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.flex1}>
                <Text style={styles.cardLabel}>{scripture?.label || content.scriptureLabel}</Text>
                <Text style={styles.scriptureText}>{scripture?.text || content.scriptureText}</Text>
                <TouchableOpacity onPress={() => openScriptureReference(scripture?.reference || '')}>
                  <Text style={styles.reference}>{scripture?.reference}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => speakWithTTS(scripture?.speech || '')}
              >
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.flex1}>
                <Text style={styles.cardLabel}>{content.sundayMessageLabel}</Text>
                <Text style={styles.messageText}>{content.sundayMessageText}</Text>
              </View>
              <TouchableOpacity
                style={styles.listenButton}
                onPress={() => openChurchMessage()}
              >
                <Text style={styles.listenIcon}>🎧</Text>
                <Text style={styles.listenText}>{content.listenLabel}</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          <GlassCard withGlow style={styles.practiceCard}>
            <Text style={styles.cardLabel}>{content.practiceLabel}</Text>
            <Text style={styles.practiceText}>{content.practiceText}</Text>
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
              <View style={styles.prayerIconContainer}>
                <Text style={styles.prayerIcon}>✨</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.cardLabel}>{content.prayerLabel}</Text>
                <Text style={styles.prayerText}>{content.prayerText}</Text>
              </View>
            </View>
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
    fontSize: 13,
    color: Colors.accentGold,
    letterSpacing: 1,
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
  },
  card: {
    marginBottom: 16,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flex1: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: 'rgba(229, 185, 95, 0.7)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  scriptureText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 28,
  },
  reference: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.accentGold,
    letterSpacing: 0.8,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.accentGold,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: Colors.accentGold,
    fontSize: 14,
    marginLeft: 2,
  },
  messageText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.1)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  listenIcon: {
    fontSize: 12,
    marginRight: 6,
    opacity: 0.6,
  },
  listenText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    textTransform: 'uppercase',
  },
  practiceCard: {
    padding: 24,
    marginBottom: 16,
  },
  practiceText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 19,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 28,
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
    marginTop: 8,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  prayerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(229, 185, 95, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  prayerIcon: {
    fontSize: 16,
    color: 'rgba(229, 185, 95, 0.6)',
  },
  prayerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';

const MOODS = [
  { id: 'peaceful', label: 'Peaceful', icon: 'self-improvement' as const },
  { id: 'rushed', label: 'Rushed', icon: 'bolt' as const },
  { id: 'anxious', label: 'Anxious', icon: 'waves' as const },
  { id: 'grateful', label: 'Grateful', icon: 'favorite' as const },
  { id: 'tired', label: 'Tired', icon: 'bedtime' as const },
  { id: 'focused', label: 'Focused', icon: 'track-changes' as const },
];

export const MoodCheckInScreen = ({ navigation, route }: any) => {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const journalVariant = route.params?.journalVariant;
  const nextScreen = route.params?.nextScreen;
  const nextParams = route.params?.nextParams || {};

  const handleContinue = () => {
    if (!selectedMood) {
      return;
    }

    if (nextScreen) {
      navigation.navigate(nextScreen, { ...nextParams, mood: selectedMood });
      return;
    }

    navigation.navigate('ReflectionEntry', {
      mood: selectedMood,
      journalVariant,
      openMoodOnEntry: false,
    });
  };

  return (
    <BackgroundGradient style={styles.container} variant="simple">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate('JourneyHistory')}
          >
            <Text style={styles.skipText}>{t('mood.skip')}</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.subtitle}>{t('mood.subtitle')}</Text>
            <View style={styles.divider} />
            <Text style={styles.title}>{t('mood.title')}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.moodGrid} showsVerticalScrollIndicator={false}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={styles.moodCardContainer}
              onPress={() => setSelectedMood(mood.id)}
            >
              <GlassCard
                style={selectedMood === mood.id ? [styles.moodCard, styles.selectedCard] : styles.moodCard}
              >
                <MaterialIcons
                  name={mood.icon}
                  size={32}
                  color={Colors.accentGold}
                  style={styles.moodIcon}
                />
                <Text style={styles.moodLabel}>{t(`mood.label.${mood.id}`)}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: 32 + insets.bottom }]}>
          <TouchableOpacity
            style={[styles.continueButton, !selectedMood && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!selectedMood}
          >
            <Text style={styles.continueText}>{t('mood.continue')}</Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>{t('mood.note')}</Text>
          <TouchableOpacity
            style={styles.supportLink}
            onPress={() =>
              navigation.getParent()?.navigate('Church', {
                screen: 'CareSupportRequest',
                params: { initialHelpType: "I'm going through something difficult" },
              })
            }
          >
            <Text style={styles.supportLinkText}>{t('mood.needMore')}</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  skipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 2,
  },
  headerContent: {
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 3,
    marginBottom: 8,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 32,
  },
  moodGrid: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  moodCardContainer: {
    width: '45%',
    aspectRatio: 1,
    margin: '2.5%',
  },
  moodCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 28,
  },
  selectedCard: {
    backgroundColor: 'rgba(229, 185, 95, 0.15)',
    borderColor: 'rgba(229, 185, 95, 0.6)',
  },
  moodIcon: {
    opacity: 0.9,
  },
  moodLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footer: {
    paddingTop: 12,
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.accentGold,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: Colors.backgroundDark,
    letterSpacing: 2.5,
  },
  footerNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: 1.5,
    marginTop: 32,
    textTransform: 'uppercase',
  },
  supportLink: {
    marginTop: 12,
  },
  supportLinkText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.accentGold,
    textDecorationLine: 'underline',
  },
});

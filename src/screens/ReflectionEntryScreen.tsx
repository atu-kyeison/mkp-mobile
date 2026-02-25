import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';

export const ReflectionEntryScreen = ({ navigation, route }: any) => {
  const { t } = useI18n();
  const [reflection, setReflection] = useState('');
  const journalVariant = route.params?.journalVariant === 'mid_week' ? 'mid_week' : 'early_week';
  const mood = route.params?.mood;
  const openMoodCheckIn = (nextScreen = 'JourneyHistory', nextParams: Record<string, unknown> = {}) => {
    navigation.navigate('MoodCheckIn', {
      journalVariant,
      nextScreen,
      nextParams,
    });
  };

  const content = useMemo(() => {
    if (journalVariant === 'mid_week') {
      return {
        subtitle: t('reflection.subtitle.midweek'),
        invitationLabel: t('reflection.invitation.midweekLabel'),
        invitationText: t('reflection.invitation.midweekText'),
      };
    }

    return {
      subtitle: t('reflection.subtitle.today'),
      invitationLabel: t('reflection.invitation.dailyLabel'),
      invitationText: t('reflection.invitation.dailyText'),
    };
  }, [journalVariant, t]);

  const handleSave = () => {
    openMoodCheckIn('JourneyHistory');
  };

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text style={styles.subtitle}>{content.subtitle}</Text>
            <View style={styles.divider} />
            <Text style={styles.greeting}>Good morning.</Text>
            <Text style={styles.date}>Monday • Sept 18</Text>
          </View>

          <View style={styles.content}>
            <GlassCard style={styles.invitationCard}>
              <Text style={styles.invitationLabel}>{content.invitationLabel}</Text>
              <Text style={styles.invitationText}>{content.invitationText}</Text>
            </GlassCard>

            <TextInput
              style={styles.input}
              placeholder={t('reflection.placeholder')}
              placeholderTextColor="rgba(148, 163, 184, 0.6)"
              multiline
              value={reflection}
              onChangeText={setReflection}
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>{t('reflection.save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.supportLink}
              onPress={() =>
                navigation.getParent()?.navigate('Church', {
                  screen: 'CareSupportRequest',
                  params: { initialHelpType: "I'm going through something difficult" },
                })
              }
            >
              <Text style={styles.supportLinkText}>{t('reflection.needMore')}</Text>
            </TouchableOpacity>
            <Text style={styles.privacyNote}>
              {t('reflection.privacy')}
            </Text>
            {mood ? (
              <Text style={styles.moodTag}>{t('reflection.moodCurrent')} {String(mood).toUpperCase()}</Text>
            ) : null}
            <Text style={styles.quote}>
              {t('reflection.quote')}
            </Text>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  subtitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 3,
    marginBottom: 8,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.3)',
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    letterSpacing: 1,
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  invitationCard: {
    padding: 24,
    marginBottom: 32,
    borderColor: 'rgba(229, 185, 95, 0.2)',
  },
  invitationLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 2,
    marginBottom: 16,
  },
  invitationText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    color: '#FFFFFF',
    fontStyle: 'italic',
    lineHeight: 28,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlignVertical: 'top',
    padding: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Space for navigation bar
    alignItems: 'center',
  },
  saveButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.accentGold,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: '#1C2230',
    letterSpacing: 2.5,
  },
  supportLink: {
    marginBottom: 12,
  },
  supportLinkText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.accentGold,
    textDecorationLine: 'underline',
  },
  privacyNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.2)',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  moodTag: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: 'rgba(229, 185, 95, 0.7)',
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  quote: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

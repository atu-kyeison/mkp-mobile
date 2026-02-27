import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { Colors } from '../../constants/Colors';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

const HELP_TYPES = [
  'A conversation with a pastor',
  'Discipleship / next steps',
  'Accountability support',
  'Baptism request',
  'Baby dedication request',
  "I'm going through something difficult",
  'I recently gave my life to Christ',
  'Other',
] as const;

const CONTACT_METHODS = ['InApp', 'Email'] as const;

export default function CareSupportRequest({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  const preselectedType = route?.params?.initialHelpType as (typeof HELP_TYPES)[number] | undefined;
  const [helpType, setHelpType] =
    useState<(typeof HELP_TYPES)[number]>(preselectedType && HELP_TYPES.includes(preselectedType) ? preselectedType : HELP_TYPES[0]);
  const [contactMethod, setContactMethod] =
    useState<(typeof CONTACT_METHODS)[number]>('InApp');
  const [message, setMessage] = useState('');
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'error'>('idle');

  const completeSendAttempt = () => {
    if (!message.trim()) {
      setSubmitState('idle');
      Alert.alert(t('care.support.validation.title'), t('care.support.validation.messageRequired'));
      return;
    }
    setSubmitState('idle');
    navigation.navigate('CareEscalationSuccess', {
      requestType: helpType,
      careCategory: helpType === 'I recently gave my life to Christ' ? 'new_believer' : 'general',
      contactMethod,
      followUpChannel: contactMethod === 'Email' ? 'auth_email' : 'in_app',
      notes: message,
    });
  };

  const handleSubmit = () => {
    setSubmitState('sending');

    // Until backend wiring is in place, emulate network behavior while keeping states exclusive.
    setTimeout(completeSendAttempt, 900);
  };

  const handleBack = () => {
    navigation.navigate('CareHome');
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialIcons name="chevron-left" size={26} color={Colors.accentGold} />
          </TouchableOpacity>
          <Text style={styles.headerLabel}>{t('care.header')}</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>{t('care.support.title')}</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {submitState === 'idle' ? (
            <GlassCard withGlow style={styles.card}>
              <Text style={styles.sectionLabel}>{t('care.support.section.type')}</Text>
              <View style={styles.chipsRow}>
                {HELP_TYPES.map((option) => {
                  const selected = option === helpType;
                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setHelpType(option)}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {
                          option === 'A conversation with a pastor' ? t('care.support.type.pastor') :
                          option === 'Discipleship / next steps' ? t('care.support.type.discipleship') :
                          option === 'Accountability support' ? t('care.support.type.accountability') :
                          option === 'Baptism request' ? t('care.support.type.baptism') :
                          option === 'Baby dedication request' ? t('care.support.type.dedication') :
                          option === "I'm going through something difficult" ? t('care.support.type.difficult') :
                          option === 'I recently gave my life to Christ' ? t('care.support.type.newBeliever') :
                          t('care.support.type.other')
                        }
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {helpType === "I'm going through something difficult" ? (
                <Text style={styles.crisisNote}>
                  {t('care.support.crisis')}
                </Text>
              ) : null}

              <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
                {t('care.support.section.message')}
              </Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={5}
                value={message}
                onChangeText={setMessage}
                placeholder={t('care.support.placeholder')}
                placeholderTextColor="rgba(255, 255, 255, 0.35)"
              />

              <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
                {t('care.support.section.contact')}
              </Text>
              <View style={styles.contactRow}>
                {CONTACT_METHODS.map((method) => {
                  const selected = method === contactMethod;
                  return (
                    <TouchableOpacity
                      key={method}
                      onPress={() => setContactMethod(method)}
                      style={[styles.contactChip, selected && styles.contactChipSelected]}
                    >
                      <Text
                        style={[
                          styles.contactChipText,
                          selected && styles.contactChipTextSelected,
                        ]}
                      >
                        {
                          method === 'InApp' ? t('care.support.contact.inapp') :
                          t('care.support.contact.email')
                        }
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.contactHelpText}>{t('care.support.contactNote')}</Text>

              <View style={styles.buttonContainer}>
                <CustomButton title={t('care.support.send')} onPress={handleSubmit} />
              </View>
            </GlassCard>
          ) : (
            <GlassCard withGlow style={styles.submitStateCard}>
              {submitState === 'sending' ? (
                <>
                  <ActivityIndicator color={Colors.accentGold} size="large" style={styles.stateIcon} />
                  <Text style={styles.stateTitle}>{t('care.support.sending')}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.errorIcon}>!</Text>
                  <Text style={styles.stateErrorTitle}>{t('care.support.error')}</Text>
                  <View style={styles.stateButtons}>
                    <CustomButton title={t('care.support.retry')} onPress={handleSubmit} style={styles.stateButton} />
                    <CustomButton
                      title={t('care.support.saveLocal')}
                      variant="outline"
                      onPress={() => {
                        setSubmitState('idle');
                        Alert.alert(t('care.support.saved.title'), t('care.support.saved.body'));
                      }}
                      style={styles.stateButton}
                    />
                  </View>
                </>
              )}
            </GlassCard>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const createStyles = () => StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  backButton: {
    position: 'absolute',
    left: 8,
    top: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.2)',
  },
  headerLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 4,
    marginBottom: 3,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 21,
    lineHeight: 28,
    textAlign: 'center',
    color: Colors.text,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: 'rgba(229, 185, 95, 0.7)',
    letterSpacing: 2,
    marginBottom: 12,
  },
  sectionSpacing: {
    marginTop: 16,
  },
  chipsRow: {
    gap: 10,
  },
  chip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  chipSelected: {
    borderColor: Colors.accentGold,
    backgroundColor: 'rgba(229, 185, 95, 0.15)',
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chipTextSelected: {
    color: Colors.accentGold,
  },
  crisisNote: {
    marginTop: 10,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  textInput: {
    minHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    textAlignVertical: 'top',
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.text,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  contactChip: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.25)',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  contactChipSelected: {
    borderColor: Colors.accentGold,
    backgroundColor: 'rgba(229, 185, 95, 0.15)',
  },
  contactChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  contactChipTextSelected: {
    color: Colors.accentGold,
  },
  contactHelpText: {
    marginTop: 10,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 0.55)',
  },
  buttonContainer: {
    marginTop: 22,
  },
  submitStateCard: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  stateIcon: {
    marginBottom: 14,
  },
  errorIcon: {
    fontFamily: 'Inter_700Bold',
    fontSize: 34,
    color: '#D4A373',
    marginBottom: 10,
  },
  stateTitle: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 30,
    color: Colors.accentGold,
    textAlign: 'center',
  },
  stateErrorTitle: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 29,
    lineHeight: 42,
    color: '#D4A373',
    textAlign: 'center',
    marginBottom: 16,
  },
  stateButtons: {
    width: '100%',
    gap: 10,
  },
  stateButton: {
    width: '100%',
  },
});

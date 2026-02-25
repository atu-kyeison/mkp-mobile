import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { Colors } from '../../constants/Colors';
import { useI18n } from '../../src/i18n/I18nProvider';

const HELP_TYPES = [
  'A conversation with a pastor',
  'Discipleship / next steps',
  'Accountability support',
  'Prayer in person or by call',
  "I'm going through something difficult",
  'I recently gave my life to Christ',
  'Other',
] as const;

const CONTACT_METHODS = ['Call', 'Text', 'Email'] as const;

export default function CareSupportRequest({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const preselectedType = route?.params?.initialHelpType as (typeof HELP_TYPES)[number] | undefined;
  const [helpType, setHelpType] =
    useState<(typeof HELP_TYPES)[number]>(preselectedType && HELP_TYPES.includes(preselectedType) ? preselectedType : HELP_TYPES[0]);
  const [contactMethod, setContactMethod] =
    useState<(typeof CONTACT_METHODS)[number]>('Text');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    navigation.navigate('CareEscalationSuccess', {
      requestType: helpType,
      careCategory: helpType === 'I recently gave my life to Christ' ? 'new_believer' : 'general',
      contactMethod,
      notes: message,
    });
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.divider} />
            <Text style={styles.title}>{t('care.support.title')}</Text>
          </View>

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
                        option === 'Prayer in person or by call' ? t('care.support.type.prayer') :
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
                        method === 'Call' ? t('care.support.contact.call') :
                        method === 'Text' ? t('care.support.contact.text') :
                        t('care.support.contact.email')
                      }
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton title={t('care.support.send')} onPress={handleSubmit} />
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 22,
    lineHeight: 32,
    textAlign: 'center',
    color: Colors.text,
  },
  card: {
    padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: 'rgba(229, 185, 95, 0.7)',
    letterSpacing: 2,
    marginBottom: 12,
  },
  sectionSpacing: {
    marginTop: 20,
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
  buttonContainer: {
    marginTop: 22,
  },
});

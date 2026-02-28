import React, { useMemo, useState } from 'react';
import { Settings } from 'react-native';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useI18n } from '../../i18n/I18nProvider';
import { ThemeId, useTheme } from '../../theme/ThemeProvider';

const SettingsScreen = ({ navigation, route }: any) => {
  const { locale, setLocale, t } = useI18n();
  const { themeId, setThemeId, themeOptions } = useTheme();
  const insets = useSafeAreaInsets();

  const [reminders, setReminders] = useState(true);
  const [churchMessages, setChurchMessages] = useState(true);
  const [encouragement, setEncouragement] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [connectedChurchName, setConnectedChurchName] = useState(
    () =>
      route?.params?.churchName ||
      (Settings.get('mkp.connectedChurchName') as string | undefined) ||
      t('settings.account.connectedChurchUnknown')
  );
  const hasMultipleThemes = themeOptions.length > 1;

  const activeThemeLabel = useMemo(
    () => t(themeOptions.find((option) => option.id === themeId)?.labelKey || 'settings.theme.midnight'),
    [themeId, themeOptions, t]
  );
  useFocusEffect(
    React.useCallback(() => {
      const savedChurchName = Settings.get('mkp.connectedChurchName') as string | undefined;
      setConnectedChurchName(savedChurchName || route?.params?.churchName || t('settings.account.connectedChurchUnknown'));
    }, [route?.params?.churchName, t])
  );

  const applyTheme = (nextTheme: ThemeId) => {
    setThemeId(nextTheme);
    setThemeOpen(false);
  };

  const switchTrackColor = useMemo(
    () => ({
      false: 'rgba(255, 255, 255, 0.16)',
      true: 'rgba(229, 185, 95, 0.42)',
    }),
    []
  );

  const switchThumbColor = (enabled: boolean) => (enabled ? Colors.antiqueGold : 'rgba(255, 255, 255, 0.9)');

  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerLabel}>{t('settings.header')}</Text>
            <View style={styles.headerDivider} />
            <Text style={styles.title}>{t('settings.title')}</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 104 + insets.bottom }]}
            showsVerticalScrollIndicator={false}
          >
            <Section title={t('settings.section.language')}>
              <GlassCard style={styles.settingCard}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{t('settings.language.label')}</Text>
                  <View style={styles.languageRow}>
                    <TouchableOpacity
                      style={[styles.languageChip, locale === 'en' && styles.languageChipActive]}
                      onPress={() => setLocale('en')}
                    >
                      <Text style={[styles.languageChipText, locale === 'en' && styles.languageChipTextActive]}>
                        {t('settings.language.en')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.languageChip, locale === 'es' && styles.languageChipActive]}
                      onPress={() => setLocale('es')}
                    >
                      <Text style={[styles.languageChipText, locale === 'es' && styles.languageChipTextActive]}>
                        {t('settings.language.es')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
            </Section>

            <Section title={t('settings.section.theme')}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => hasMultipleThemes && setThemeOpen((prev) => !prev)}
                activeOpacity={hasMultipleThemes ? 0.7 : 1}
              >
                <GlassCard style={styles.settingCard}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{t('settings.theme.label')}</Text>
                    <Text style={styles.settingValue}>{activeThemeLabel}</Text>
                  </View>
                  {hasMultipleThemes ? (
                    <MaterialIcons
                      name={themeOpen ? 'expand-less' : 'expand-more'}
                      size={24}
                      color={Colors.antiqueGold}
                    />
                  ) : null}
                </GlassCard>
              </TouchableOpacity>

              {themeOpen && hasMultipleThemes ? (
                <GlassCard style={styles.themeDropdown}>
                  {themeOptions.map((option) => {
                    const active = option.id === themeId;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[styles.themeOptionRow, active && styles.themeOptionRowActive]}
                        onPress={() => applyTheme(option.id)}
                      >
                        <Text style={[styles.themeOptionText, active && styles.themeOptionTextActive]}>
                          {t(option.labelKey)}
                        </Text>
                        {active ? <MaterialIcons name="check" size={18} color={Colors.antiqueGold} /> : null}
                      </TouchableOpacity>
                    );
                  })}
                </GlassCard>
              ) : null}
            </Section>

            <Section title={t('settings.section.formation')}>
              <GlassCard style={styles.settingCard}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingValue}>{t('settings.formation.reminders')}</Text>
                  <Text style={styles.settingHint}>{t('settings.formation.remindersHint')}</Text>
                </View>
                <Switch
                  value={reminders}
                  onValueChange={setReminders}
                  trackColor={switchTrackColor}
                  thumbColor={switchThumbColor(reminders)}
                  ios_backgroundColor="rgba(255, 255, 255, 0.16)"
                  style={styles.switchControl}
                />
              </GlassCard>
              <Text style={styles.sectionInfo}>{t('settings.formation.privacyInfo')}</Text>
            </Section>

            <Section title={t('settings.section.care')}>
              <GlassCard style={styles.settingCard}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingValue}>{t('settings.care.churchMessages')}</Text>
                  <Text style={styles.settingHint}>{t('settings.care.churchMessagesHint')}</Text>
                </View>
                <Switch
                  value={churchMessages}
                  onValueChange={setChurchMessages}
                  trackColor={switchTrackColor}
                  thumbColor={switchThumbColor(churchMessages)}
                  ios_backgroundColor="rgba(255, 255, 255, 0.16)"
                  style={styles.switchControl}
                />
              </GlassCard>
              <GlassCard style={styles.settingCard}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingValue}>{t('settings.care.encouragement')}</Text>
                  <Text style={styles.settingHint}>{t('settings.care.encouragementHint')}</Text>
                </View>
                <Switch
                  value={encouragement}
                  onValueChange={setEncouragement}
                  trackColor={switchTrackColor}
                  thumbColor={switchThumbColor(encouragement)}
                  ios_backgroundColor="rgba(255, 255, 255, 0.16)"
                  style={styles.switchControl}
                />
              </GlassCard>
            </Section>

            <Section title={t('settings.section.help')}>
              <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
                <GlassCard style={styles.settingCard}>
                  <Text style={styles.settingValue}>{t('settings.help.faq')}</Text>
                  <MaterialIcons name="chevron-right" size={24} color={Colors.antiqueGold} />
                </GlassCard>
              </TouchableOpacity>
            </Section>

            <Section title={t('settings.section.account')}>
              <GlassCard style={[styles.settingCard, styles.accountCard]}>
                <Text style={[styles.settingLabel, styles.accountLabel]}>{t('settings.account.connectedChurch')}</Text>
                <Text style={styles.accountChurchName}>{connectedChurchName}</Text>
                <TouchableOpacity
                  style={styles.changeChurchButton}
                  onPress={() => navigation.getParent()?.getParent()?.navigate('Auth', { screen: 'ChurchSearch' })}
                >
                  <Text style={styles.changeText}>{t('settings.account.changeChurch')}</Text>
                </TouchableOpacity>
              </GlassCard>

              <View style={styles.signOutContainer}>
                <View style={styles.signOutDivider} />
                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={() => navigation.getParent()?.getParent()?.navigate('Auth', { screen: 'Welcome' })}
                >
                  <View style={styles.signOutCard}>
                    <Text style={styles.signOutText}>{t('settings.account.signOut')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Section>
          </ScrollView>
        </View>
      </SafeAreaView>
    </MidnightBackground>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionHeader}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 32, marginBottom: 24 },
  headerLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.antiqueGold, letterSpacing: 4, marginBottom: 12 },
  headerDivider: { width: 48, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.4)', marginBottom: 32 },
  title: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 24, color: 'white', textAlign: 'center', lineHeight: 32 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },
  section: { marginBottom: 32, gap: 16 },
  sectionHeader: { fontFamily: 'Inter_700Bold', fontSize: 9, color: 'rgba(229, 185, 95, 0.6)', letterSpacing: 3, paddingHorizontal: 8 },
  settingCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 20 },
  accountCard: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 18,
  },
  accountLabel: {
    marginBottom: 8,
    textAlign: 'center',
  },
  accountChurchName: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 18,
    lineHeight: 26,
    color: 'white',
    marginBottom: 10,
    width: '100%',
    textAlign: 'center',
  },
  settingRow: { width: '100%' },
  settingInfo: { flex: 1, marginRight: 12 },
  settingLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
  settingValue: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 17, lineHeight: 24, color: 'white', flexShrink: 1 },
  settingHint: { fontFamily: 'Inter_300Light', fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', marginTop: 4 },
  switchControl: {
    transform: [{ scaleX: 0.92 }, { scaleY: 0.92 }],
  },
  changeChurchButton: { alignSelf: 'center', paddingTop: 2 },
  changeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.antiqueGold,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  languageRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  languageChip: { borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.25)', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12 },
  languageChipActive: { backgroundColor: 'rgba(229, 185, 95, 0.2)', borderColor: 'rgba(229, 185, 95, 0.6)' },
  languageChipText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  languageChipTextActive: { color: Colors.antiqueGold },
  themeDropdown: { borderRadius: 16, paddingVertical: 8, paddingHorizontal: 12 },
  themeOptionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 10 },
  themeOptionRowActive: { backgroundColor: 'rgba(229, 185, 95, 0.12)' },
  themeOptionText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: 'rgba(255,255,255,0.86)' },
  themeOptionTextActive: { color: Colors.antiqueGold },
  sectionInfo: { fontFamily: 'Inter_300Light', fontStyle: 'italic', fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', paddingHorizontal: 16, lineHeight: 18 },
  signOutContainer: { alignItems: 'center', marginTop: 32 },
  signOutDivider: { width: 64, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.3)', marginBottom: 40 },
  signOutButton: { alignSelf: 'center' },
  signOutCard: {
    alignSelf: 'center',
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.26)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  signOutText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, color: 'rgba(255, 255, 255, 0.6)', letterSpacing: 2, textDecorationLine: 'underline' },
});

export default SettingsScreen;

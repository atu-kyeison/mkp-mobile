import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, View, Text, ScrollView, TextInput, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function PrayerSubmission({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  const [anonymous, setAnonymous] = useState(false);
  const [pastoralSupport, setPastoralSupport] = useState(false);
  const [request, setRequest] = useState('');

  const handleSharePrayer = () => {
    Alert.alert(
      t('care.prayer.alert.title'),
      t('care.prayer.alert.body'),
      [
        { text: t('care.prayer.alert.done'), onPress: () => navigation.goBack() },
        {
          text: t('care.prayer.alert.needSupport'),
          onPress: () =>
            navigation.navigate('CareSupportRequest', {
              initialHelpType: 'A conversation with a pastor',
            }),
        },
      ]
    );
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
            <Text style={styles.headerLabel}>{t('care.header')}</Text>
            <View style={styles.divider} />
            <Text style={styles.title}>{t('care.prayer.title')}</Text>
          </View>

          <View style={styles.mainContent}>
            <GlassCard withGlow style={styles.inputCard}>
              <Text style={styles.cardLabel}>{t('care.prayer.label')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={t('care.prayer.placeholder')}
                placeholderTextColor="rgba(255, 255, 255, 0.2)"
                multiline
                numberOfLines={5}
                value={request}
                onChangeText={setRequest}
              />
              <View style={styles.cardFooter}>
                <CustomButton title={t('care.prayer.action')} onPress={handleSharePrayer} style={styles.submitButton} />
                <View style={styles.stars}>
                  <Text style={styles.star}>★</Text>
                  <Text style={styles.starLarge}>★</Text>
                  <Text style={styles.star}>★</Text>
                </View>
              </View>
            </GlassCard>

            <View style={styles.togglesCard}>
              <GlassCard style={styles.innerCard}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelGroup}>
                    <Text style={styles.toggleTitle}>{t('care.prayer.anonymous.title')}</Text>
                    <Text style={styles.toggleSubtitle}>{t('care.prayer.anonymous.subtitle')}</Text>
                  </View>
                  <Switch
                    value={anonymous}
                    onValueChange={setAnonymous}
                    trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(229, 185, 95, 0.4)' }}
                    thumbColor={anonymous ? Colors.accentGold : '#f4f3f4'}
                  />
                </View>
                <View style={styles.separator} />
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelGroup}>
                    <Text style={styles.toggleTitle}>{t('care.prayer.support.title')}</Text>
                    <Text style={styles.toggleSubtitle}>{t('care.prayer.support.subtitle')}</Text>
                  </View>
                  <Switch
                    value={pastoralSupport}
                    onValueChange={setPastoralSupport}
                    trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(229, 185, 95, 0.4)' }}
                    thumbColor={pastoralSupport ? Colors.accentGold : '#f4f3f4'}
                  />
                </View>
              </GlassCard>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t('care.home.footer')}
              </Text>
            </View>
          </View>
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
    paddingTop: 8,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  headerLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 3.2,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.accentGold,
    textDecorationStyle: 'solid',
    marginBottom: 10,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 14,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 10,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 19,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  inputCard: {
    padding: 28,
    minHeight: 280,
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    letterSpacing: 2,
    marginBottom: 24,
  },
  textInput: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 19,
    color: Colors.text,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  stars: {
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 0.4,
  },
  star: {
    color: Colors.accentGold,
    fontSize: 10,
  },
  starLarge: {
    color: Colors.accentGold,
    fontSize: 16,
  },
  togglesCard: {
    marginTop: 18,
  },
  innerCard: {
    padding: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabelGroup: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 20,
  },
  footer: {
    marginTop: 12,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    maxWidth: 220,
    lineHeight: 20,
  },
});

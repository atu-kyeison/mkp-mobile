import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function CareHome({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>{t('care.header')}</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.headerTitle}>{t('care.home.title')}</Text>
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 112 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <GlassCard withGlow style={styles.mainCard}>
              <Text style={styles.cardLabel}>{t('care.home.prayer.label')}</Text>
              <Text style={styles.cardText}>
                {t('care.home.prayer.prompt')}
              </Text>
              <CustomButton
                title={t('care.home.prayer.action')}
                onPress={() => navigation.navigate('PrayerSubmission')}
              />
            </GlassCard>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('CareSupportRequest')}
            >
              <Text style={styles.linkText}>{t('care.home.needMore')}</Text>
            </TouchableOpacity>
          </View>

          <GlassCard style={styles.gratitudeCard}>
            <Text style={styles.cardLabel}>{t('care.home.gratitude.label')}</Text>
            <Text style={[styles.cardText, styles.smallText]}>
              {t('care.home.gratitude.prompt')}
            </Text>
            <CustomButton
              title={t('care.home.gratitude.action')}
              variant="outline"
              onPress={() => navigation.navigate('TestimonySubmission')}
            />
          </GlassCard>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('care.home.footer')}
            </Text>
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
    paddingTop: 22,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  headerLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 4,
    marginBottom: 4,
  },
  headerDivider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 6,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 21,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  section: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainCard: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 22,
    alignItems: 'center',
  },
  gratitudeCard: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 22,
    alignItems: 'center',
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    letterSpacing: 2,
    marginBottom: 24,
  },
  cardText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 30,
  },
  smallText: {
    fontSize: 17,
    marginBottom: 24,
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.accentGold,
    textDecorationLine: 'underline',
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
    maxWidth: 200,
    lineHeight: 20,
  },
});

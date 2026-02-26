import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { useI18n } from '../../src/i18n/I18nProvider';

export default function CareHome({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 112 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <GlassCard withGlow style={styles.mainCard}>
              <Text style={styles.title}>{t('care.home.title')}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  section: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainCard: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
  },
  gratitudeCard: {
    width: '100%',
    padding: 28,
    alignItems: 'center',
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    letterSpacing: 2,
    marginBottom: 32,
  },
  cardText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 30,
  },
  smallText: {
    fontSize: 17,
    marginBottom: 32,
  },
  linkButton: {
    marginTop: 32,
  },
  linkText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.accentGold,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 16,
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

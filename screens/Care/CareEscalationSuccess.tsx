import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { Colors } from '../../constants/Colors';
import { useI18n } from '../../src/i18n/I18nProvider';

export default function CareEscalationSuccess({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { paddingBottom: Math.max(24, insets.bottom + 8) }]}>
          <GlassCard withGlow style={styles.card}>
            <Text style={styles.icon}>✓</Text>
            <Text style={styles.title}>{t('care.success.title')}</Text>
            <Text style={styles.message}>{t('care.success.message')}</Text>
            <Text style={styles.disclaimer}>{t('care.success.disclaimer')}</Text>
          </GlassCard>

          <View style={styles.ctaGroup}>
            <CustomButton
              title={t('care.success.returnHome')}
              onPress={() => navigation.getParent()?.navigate('Home')}
              style={styles.fullWidthButton}
            />
            <TouchableOpacity onPress={() => navigation.navigate('PrayerSubmission')}>
              <Text style={styles.link}>{t('care.success.submitPrayer')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.getParent()?.getParent()?.navigate('Terms')}>
              <Text style={styles.footerLink}>{t('auth.footer.terms')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.getParent()?.getParent()?.navigate('Privacy')}>
              <Text style={styles.footerLink}>{t('auth.footer.privacy')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  card: { padding: 28, alignItems: 'center' },
  icon: {
    fontFamily: 'Inter_700Bold',
    fontSize: 44,
    color: Colors.accentGold,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 38,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 14,
  },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.82)',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 14,
  },
  disclaimer: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 0.52)',
    textAlign: 'center',
  },
  ctaGroup: {
    marginTop: 26,
    alignItems: 'center',
    gap: 14,
  },
  fullWidthButton: {
    width: '100%',
  },
  link: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.accentGold,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.accentGold,
  },
  footer: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  footerLink: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.35)',
    textDecorationLine: 'underline',
  },
});

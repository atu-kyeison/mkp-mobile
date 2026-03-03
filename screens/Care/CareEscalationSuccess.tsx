import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { Colors } from '../../constants/Colors';
import { useI18n } from '../../src/i18n/I18nProvider';

export default function CareEscalationSuccess({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const threadCreated = Boolean(route?.params?.threadCreated);
  const requestType = route?.params?.requestType as string | undefined;
  const isNextStepFlow =
    requestType === 'new_believer' ||
    requestType === 'baptism_request' ||
    requestType === 'other';

  const title = isNextStepFlow ? t('care.nextSteps.success.title') : t('care.success.title');
  const message = isNextStepFlow ? t('care.nextSteps.success.message') : t('care.success.message');
  const disclaimer = isNextStepFlow ? t('care.nextSteps.success.disclaimer') : t('care.success.disclaimer');
  const returnHomeLabel = isNextStepFlow ? t('care.nextSteps.success.returnHome') : t('care.success.returnHome');
  const secondaryLinkLabel = isNextStepFlow ? t('care.nextSteps.success.submitPrayer') : t('care.success.submitPrayer');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { paddingBottom: Math.max(24, insets.bottom + 8) }]}>
          <GlassCard withGlow style={styles.card}>
            <Text style={styles.kicker}>
              {isNextStepFlow ? t('care.nextSteps.success.kicker') : t('care.success.kicker')}
            </Text>
            <Text style={styles.icon}>✓</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.disclaimer}>{disclaimer}</Text>
          </GlassCard>

          <View style={styles.ctaGroup}>
            {threadCreated ? (
              <CustomButton
                title={t('care.success.viewInbox')}
                onPress={() => navigation.navigate('CareInbox')}
                style={styles.fullWidthButton}
              />
            ) : null}
            <CustomButton
              title={returnHomeLabel}
              onPress={() => navigation.getParent()?.navigate('Home')}
              variant="outline"
              style={styles.fullWidthButton}
            />
            <TouchableOpacity onPress={() => navigation.navigate('PrayerSubmission')}>
              <Text style={styles.link}>{secondaryLinkLabel}</Text>
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
  card: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
  },
  kicker: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    letterSpacing: 3,
    color: Colors.accentGold,
    marginBottom: 12,
    textAlign: 'center',
  },
  icon: {
    fontFamily: 'Inter_700Bold',
    fontSize: 44,
    color: Colors.accentGold,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 34,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 42,
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
    maxWidth: 340,
    alignSelf: 'center',
  },
  link: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.accentGold,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.accentGold,
    textAlign: 'center',
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
    color: Colors.accentGold,
    textDecorationLine: 'underline',
  },
});

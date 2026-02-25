import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { Colors } from '../../constants/Colors';
import { useI18n } from '../../src/i18n/I18nProvider';

export default function CareEscalationSuccess({ navigation }: any) {
  const { t } = useI18n();
  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <GlassCard withGlow style={styles.card}>
            <Text style={styles.kicker}>{t('care.success.kicker')}</Text>
            <Text style={styles.title}>{t('care.success.title')}</Text>
            <Text style={styles.message}>
              {t('care.success.message')}
            </Text>
            <CustomButton title={t('care.success.back')} onPress={() => navigation.navigate('CareHome')} />
          </GlassCard>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  card: { padding: 24, alignItems: 'center' },
  kicker: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: 'rgba(229, 185, 95, 0.7)',
    letterSpacing: 2,
    marginBottom: 14,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 30,
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
    marginBottom: 24,
  },
});

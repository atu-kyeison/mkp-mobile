import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, View, Text, ScrollView, TextInput, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { useSession } from '../../src/backend/SessionProvider';
import { useI18n } from '../../src/i18n/I18nProvider';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function TestimonySubmission({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { themeId } = useTheme();
  const { session, callFunction } = useSession();
  const styles = useMemo(() => createStyles(), [themeId]);
  const [anonymous, setAnonymous] = useState(false);
  const [allowShare, setAllowShare] = useState(true);
  const [testimony, setTestimony] = useState('');

  const handleShareGratitude = async () => {
    if (!testimony.trim()) {
      Alert.alert(t('care.support.validation.title'), t('care.support.validation.messageRequired'));
      return;
    }

    const churchId = session?.context?.currentChurchId;
    if (!churchId) {
      Alert.alert(t('care.support.validation.title'), t('auth.churchSearch.errorRequired'));
      return;
    }

    try {
      await callFunction<{ requestId: string }>('submitCareRequest', {
        churchId,
        type: 'testimony',
        content: testimony.trim(),
        isAnonymous: anonymous,
        preferredChannel: 'email',
        categoryId: allowShare ? 'other' : 'pastor_conversation',
      });
      Alert.alert(
        t('care.testimony.alert.title'),
        t('care.testimony.alert.body'),
        [{ text: t('common.ok'), onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert(
        t('care.support.error'),
        error instanceof Error ? error.message : t('care.testimony.alert.body')
      );
    }
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
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={28} color={Colors.accentGold} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <Text style={styles.title}>{t('care.testimony.title')}</Text>
          </View>

          <GlassCard withGlow style={styles.inputCard}>
            <Text style={styles.cardLabel}>{t('care.testimony.label')}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={t('care.testimony.placeholder')}
              placeholderTextColor="rgba(148, 163, 184, 0.5)"
              multiline
              numberOfLines={8}
              value={testimony}
              onChangeText={setTestimony}
            />
            <View style={styles.stars}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.starLarge}>★</Text>
              <Text style={styles.star}>★</Text>
            </View>
          </GlassCard>

          <View style={styles.togglesContainer}>
            <GlassCard style={styles.innerCard}>
              <View style={styles.toggleRow}>
                <View style={styles.labelWithIcon}>
                  <Text style={styles.icon}>👤</Text>
                  <Text style={styles.toggleText}>{t('care.testimony.anonymous')}</Text>
                </View>
                <Switch
                  value={anonymous}
                  onValueChange={setAnonymous}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: Colors.accentGold }}
                  thumbColor="#fff"
                />
              </View>
              <View style={styles.separator} />
              <View style={styles.toggleRow}>
                <View style={styles.labelWithIcon}>
                  <Text style={styles.icon}>⛪</Text>
                  <Text style={styles.toggleText}>{t('care.testimony.allowShare')}</Text>
                </View>
                <Switch
                  value={allowShare}
                  onValueChange={setAllowShare}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(229, 185, 95, 0.4)' }}
                  thumbColor={allowShare ? Colors.accentGold : '#fff'}
                />
              </View>
            </GlassCard>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton title={t('care.testimony.action')} onPress={handleShareGratitude} />
            <TouchableOpacity style={styles.secondaryExit} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryExitText}>{t('reflection.detail.cancel')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('care.testimony.footer')}
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
    paddingTop: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: -6,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 18,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  inputCard: {
    padding: 24,
    minHeight: 300,
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    letterSpacing: 2,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    color: Colors.text,
    textAlignVertical: 'top',
  },
  stars: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    opacity: 0.4,
  },
  star: {
    color: Colors.accentGold,
    fontSize: 10,
  },
  starLarge: {
    color: Colors.accentGold,
    fontSize: 14,
  },
  togglesContainer: {
    marginTop: 18,
  },
  innerCard: {
    padding: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    opacity: 0.4,
  },
  toggleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 18,
    alignItems: 'center',
  },
  secondaryExit: {
    marginTop: 14,
  },
  secondaryExitText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.56)',
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
    lineHeight: 20,
  },
});

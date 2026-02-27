import React, { useState } from 'react';
import { Settings } from 'react-native';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import Colors from '../../constants/Colors';
import { useI18n } from '../../i18n/I18nProvider';
import { LogoBadge } from '../../components/LogoBadge';
import { getPrimaryBrandLogoUri, resolveChurchBrandingByCode } from '../../constants/brandAssets';
import { ErrorStateCard } from '../../components/ErrorStateCard';

const ChurchSearchScreen = ({ navigation }: any) => {
  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [errorKind, setErrorKind] = useState<'required' | 'not_found' | null>(null);
  const brandLogoUri = getPrimaryBrandLogoUri();

  const handleConnect = () => {
    const normalized = code.trim();
    if (!normalized) {
      setErrorKind('required');
      return;
    }

    const resolved = resolveChurchBrandingByCode(normalized);
    if (!resolved.found) {
      setErrorKind('not_found');
      return;
    }

    setErrorKind(null);
    Settings.set({
      'mkp.connectedChurchName': resolved.name,
      'mkp.connectedChurchLogoUri': resolved.logoUri || '',
    });
    navigation.navigate('ChurchSuccess', { churchName: resolved.name, churchLogoUri: resolved.logoUri });
  };

  const openCodeHelp = () =>
    Alert.alert(
      t('auth.churchSearch.helpTitle'),
      t('auth.churchSearch.helpBody')
    );

  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <LogoBadge logoUri={brandLogoUri} fallbackIcon="church" size={64} />
              <Text style={styles.brandText}>{t('auth.brand')}</Text>
            </View>
            <GlassCard style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>{t('auth.churchSearch.title')}</Text>
                <Text style={styles.subtitle}>{t('auth.churchSearch.subtitle')}</Text>
              </View>
              <View style={styles.form}>
                <Text style={styles.label}>{t('auth.churchSearch.codeLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.churchSearch.codePlaceholder')}
                  placeholderTextColor="rgba(255, 255, 255, 0.25)"
                  autoCapitalize="characters"
                  value={code}
                  onChangeText={(value) => {
                    setCode(value);
                    if (errorKind) setErrorKind(null);
                  }}
                />
                <View style={styles.buttonWrapper}><GoldButton title={t('auth.churchSearch.submit')} onPress={handleConnect} /></View>
                <TouchableOpacity
                  style={styles.helpLink}
                  onPress={openCodeHelp}
                >
                  <Text style={styles.helpText}>{t('auth.churchSearch.codeHelp')}</Text>
                </TouchableOpacity>
                {errorKind ? (
                  <ErrorStateCard
                    title={t('auth.churchSearch.errorTitle')}
                    body={t(errorKind === 'required' ? 'auth.churchSearch.errorRequired' : 'auth.churchSearch.errorNotFound')}
                    primaryLabel={t('auth.churchSearch.retry')}
                    onPrimaryPress={() => setErrorKind(null)}
                    secondaryLabel={t('auth.churchSearch.getHelp')}
                    onSecondaryPress={openCodeHelp}
                  />
                ) : null}
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>{t('auth.footer.prefix')}</Text>
                <View style={styles.footerLinks}>
                  <TouchableOpacity onPress={() => navigation.navigate('Terms')}><Text style={styles.footerLink}>{t('auth.footer.terms')}</Text></TouchableOpacity>
                  <Text style={styles.footerText}> {t('auth.footer.and')} </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Privacy')}><Text style={styles.footerLink}>{t('auth.footer.privacy')}</Text></TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          </View>
        </ScrollView>
      </SafeAreaView>
    </MidnightBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, scrollContent: { flexGrow: 1, paddingTop: 20, paddingBottom: 24 },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' }, headerContainer: { alignItems: 'center', marginBottom: 24 },
  brandText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, letterSpacing: 5, color: Colors.antiqueGold },
  card: { width: '100%', maxWidth: 420, alignSelf: 'center', borderRadius: 28, paddingHorizontal: 28, paddingTop: 28, paddingBottom: 24 },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 30, color: 'white', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontFamily: 'Inter_300Light', fontSize: 14, color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', lineHeight: 22, maxWidth: 280 },
  form: {}, label: { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 2, color: 'rgba(229, 185, 95, 0.7)', marginLeft: 4, marginBottom: 8 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 16, color: 'white', fontFamily: 'Inter_400Regular', fontSize: 14, letterSpacing: 2 },
  buttonWrapper: { marginTop: 24 }, helpLink: { alignItems: 'center', marginTop: 20 }, helpText: { fontFamily: 'Inter_300Light', fontSize: 12, color: 'rgba(255, 255, 255, 0.4)' },
  cardFooter: { marginTop: 'auto', paddingTop: 24, alignItems: 'center' },
  footerText: { fontFamily: 'Inter_300Light', fontSize: 10, color: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', lineHeight: 16, maxWidth: 280 },
  footerLinks: { flexDirection: 'row', alignItems: 'center' },
  footerLink: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.antiqueGold,
    textDecorationLine: 'underline',
  },
});

export default ChurchSearchScreen;

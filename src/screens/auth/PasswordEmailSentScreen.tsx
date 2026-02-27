import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useI18n } from '../../i18n/I18nProvider';
import { LogoBadge } from '../../components/LogoBadge';
import { getPrimaryBrandLogoUri } from '../../constants/brandAssets';

const PasswordEmailSentScreen = ({ navigation }: any) => {
  const { t } = useI18n();
  const brandLogoUri = getPrimaryBrandLogoUri();
  const insets = useSafeAreaInsets();
  return (
    <MidnightBackground>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <LogoBadge logoUri={brandLogoUri} fallbackIcon="church" size={64} />
            <Text style={styles.brandText}>{t('auth.brand')}</Text>
          </View>
          <GlassCard style={styles.card}>
            <View style={styles.content}>
              <View style={styles.iconCircle}><MaterialIcons name="mail-lock" size={48} color={Colors.antiqueGold} /></View>
              <Text style={styles.title}>{t('auth.passwordEmailSent.title')}</Text>
              <Text style={styles.subtitle}>{t('auth.passwordEmailSent.subtitle')}</Text>
              <View style={styles.buttonWrapper}><GoldButton title={t('auth.passwordEmailSent.submit')} onPress={() => navigation.navigate('Signin', {})} /></View>
              <View style={styles.linksContainer}>
                <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Signin', {})}><Text style={styles.linkText}>{t('auth.passwordEmailSent.resend')}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Signin', {})}><Text style={styles.linkText}>{t('auth.passwordEmailSent.useDifferent')}</Text></TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>
                {t('auth.footer.prefix')} <Text style={styles.footerLink} onPress={() => navigation.navigate('Terms')}>{t('auth.footer.terms')}</Text> {t('auth.footer.and')} <Text style={styles.footerLink} onPress={() => navigation.navigate('Privacy')}>{t('auth.footer.privacy')}</Text>.
              </Text>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  </MidnightBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, scrollContent: { flexGrow: 1 }, container: { flex: 1, paddingTop: 60 },
  headerContainer: { alignItems: 'center', marginBottom: 32 },
  brandText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, letterSpacing: 5, color: Colors.antiqueGold },
  card: { flex: 1, borderTopLeftRadius: 56, borderTopRightRadius: 56, paddingHorizontal: 40, paddingTop: 64, paddingBottom: 32 },
  content: { alignItems: 'center' },
  iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(229, 185, 95, 0.05)', borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  title: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 30, color: 'white', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontFamily: 'Inter_300Light', fontSize: 16, color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', lineHeight: 24, maxWidth: 300, marginBottom: 48 },
  buttonWrapper: { width: '100%', marginBottom: 32 }, linksContainer: { alignItems: 'center', gap: 16 }, linkButton: { paddingVertical: 4 }, linkText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, color: Colors.antiqueGold, letterSpacing: 1.5 },
  cardFooter: { marginTop: 'auto', alignItems: 'center' }, footerText: { fontFamily: 'Inter_300Light', fontSize: 10, color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', lineHeight: 16, maxWidth: 280, textTransform: 'uppercase' }, footerLink: { textDecorationLine: 'underline' },
});

export default PasswordEmailSentScreen;

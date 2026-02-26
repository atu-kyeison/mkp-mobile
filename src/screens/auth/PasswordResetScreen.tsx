import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useI18n } from '../../i18n/I18nProvider';

const PasswordResetScreen = ({ navigation }: any) => {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.logoCircle}><MaterialIcons name="church" size={32} color={Colors.antiqueGold} /></View>
              <Text style={styles.brandText}>{t('auth.brand')}</Text>
            </View>
            <GlassCard style={styles.card}>
              <View style={styles.header}><Text style={styles.title}>{t('auth.passwordReset.title')}</Text><Text style={styles.subtitle}>{t('auth.passwordReset.subtitle')}</Text></View>
              <View style={styles.form}>
                <View style={styles.inputGroup}><Text style={styles.label}>{t('auth.signin.emailLabel')}</Text><TextInput style={styles.input} placeholder={t('auth.input.emailPlaceholder')} placeholderTextColor="rgba(255, 255, 255, 0.25)" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} /></View>
                <View style={styles.buttonWrapper}><GoldButton title={t('auth.passwordReset.submit')} onPress={() => navigation.navigate('PasswordEmailSent', { email })} /></View>
                <TouchableOpacity style={styles.signinLink} onPress={() => navigation.navigate('Signin', {})}><Text style={styles.signinText}>{t('auth.passwordReset.remembered')} <Text style={styles.signinHighlight}>{t('auth.signup.signin')}</Text></Text></TouchableOpacity>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>
                  {t('auth.footer.prefix')} <Text style={styles.footerLink} onPress={() => navigation.navigate('Terms')}>{t('auth.footer.terms')}</Text> {t('auth.footer.and')} <Text style={styles.footerLink} onPress={() => navigation.navigate('Privacy')}>{t('auth.footer.privacy')}</Text>.
                </Text>
              </View>
            </GlassCard>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MidnightBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, keyboardView: { flex: 1 }, container: { flex: 1, paddingTop: 60 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, letterSpacing: 5, color: Colors.antiqueGold },
  card: { flex: 1, borderTopLeftRadius: 56, borderTopRightRadius: 56, paddingHorizontal: 40, paddingTop: 48, paddingBottom: 32 },
  header: { alignItems: 'center', marginBottom: 40 }, title: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 30, color: 'white', textAlign: 'center', marginBottom: 12 }, subtitle: { fontFamily: 'Inter_300Light', fontSize: 14, color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', lineHeight: 22, maxWidth: 260 },
  form: { flex: 1 }, inputGroup: { marginBottom: 24 }, label: { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 2, color: 'rgba(229, 185, 95, 0.7)', marginLeft: 4, marginBottom: 8 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 16, color: 'white', fontFamily: 'Inter_400Regular', fontSize: 14 },
  buttonWrapper: { marginTop: 16 }, signinLink: { alignItems: 'center', marginTop: 24 }, signinText: { fontFamily: 'Inter_300Light', fontSize: 12, color: 'rgba(255, 255, 255, 0.4)' }, signinHighlight: { color: Colors.antiqueGold },
  cardFooter: { marginTop: 'auto', alignItems: 'center' }, footerText: { fontFamily: 'Inter_300Light', fontSize: 10, color: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', lineHeight: 16, maxWidth: 280 }, footerLink: { textDecorationLine: 'underline' },
});

export default PasswordResetScreen;

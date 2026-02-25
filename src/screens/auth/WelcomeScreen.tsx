import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useI18n } from '../../i18n/I18nProvider';

const WelcomeScreen = ({ navigation }: any) => {
  const { t } = useI18n();
  return (
    <MidnightBackground>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <GlassCard style={styles.card}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <MaterialIcons name="church" size={32} color={Colors.antiqueGold} />
              </View>
              <Text style={styles.brandText}>{t('auth.brand')}</Text>
            </View>
            <View style={styles.header}>
              <Text style={styles.title}>{t('auth.welcome.title')}</Text>
              <Text style={styles.subtitle}>{t('auth.welcome.subtitle')}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <GoldButton title={t('auth.welcome.join')} onPress={() => navigation.navigate('Signup')} />
              <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Signin', {})}>
                <Text style={styles.linkText}>{t('auth.welcome.haveAccess')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t('auth.footer.prefix')}{' '}
                <Text style={styles.footerLink} onPress={() => navigation.navigate('Terms')}>{t('auth.footer.terms')}</Text>{' '}
                {t('auth.footer.and')}{' '}
                <Text style={styles.footerLink} onPress={() => navigation.navigate('Privacy')}>{t('auth.footer.privacy')}</Text>.
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
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 20, justifyContent: 'center' },
  container: { width: '100%', alignItems: 'center' },
  card: { width: '100%', maxWidth: 420, paddingHorizontal: 28, paddingTop: 32, paddingBottom: 28, alignSelf: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 28 },
  logoCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  brandText: { fontFamily: 'Cinzel_400Regular', fontSize: 10, letterSpacing: 4, color: Colors.antiqueGold },
  header: { alignItems: 'center', marginBottom: 28 },
  title: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 28, color: 'white', textAlign: 'center', lineHeight: 36, marginBottom: 12 },
  subtitle: { fontFamily: 'Inter_300Light', fontSize: 14, color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },
  buttonContainer: { width: '100%', alignItems: 'center' },
  linkButton: { marginTop: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(229, 185, 95, 0.4)', paddingBottom: 4 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.antiqueGold, letterSpacing: 1.5 },
  footer: { marginTop: 'auto', paddingTop: 24, paddingHorizontal: 12 },
  footerText: { fontFamily: 'Inter_300Light', fontSize: 10, color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', lineHeight: 16, letterSpacing: 1 },
  footerLink: { textDecorationLine: 'underline' },
});

export default WelcomeScreen;

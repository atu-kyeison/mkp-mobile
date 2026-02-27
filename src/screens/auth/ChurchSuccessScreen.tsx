import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useI18n } from '../../i18n/I18nProvider';
import { LogoBadge } from '../../components/LogoBadge';

const ChurchSuccessScreen = ({ navigation, route }: any) => {
  const { t } = useI18n();
  const { churchName } = route.params;
  const churchLogoUri = route.params?.churchLogoUri as string | undefined;
  const isNewBeliever = route.params?.isNewBeliever === true;
  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.container}>
            <GlassCard style={styles.card}>
              <View style={styles.content}>
                <View style={styles.iconContainer}><View style={styles.iconCircle}><MaterialIcons name="check-circle" size={40} color={Colors.antiqueGold} /></View></View>
                <View style={styles.header}><Text style={styles.title}>{t('auth.churchSuccess.title')}</Text><Text style={styles.churchName}>{churchName.toUpperCase()}</Text></View>
                <View style={styles.logoSlot}>
                  <LogoBadge logoUri={churchLogoUri} fallbackIcon="church" size={80} ringWidth={2} />
                </View>
                <Text style={styles.description}>{t('auth.churchSuccess.description')}</Text>
                <View style={styles.primaryButtonWrap}>
                  <GoldButton
                    title={isNewBeliever ? t('auth.churchSuccess.continue') : t('auth.churchSuccess.submit')}
                    onPress={() =>
                      isNewBeliever
                        ? navigation.navigate('NewBelieverStart', { churchName })
                        : navigation.getParent()?.navigate('Main', { screen: 'Home' })
                    }
                  />
                </View>
                {!isNewBeliever ? (
                  <View style={styles.secondaryButton}>
                    <GoldButton
                      title={t('auth.churchSuccess.newBeliever')}
                      variant="outline"
                      onPress={() => navigation.navigate('NewBelieverStart', { churchName })}
                    />
                  </View>
                ) : null}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    {t('auth.footer.prefix')} <Text style={styles.footerLink} onPress={() => navigation.navigate('Terms')}>{t('auth.footer.terms')}</Text> {t('auth.footer.and')} <Text style={styles.footerLink} onPress={() => navigation.navigate('Privacy')}>{t('auth.footer.privacy')}</Text>.
                  </Text>
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
  safeArea: { flex: 1 }, scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 20, justifyContent: 'center' }, container: { width: '100%', alignItems: 'center' },
  card: { width: '100%', maxWidth: 420, borderRadius: 32 },
  content: { width: '100%', alignItems: 'center', paddingHorizontal: 28, paddingTop: 28, paddingBottom: 24 },
  iconContainer: { marginBottom: 24 }, iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(229, 185, 95, 0.05)', borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.1)', justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 24 }, title: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 28, color: 'white', textAlign: 'center', marginBottom: 8 },
  churchName: { fontFamily: 'Cinzel_400Regular', fontSize: 13, color: Colors.antiqueGold, letterSpacing: 2, textAlign: 'center' },
  logoSlot: { marginBottom: 24, width: '100%', alignItems: 'center' },
  description: { fontFamily: 'Inter_300Light', fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 22, marginBottom: 28, paddingHorizontal: 16 },
  primaryButtonWrap: { width: '100%', alignSelf: 'stretch' },
  secondaryButton: { marginTop: 10, width: '100%', alignSelf: 'stretch' },
  footer: { marginTop: 'auto', paddingTop: 24, alignItems: 'center' }, footerText: { fontFamily: 'Inter_300Light', fontSize: 10, color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', lineHeight: 16, maxWidth: 280 }, footerLink: { textDecorationLine: 'underline', color: Colors.antiqueGold },
});

export default ChurchSuccessScreen;

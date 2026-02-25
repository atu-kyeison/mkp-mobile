import React, { useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useI18n } from '../../i18n/I18nProvider';

const ChurchSearchScreen = ({ navigation }: any) => {
  const { t } = useI18n();
  const [code, setCode] = useState('');

  const handleConnect = () => {
    const churchName = 'Grace Community Church';
    navigation.navigate('ChurchSuccess', { churchName });
  };

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
              <View style={styles.logoCircle}><MaterialIcons name="church" size={32} color={Colors.antiqueGold} /></View>
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
                  placeholder="E.G. KINGDOM-24"
                  placeholderTextColor="rgba(255, 255, 255, 0.25)"
                  autoCapitalize="characters"
                  value={code}
                  onChangeText={setCode}
                />
                <View style={styles.buttonWrapper}><GoldButton title={t('auth.churchSearch.submit')} onPress={handleConnect} /></View>
                <TouchableOpacity
                  style={styles.helpLink}
                  onPress={() =>
                    Alert.alert(
                      t('auth.churchSearch.helpTitle'),
                      t('auth.churchSearch.helpBody')
                    )
                  }
                >
                  <Text style={styles.helpText}>{t('auth.churchSearch.codeHelp')}</Text>
                </TouchableOpacity>
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
  logoCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
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
  footerLink: { textDecorationLine: 'underline' },
});

export default ChurchSearchScreen;

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useI18n } from '../../i18n/I18nProvider';

const NewBelieverStartScreen = ({ navigation }: any) => {
  const { t } = useI18n();

  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="chevron-left" size={28} color={Colors.antiqueGold} />
              </TouchableOpacity>
              <Text style={styles.brand}>{t('auth.brand')}</Text>
              <View style={styles.backButtonSpacer} />
            </View>

            <GlassCard style={styles.card}>
              <Text style={styles.title}>{t('newBeliever.title')}</Text>
              <Text style={styles.subtitle}>
                {t('newBeliever.subtitle')}
              </Text>

              <Text style={styles.sectionLabel}>{t('newBeliever.next')}</Text>

              <View style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="check" size={16} color={Colors.antiqueGold} />
                </View>
                <Text style={styles.stepText}>{t('newBeliever.step1')}</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="auto-awesome" size={16} color={Colors.antiqueGold} />
                </View>
                <Text style={styles.stepText}>{t('newBeliever.step2')}</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="map" size={16} color={Colors.antiqueGold} />
                </View>
                <Text style={styles.stepText}>{t('newBeliever.step3')}</Text>
              </View>

              <View style={styles.cardDivider} />
              <Text style={styles.privacyLine}>
                {t('newBeliever.privacy')}
              </Text>
            </GlassCard>
          </ScrollView>

          <View style={styles.bottomSheet}>
            <GoldButton
              title={t('auth.churchSuccess.submit')}
              onPress={() => navigation.getParent()?.navigate('Main', { screen: 'Home' })}
            />
            <TouchableOpacity
              style={styles.prayerLinkButton}
              onPress={() =>
                navigation.getParent()?.navigate('Main', {
                  screen: 'Church',
                  params: {
                    screen: 'CareSupportRequest',
                    params: { initialHelpType: 'I recently gave my life to Christ' },
                  },
                })
              }
            >
              <Text style={styles.prayerLinkText}>{t('newBeliever.prayerStart')}</Text>
            </TouchableOpacity>

            <View style={styles.legalRow}>
              <Text style={styles.legalLink} onPress={() => navigation.navigate('Terms')}>{t('auth.footer.terms').toUpperCase()}</Text>
              <Text style={styles.legalDot}>•</Text>
              <Text style={styles.legalLink} onPress={() => navigation.navigate('Privacy')}>{t('auth.footer.privacy').toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </MidnightBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 44, paddingBottom: 270 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  backButton: { padding: 2 },
  backButtonSpacer: { width: 32 },
  brand: { fontFamily: 'Cinzel_400Regular', fontSize: 12, color: Colors.antiqueGold, letterSpacing: 6 },
  card: { paddingHorizontal: 24, paddingVertical: 28, borderRadius: 32 },
  title: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 54, lineHeight: 62, color: '#fff', marginBottom: 18 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 32, color: 'rgba(255,255,255,0.75)', marginBottom: 24 },
  sectionLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.antiqueGold, letterSpacing: 4, marginBottom: 18 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18, paddingRight: 10 },
  stepIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.2)',
    backgroundColor: 'rgba(229, 185, 95, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  stepText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 25, color: 'rgba(255,255,255,0.86)' },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginTop: 14, marginBottom: 18 },
  privacyLine: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 25, color: 'rgba(148,163,184,0.85)', textAlign: 'center', fontStyle: 'italic' },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: 'rgba(13, 27, 42, 0.96)',
  },
  prayerLinkButton: { marginTop: 16, alignItems: 'center' },
  prayerLinkText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.antiqueGold, textDecorationLine: 'underline' },
  legalRow: { marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  legalLink: { fontFamily: 'Inter_400Regular', fontSize: 10, letterSpacing: 1.8, color: Colors.antiqueGold, textDecorationLine: 'underline' },
  legalDot: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
});

export default NewBelieverStartScreen;

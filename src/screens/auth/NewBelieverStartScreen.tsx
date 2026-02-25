import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const NewBelieverStartScreen = ({ navigation }: any) => {
  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="chevron-left" size={28} color={Colors.antiqueGold} />
              </TouchableOpacity>
              <Text style={styles.brand}>MY KINGDOM PAL</Text>
              <View style={styles.backButtonSpacer} />
            </View>

            <GlassCard style={styles.card}>
              <Text style={styles.title}>Welcome home.</Text>
              <Text style={styles.subtitle}>
                We’re grateful you’re here. You don’t have to have it all figured out. This is a gentle beginning.
              </Text>

              <Text style={styles.sectionLabel}>WHAT HAPPENS NEXT</Text>

              <View style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="check" size={16} color={Colors.antiqueGold} />
                </View>
                <Text style={styles.stepText}>Join your church community</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="auto-awesome" size={16} color={Colors.antiqueGold} />
                </View>
                <Text style={styles.stepText}>Receive Sunday’s message in a simple recap</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="map" size={16} color={Colors.antiqueGold} />
                </View>
                <Text style={styles.stepText}>Walk one small step each day this week</Text>
              </View>

              <View style={styles.cardDivider} />
              <Text style={styles.privacyLine}>
                Your journal is private — a space between you and God.
              </Text>
            </GlassCard>
          </ScrollView>

          <View style={styles.bottomSheet}>
            <GoldButton
              title="GO TO MY CHURCH"
              onPress={() => navigation.getParent()?.navigate('Main', { screen: 'Home' })}
            />
            <TouchableOpacity
              style={styles.prayerLinkButton}
              onPress={() =>
                navigation.getParent()?.navigate('Main', {
                  screen: 'Church',
                  params: {
                    screen: 'CareSupportRequest',
                    params: { initialHelpType: 'Prayer in person or by call' },
                  },
                })
              }
            >
              <Text style={styles.prayerLinkText}>I want to start with a prayer</Text>
            </TouchableOpacity>

            <View style={styles.legalRow}>
              <Text style={styles.legalLink} onPress={() => navigation.navigate('Terms')}>TERMS OF SERVICE</Text>
              <Text style={styles.legalDot}>•</Text>
              <Text style={styles.legalLink} onPress={() => navigation.navigate('Privacy')}>PRIVACY POLICY</Text>
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
  legalLink: { fontFamily: 'Inter_400Regular', fontSize: 10, letterSpacing: 1.8, color: 'rgba(255,255,255,0.35)', textDecorationLine: 'underline' },
  legalDot: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
});

export default NewBelieverStartScreen;

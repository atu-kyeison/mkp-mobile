import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const UseGuidelinesScreen = ({ navigation }: any) => (
  <MidnightBackground>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><MaterialIcons name="chevron-left" size={24} color={Colors.antiqueGold} /></TouchableOpacity><Text style={styles.headerLabel}>LEGAL</Text><View style={styles.headerDivider} /><Text style={styles.title}>Use Guidelines</Text></View>
        <View style={styles.contentContainer}>
          <GlassCard style={styles.card}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              <Section title="1. Personal Formation" content="MKP is designed for prayerful reflection, spiritual formation, and quiet daily rhythm. Use the app as a personal space to pause, listen, and respond to God with honesty." />
              <Section title="2. Private by Default" content="Your journal entries and mood notes are intended to remain private on your device. Care requests are shared only when you choose to send them for church follow-up." />
              <Section title="3. Respectful Use" content="If you submit a prayer, gratitude, or support request, share truthfully and respectfully. Do not use the app to harass, threaten, impersonate others, or submit unlawful or harmful content." />
              <View style={styles.bondSection}><Text style={styles.bondTitle}>SAFETY AND SUPPORT</Text><Text style={styles.bondContent}>MKP is not emergency response, therapy, or crisis intervention. If someone is in immediate danger, contact local emergency services right away.</Text></View>
              <View style={{ height: 20 }} />
            </ScrollView>
          </GlassCard>
          <View style={styles.buttonWrapper}><GoldButton title="I UNDERSTAND" onPress={() => navigation.goBack()} /></View>
        </View>
      </View>
    </SafeAreaView>
  </MidnightBackground>
);

const Section = ({ title, content }: any) => (
  <View style={styles.section}><Text style={styles.sectionTitle}>{title.toUpperCase()}</Text><Text style={styles.sectionContent}>{content}</Text></View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', paddingTop: 60, marginBottom: 20, position: 'relative' }, backButton: { position: 'absolute', left: 0, top: 60 }, headerLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.antiqueGold, letterSpacing: 4, marginBottom: 8 }, headerDivider: { width: 48, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.3)', marginBottom: 16 }, title: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 30, color: 'white', textAlign: 'center' },
  contentContainer: { flex: 1, paddingBottom: 40 }, card: { flex: 1, backgroundColor: 'rgba(13, 27, 42, 0.5)', borderColor: 'rgba(229, 185, 95, 0.25)', marginBottom: 24 },
  scrollView: { flex: 1 }, scrollContent: { padding: 32 }, section: { marginBottom: 40 }, sectionTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 13, color: Colors.antiqueGold, letterSpacing: 2, marginBottom: 12 }, sectionContent: { fontFamily: 'Inter_300Light', fontSize: 15, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 24 },
  bondSection: { opacity: 0.4 }, bondTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 11, color: Colors.antiqueGold, letterSpacing: 2, marginBottom: 12 }, bondContent: { fontFamily: 'Inter_300Light', fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 22 },
  buttonWrapper: { width: '100%' },
});

export default UseGuidelinesScreen;

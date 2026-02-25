import React from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const UseGuidelinesScreen = ({ navigation }: any) => (
  <MidnightBackground>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}><TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><MaterialIcons name="chevron-left" size={24} color={Colors.antiqueGold} /></TouchableOpacity><Text style={styles.headerLabel}>LEGAL</Text><Text style={styles.title}>Sacred Use Guidelines</Text></View>
        <View style={styles.contentContainer}>
          <GlassCard style={styles.card}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              <Section title="1. The Spirit of the Space" content="This app is for formation and quietude. We invite you to enter this digital sanctuary with a heart prepared for reflection, spiritual growth, and peaceful contemplation." />
              <Section title="2. Community Care" content="When sharing, we speak with kindness and respect. Our community flourishes through uplifting discourse, empathetic listening, and the shared pursuit of holiness." />
              <Section title="3. Privacy & Safety" content="We protect this space by keeping private things private. Your journey is sacred; we honor your vulnerability and ask that you honor the privacy of others within this fellowship." />
              <View style={styles.bondSection}><Text style={styles.bondTitle}>STRENGTHENING THE BOND</Text><Text style={styles.bondContent}>By participating, you commit to maintaining the sanctity of our shared environment and upholding the values of peace and mutual edification.</Text></View>
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
  header: { alignItems: 'center', paddingTop: 60, marginBottom: 20, position: 'relative' }, backButton: { position: 'absolute', left: 0, top: 60 }, headerLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.antiqueGold, letterSpacing: 4, marginBottom: 8 }, title: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 30, color: 'white', textAlign: 'center' },
  contentContainer: { flex: 1, paddingBottom: 40 }, card: { flex: 1, backgroundColor: 'rgba(13, 27, 42, 0.5)', borderColor: 'rgba(229, 185, 95, 0.25)', marginBottom: 24 },
  scrollView: { flex: 1 }, scrollContent: { padding: 32 }, section: { marginBottom: 40 }, sectionTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 13, color: Colors.antiqueGold, letterSpacing: 2, marginBottom: 12 }, sectionContent: { fontFamily: 'Inter_300Light', fontSize: 15, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 24 },
  bondSection: { opacity: 0.4 }, bondTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 11, color: Colors.antiqueGold, letterSpacing: 2, marginBottom: 12 }, bondContent: { fontFamily: 'Inter_300Light', fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 22 },
  buttonWrapper: { width: '100%' },
});

export default UseGuidelinesScreen;

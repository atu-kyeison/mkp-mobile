import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import Colors from '../../constants/Colors';

const PrivacyPolicyScreen = ({ navigation }: any) => (
  <MidnightBackground>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}><Text style={styles.headerLabel}>LEGAL</Text><View style={styles.headerDivider} /><Text style={styles.title}>Privacy Policy</Text></View>
        <View style={styles.contentContainer}>
          <GlassCard style={styles.card}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              <Section number="1" title="Information We Collect" content="To provide a sacred experience, we collect information that helps us personalize your spiritual journey. This includes your name, spiritual goals, and interaction with the 'My Kingdom Pal' system." />
              <Section number="2" title="How We Use It" content="Your data is used solely to refine your path. We analyze patterns to suggest scripture, prayers, and lessons that resonate with your current season of faith." />
              <Section number="3" title="Sacred Trust" content="We do not sell, trade, or transfer your personal information to outside parties. Your privacy is a covenant we uphold with the utmost integrity." />
              <Section number="4" title="Your Rights" content="You maintain full control over your data. You may request deletion or export of your spiritual history at any time through the Profile settings." />
              <View style={{ height: 20 }} />
            </ScrollView>
            <View style={styles.cardFooter}><GoldButton title="I UNDERSTAND" onPress={() => navigation.goBack()} /></View>
          </GlassCard>
        </View>
      </View>
    </SafeAreaView>
  </MidnightBackground>
);

const Section = ({ number, title, content }: any) => (
  <View style={styles.section}><Text style={styles.sectionTitle}>{number}. {title.toUpperCase()}</Text><Text style={styles.sectionContent}>{content}</Text></View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', paddingTop: 40, marginBottom: 20 }, headerLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.antiqueGold, letterSpacing: 4, marginBottom: 8 }, headerDivider: { width: 64, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.3)', marginBottom: 16 }, title: { fontFamily: 'PlayfairDisplay_500Medium', fontStyle: 'italic', fontSize: 34, color: 'white' },
  contentContainer: { flex: 1, marginBottom: 20 }, card: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(229, 185, 95, 0.2)' },
  scrollView: { flex: 1 }, scrollContent: { paddingHorizontal: 24, paddingTop: 32 }, section: { marginBottom: 40 }, sectionTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 11, color: Colors.antiqueGold, letterSpacing: 2, marginBottom: 16 }, sectionContent: { fontFamily: 'Inter_300Light', fontSize: 14, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 24 },
  cardFooter: { padding: 24, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' },
});

export default PrivacyPolicyScreen;

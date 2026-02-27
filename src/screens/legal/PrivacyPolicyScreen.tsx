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
              <Section number="1" title="What Stays on Your Device" content="Journal entries and mood notes are intended to stay on your device. MKP is designed so your private reflections are local-first and not stored on MKP infrastructure." />
              <Section number="2" title="Church Support Requests" content="If you choose to send a prayer, support, or gratitude request through Care, that information may be shared with your connected church team for ministry follow-up. Those requests are not posted publicly." />
              <Section number="3" title="Backups and Email" content="Your device platform may include your local app data in an encrypted device backup, such as iCloud Backup or Android device backup. If your church uses account email for follow-up, that communication may occur outside the app." />
              <Section number="4" title="Your Choices" content="You control what you write, what you submit to Care, and what remains private. If you stop using the app, locally stored content remains subject to your device settings and any backups you manage." />
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

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import Colors from '../../constants/Colors';

const TermsScreen = ({ navigation, route }: any) => {
  const handleAccept = () => {
    if (route.params?.nextScreen === 'ChurchSearch') {
      navigation.navigate('ChurchSearch');
      return;
    }

    navigation.goBack();
  };

  return (
  <MidnightBackground>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}><Text style={styles.headerLabel}>LEGAL</Text><View style={styles.headerDivider} /><Text style={styles.title}>Terms of Service</Text></View>
        <View style={styles.contentContainer}>
          <GlassCard style={styles.card}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
              <Section number="1" title="Acceptance of Terms" content="By entering this digital sanctuary, you acknowledge and agree to abide by the principles of our community. Your journey with us is built upon mutual respect and spiritual integrity." />
              <Section number="2" title="User Conduct" content="Members are expected to engage with kindness and compassion. Harassment, divisive language, or any behavior that disrupts the tranquility of the Kingdom Pal environment is strictly prohibited." />
              <Section number="3" title="Sacred Use Guidelines" content="The resources, messages, and tools provided are for personal spiritual growth and communal edification. Reproduction or commercial redistribution of these sacred materials is not permitted without divine or administrative consent." />
              <Section number="4" title="Privacy & Grace" content="Your personal information is handled with the utmost reverence. We protect your data as we would a sacred trust, ensuring your journey remains private and secure." />
              <View style={{ height: 20 }} />
            </ScrollView>
            <View style={styles.cardFooter}><Text style={styles.footerQuote}>"This agreement supports our community and your journey."</Text><GoldButton title="ACCEPT TERMS" onPress={handleAccept} /></View>
          </GlassCard>
        </View>
      </View>
    </SafeAreaView>
  </MidnightBackground>
);
};

const Section = ({ number, title, content }: any) => (
  <View style={styles.section}><Text style={styles.sectionTitle}>{number}. {title.toUpperCase()}</Text><Text style={styles.sectionContent}>{content}</Text></View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', paddingTop: 40, marginBottom: 20 }, headerLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.antiqueGold, letterSpacing: 4, marginBottom: 8 }, headerDivider: { width: 48, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.3)', marginBottom: 16 }, title: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 30, color: 'white' },
  contentContainer: { flex: 1, marginBottom: 20 }, card: { flex: 1, backgroundColor: 'rgba(13, 27, 42, 0.4)', borderColor: 'rgba(229, 185, 95, 0.15)' },
  scrollView: { flex: 1 }, scrollContent: { paddingHorizontal: 24, paddingTop: 32 }, section: { marginBottom: 32 }, sectionTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 11, color: Colors.antiqueGold, letterSpacing: 2, marginBottom: 12 }, sectionContent: { fontFamily: 'Inter_300Light', fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', lineHeight: 22 },
  cardFooter: { padding: 24, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' }, footerQuote: { fontFamily: 'Inter_300Light', fontStyle: 'italic', fontSize: 10, color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', marginBottom: 24, letterSpacing: 1 },
});

export default TermsScreen;

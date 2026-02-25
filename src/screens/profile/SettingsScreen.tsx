import React, { useState } from 'react';
import { Alert, View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const SettingsScreen = ({ navigation }: any) => {
  const [reminders, setReminders] = useState(true);
  const [churchMessages, setChurchMessages] = useState(true);
  const [encouragement, setEncouragement] = useState(false);
  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}><Text style={styles.headerLabel}>SETTINGS</Text><View style={styles.headerDivider} /><Text style={styles.title}>Adjust your experience, not your formation.</Text></View>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Section title="FORMATION PREFERENCES">
              <TouchableOpacity style={styles.settingRow} onPress={() => Alert.alert('Themes', 'Additional themes will be available in a future update.')}><GlassCard style={styles.settingCard}><View style={styles.settingInfo}><Text style={styles.settingLabel}>Atmosphere</Text><Text style={styles.settingValue}>Midnight Reverence</Text></View><MaterialIcons name="chevron-right" size={24} color={Colors.antiqueGold} /></GlassCard></TouchableOpacity>
              <GlassCard style={styles.settingCard}><View style={styles.settingInfo}><Text style={styles.settingValue}>Gentle Reminders</Text><Text style={styles.settingHint}>Receive a quiet daily nudge to pause.</Text></View><Switch value={reminders} onValueChange={setReminders} trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(229, 185, 95, 0.4)' }} thumbColor={reminders ? Colors.antiqueGold : '#f4f3f4'} /></GlassCard>
              <Text style={styles.sectionInfo}>Your reflections remain private. You choose what to share.</Text>
            </Section>
            <Section title="CARE & COMMUNICATION">
              <GlassCard style={styles.settingCard}><Text style={styles.settingValue}>Church Messages</Text><Switch value={churchMessages} onValueChange={setChurchMessages} trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(229, 185, 95, 0.4)' }} thumbColor={churchMessages ? Colors.antiqueGold : '#f4f3f4'} /></GlassCard>
              <GlassCard style={styles.settingCard}><Text style={styles.settingValue}>Encouragement</Text><Switch value={encouragement} onValueChange={setEncouragement} trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(229, 185, 95, 0.4)' }} thumbColor={encouragement ? Colors.antiqueGold : '#f4f3f4'} /></GlassCard>
            </Section>
            <Section title="HELP & SUPPORT">
              <TouchableOpacity onPress={() => navigation.getParent()?.getParent()?.navigate('FAQ')}><GlassCard style={styles.settingCard}><Text style={styles.settingValue}>Get Help & FAQ</Text><MaterialIcons name="chevron-right" size={24} color={Colors.antiqueGold} /></GlassCard></TouchableOpacity>
            </Section>
            <Section title="ACCOUNT">
              <GlassCard style={styles.settingCard}><View style={styles.settingInfo}><Text style={styles.settingLabel}>Connected Church</Text><Text style={styles.settingValue}>Grace Fellowship</Text></View><TouchableOpacity onPress={() => navigation.getParent()?.getParent()?.navigate('Auth', { screen: 'ChurchSearch' })}><Text style={styles.changeText}>Change church</Text></TouchableOpacity></GlassCard>
              <View style={styles.signOutContainer}><View style={styles.signOutDivider} /><TouchableOpacity style={styles.signOutButton} onPress={() => navigation.getParent()?.getParent()?.navigate('Auth', { screen: 'Welcome' })}><GlassCard style={styles.signOutCard}><Text style={styles.signOutText}>Sign Out</Text></GlassCard></TouchableOpacity></View>
            </Section>
            <View style={styles.footer}><Text style={styles.footerQuote}>MKP supports your journey — your church leads it.</Text></View>
            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </MidnightBackground>
  );
};

const Section = ({ title, children }: any) => (
  <View style={styles.section}><Text style={styles.sectionHeader}>{title}</Text>{children}</View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 32, marginBottom: 24 }, headerLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.antiqueGold, letterSpacing: 4, marginBottom: 12 }, headerDivider: { width: 48, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.4)', marginBottom: 32 }, title: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 24, color: 'white', textAlign: 'center', lineHeight: 32 },
  scrollView: { flex: 1 }, scrollContent: { paddingHorizontal: 24 }, section: { marginBottom: 32, gap: 16 }, sectionHeader: { fontFamily: 'Inter_700Bold', fontSize: 9, color: 'rgba(229, 185, 95, 0.6)', letterSpacing: 3, paddingHorizontal: 8 },
  settingCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 20 }, settingRow: { width: '100%' }, settingInfo: { flex: 1 }, settingLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }, settingValue: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 17, color: 'white' }, settingHint: { fontFamily: 'Inter_300Light', fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', marginTop: 4 },
  sectionInfo: { fontFamily: 'Inter_300Light', fontStyle: 'italic', fontSize: 11, color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', paddingHorizontal: 16, lineHeight: 18 },
  changeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.antiqueGold, letterSpacing: 1, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: 'rgba(229, 185, 95, 0.2)' },
  signOutContainer: { alignItems: 'center', marginTop: 32 }, signOutDivider: { width: 64, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.3)', marginBottom: 40 }, signOutButton: { width: '100%', alignItems: 'center' }, signOutCard: { paddingVertical: 12, paddingHorizontal: 40, borderRadius: 12 }, signOutText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, color: 'rgba(255, 255, 255, 0.6)', letterSpacing: 2, textDecorationLine: 'underline' },
  footer: { marginTop: 20 }, footerQuote: { fontFamily: 'Inter_300Light', fontStyle: 'italic', fontSize: 10, color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', letterSpacing: 1 },
});

export default SettingsScreen;

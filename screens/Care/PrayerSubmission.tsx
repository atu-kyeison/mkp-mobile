import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, ScrollView, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';

export default function PrayerSubmission({ navigation }: any) {
  const [anonymous, setAnonymous] = useState(false);
  const [pastoralSupport, setPastoralSupport] = useState(false);
  const [request, setRequest] = useState('');

  const handleSharePrayer = () => {
    Alert.alert(
      'Prayer Submitted',
      'Your request has been received. A pastor will review it in the dashboard.',
      [
        { text: 'DONE', onPress: () => navigation.goBack() },
        {
          text: 'NEED MORE SUPPORT',
          onPress: () =>
            navigation.navigate('CareSupportRequest', {
              initialHelpType: 'A conversation with a pastor',
            }),
        },
      ]
    );
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.divider} />
            <Text style={styles.title}>How can we pray for you?</Text>
          </View>

          <GlassCard withGlow style={styles.inputCard}>
            <Text style={styles.cardLabel}>PRAYER REQUEST</Text>
            <TextInput
              style={styles.textInput}
              placeholder="What would you like prayer for today?"
              placeholderTextColor="rgba(255, 255, 255, 0.2)"
              multiline
              numberOfLines={5}
              value={request}
              onChangeText={setRequest}
            />
            <View style={styles.cardFooter}>
              <CustomButton title="SHARE PRAYER" onPress={handleSharePrayer} style={styles.submitButton} />
              <View style={styles.stars}>
                <Text style={styles.star}>★</Text>
                <Text style={styles.starLarge}>★</Text>
                <Text style={styles.star}>★</Text>
              </View>
            </View>
          </GlassCard>

          <View style={styles.togglesCard}>
            <GlassCard style={styles.innerCard}>
              <View style={styles.toggleRow}>
                <View style={styles.toggleLabelGroup}>
                  <Text style={styles.toggleTitle}>Post Anonymously</Text>
                  <Text style={styles.toggleSubtitle}>Your name won't be shown to the community</Text>
                </View>
                <Switch
                  value={anonymous}
                  onValueChange={setAnonymous}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(229, 185, 95, 0.4)' }}
                  thumbColor={anonymous ? Colors.accentGold : '#f4f3f4'}
                />
              </View>
              <View style={styles.separator} />
              <View style={styles.toggleRow}>
                <View style={styles.toggleLabelGroup}>
                  <Text style={styles.toggleTitle}>Request Pastoral Support</Text>
                  <Text style={styles.toggleSubtitle}>A leader will reach out to walk with you</Text>
                </View>
                <Switch
                  value={pastoralSupport}
                  onValueChange={setPastoralSupport}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(229, 185, 95, 0.4)' }}
                  thumbColor={pastoralSupport ? Colors.accentGold : '#f4f3f4'}
                />
              </View>
            </GlassCard>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Your community is here to hold you in prayer.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 19,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  inputCard: {
    padding: 28,
    minHeight: 280,
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    letterSpacing: 2,
    marginBottom: 24,
  },
  textInput: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 19,
    color: Colors.text,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  stars: {
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 0.4,
  },
  star: {
    color: Colors.accentGold,
    fontSize: 10,
  },
  starLarge: {
    color: Colors.accentGold,
    fontSize: 16,
  },
  togglesCard: {
    marginTop: 24,
  },
  innerCard: {
    padding: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabelGroup: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 20,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    maxWidth: 220,
    lineHeight: 20,
  },
});

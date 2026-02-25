import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';
import { openChurchMessage, openScriptureReference, speakWithTTS } from '../../constants/Actions';

export default function Wednesday({ navigation }: any) {
  const { height } = useWindowDimensions();
  const allowScroll = height < 820;

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} scrollEnabled={allowScroll}>
          <View style={styles.header}>
            <Text style={styles.topLabel}>TODAY'S FOCUS</Text>
            <View style={styles.divider} />
            <Text style={styles.italicLabel}>inner awareness</Text>
            <Text style={styles.greeting}>Good morning.</Text>
            <Text style={styles.date}>WEDNESDAY • SEPT 20</Text>
          </View>

          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.flex1}>
                <Text style={styles.cardLabel}>TODAY’S SCRIPTURE</Text>
                <Text style={styles.scriptureText}>“Search me, God, and know my heart…”</Text>
                <TouchableOpacity onPress={() => openScriptureReference('Psalm 139:23')}>
                  <Text style={styles.reference}>Psalm 139:23</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => speakWithTTS('Search me, God, and know my heart. Psalm 139:23')}
              >
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.flex1}>
                <Text style={styles.cardLabel}>FROM SUNDAY'S MESSAGE</Text>
                <Text style={styles.messageText}>Remaining in Christ reveals what striving hides.</Text>
              </View>
              <TouchableOpacity
                style={styles.listenButton}
                onPress={openChurchMessage}
              >
                <Text style={styles.listenIcon}>🎧</Text>
                <Text style={styles.listenText}>LISTEN</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          <GlassCard withGlow style={styles.practiceCard}>
            <Text style={styles.cardLabel}>TODAY’S INSIGHT</Text>
            <Text style={styles.practiceText}>
              Notice what is stirring beneath the surface today. God often meets us in what we are tempted to ignore.
            </Text>
            <CustomButton
              title="PAUSE & NOTICE"
              onPress={() =>
                navigation.navigate('Journey', {
                  screen: 'ReflectionEntry',
                  params: { journalVariant: 'mid_week', openMoodOnEntry: true },
                })
              }
              style={styles.roundedButton}
            />
          </GlassCard>

          <View style={styles.separator} />

          <GlassCard style={styles.prayerCard}>
            <View style={styles.prayerHeader}>
              <View style={styles.prayerIconContainer}>
                <Text style={styles.prayerIcon}>✨</Text>
              </View>
              <View style={styles.flex1}>
                <Text style={styles.cardLabel}>PRAYER</Text>
                <Text style={styles.prayerText}>God, help me see what I usually rush past. Give me courage to be honest with You.</Text>
              </View>
            </View>
          </GlassCard>
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
    marginBottom: 40,
  },
  topLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 4,
    marginBottom: 8,
  },
  divider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.3)',
    marginBottom: 8,
  },
  italicLabel: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 11,
    color: Colors.accentGold,
    letterSpacing: 2,
    marginBottom: 40,
  },
  greeting: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 1,
  },
  card: {
    marginBottom: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  flex1: {
    flex: 1,
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: 'rgba(229, 185, 95, 0.7)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  scriptureText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 28,
  },
  reference: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.referenceGold,
    textTransform: 'uppercase',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: Colors.accentGold,
    fontSize: 14,
    marginLeft: 2,
  },
  messageText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  listenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.1)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  listenIcon: {
    fontSize: 12,
    marginRight: 6,
    opacity: 0.6,
  },
  listenText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    textTransform: 'uppercase',
  },
  practiceCard: {
    padding: 24,
    marginBottom: 20,
  },
  practiceText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 19,
    fontWeight: '500',
    color: Colors.text,
    lineHeight: 28,
    marginBottom: 32,
  },
  roundedButton: {
    borderRadius: 999,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(229, 185, 95, 0.2)',
    marginVertical: 8,
    alignSelf: 'center',
  },
  prayerCard: {
    padding: 16,
    marginTop: 8,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(229, 185, 95, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  prayerIcon: {
    fontSize: 16,
    color: 'rgba(229, 185, 95, 0.6)',
  },
  prayerText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});

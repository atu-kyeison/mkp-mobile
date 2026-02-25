import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';

const MOOD_DETAILS: Record<string, { icon: keyof typeof MaterialIcons.glyphMap; title: string; description: string }> = {
  tired: {
    icon: 'dark-mode',
    title: 'Tired',
    description: 'You marked this moment as tired. Low energy is a signal for rest, not a demand for productivity. You were invited to exhale and trust God with your weariness.'
  },
  rushed: {
    icon: 'bolt',
    title: 'Rushed',
    description: 'You marked this moment as rushed. This posture highlights pace, not failure. You were invited to slow your heart and find a moment of unhurried grace.'
  },
  grateful: {
    icon: 'favorite',
    title: 'Grateful',
    description: 'You marked this moment as grateful. This posture amplifies your awareness of God’s presence. You were invited to rest in this lighthearted joy.'
  },
  peaceful: {
    icon: 'yard',
    title: 'Peaceful',
    description: 'You marked this moment as peaceful. In this receptive state, you were invited to notice grace and listen for the quiet voice of God.'
  },
  focused: {
    icon: 'center-focus-strong',
    title: 'Focused',
    description: 'You marked this moment as focused. Clarity and attention allowed your intentions to flow naturally. You were invited to walk purposefully in this alignment.'
  },
  anxious: {
    icon: 'waves',
    title: 'Anxious',
    description: 'You marked this moment as anxious. This mental noise is simply a cue for prayer and gentleness. You were invited to breathe deeply and remember you are held.'
  }
};

export const MoodDetailScreen = ({ navigation, route }: any) => {
  const moodId = route.params?.moodId || 'tired';
  const detail = MOOD_DETAILS[moodId] || MOOD_DETAILS.tired;
  const dateStr = route.params?.date || 'Friday • Sept 22';

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="rgba(229, 185, 95, 0.6)" />
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>PAST AWARENESS</Text>
          <View style={styles.divider} />
          <Text style={styles.date}>{dateStr}</Text>
        </View>

        <View style={styles.content}>
          <GlassCard variant="large" style={styles.detailCard}>
            <Text style={styles.cardSubtitle}>INNER POSTURE</Text>

            <View style={styles.iconContainer}>
              <MaterialIcons name={detail.icon} size={72} color={Colors.accentGold} style={styles.icon} />
            </View>

            <Text style={styles.title}>{detail.title}</Text>
            <Text style={styles.description}>{detail.description}</Text>

            <TouchableOpacity style={styles.journalButton}>
              <MaterialIcons name="history-edu" size={24} color={Colors.accentGold} />
              <Text style={styles.journalButtonText}>JOURNAL ENTRY</Text>
            </TouchableOpacity>
          </GlassCard>

          <View style={styles.footerNoteContainer}>
            <Text style={styles.footerNote}>Part of your weekly rhythm</Text>
          </View>
        </View>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  headerSubtitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 4,
    marginBottom: 12,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 24,
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  detailCard: {
    width: '100%',
    alignItems: 'center',
    padding: 40,
  },
  cardSubtitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: Colors.accentGold,
    letterSpacing: 3,
    marginBottom: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  icon: {
    opacity: 0.9,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  description: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  journalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 240,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.accentGold,
    backgroundColor: 'rgba(13, 27, 42, 0.5)',
    gap: 12,
  },
  journalButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 12,
    color: Colors.accentGold,
    letterSpacing: 2.5,
  },
  footerNoteContainer: {
    marginTop: 32,
    opacity: 0.4,
  },
  footerNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
});

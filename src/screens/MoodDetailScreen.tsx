import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';

const MOOD_DETAILS: Record<string, { icon: keyof typeof MaterialIcons.glyphMap; titleKey: string; descriptionKey: string }> = {
  tired: {
    icon: 'dark-mode',
    titleKey: 'moodDetail.title.tired',
    descriptionKey: 'moodDetail.desc.tired',
  },
  rushed: {
    icon: 'bolt',
    titleKey: 'moodDetail.title.rushed',
    descriptionKey: 'moodDetail.desc.rushed',
  },
  grateful: {
    icon: 'favorite',
    titleKey: 'moodDetail.title.grateful',
    descriptionKey: 'moodDetail.desc.grateful',
  },
  peaceful: {
    icon: 'yard',
    titleKey: 'moodDetail.title.peaceful',
    descriptionKey: 'moodDetail.desc.peaceful',
  },
  focused: {
    icon: 'center-focus-strong',
    titleKey: 'moodDetail.title.focused',
    descriptionKey: 'moodDetail.desc.focused',
  },
  anxious: {
    icon: 'waves',
    titleKey: 'moodDetail.title.anxious',
    descriptionKey: 'moodDetail.desc.anxious',
  }
};

export const MoodDetailScreen = ({ navigation, route }: any) => {
  const { t } = useI18n();
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
          <Text style={styles.headerSubtitle}>{t('moodDetail.subtitle')}</Text>
          <View style={styles.divider} />
          <Text style={styles.date}>{dateStr}</Text>
        </View>

        <View style={styles.content}>
          <GlassCard variant="large" style={styles.detailCard}>
            <Text style={styles.cardSubtitle}>{t('moodDetail.innerPosture')}</Text>

            <View style={styles.iconContainer}>
              <MaterialIcons name={detail.icon} size={72} color={Colors.accentGold} style={styles.icon} />
            </View>

            <Text style={styles.title}>{t(detail.titleKey)}</Text>
            <Text style={styles.description}>{t(detail.descriptionKey)}</Text>

            <TouchableOpacity
              style={styles.journalButton}
              onPress={() =>
                navigation.navigate('ReflectionEntry', {
                  journalVariant: 'mid_week',
                  fromMoodDetail: true,
                })
              }
              >
              <MaterialIcons name="history-edu" size={24} color={Colors.accentGold} />
              <Text style={styles.journalButtonText}>{t('moodDetail.journalEntry')}</Text>
            </TouchableOpacity>
          </GlassCard>

          <View style={styles.footerNoteContainer}>
            <Text style={styles.footerNote}>{t('moodDetail.footer')}</Text>
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

import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { Colors } from '../../constants/Colors';
import { useI18n } from '../i18n/I18nProvider';
import { deleteJournalEntry } from '../storage/journalStore';

export const ReflectionDetailScreen = ({ navigation, route }: any) => {
  const { t, locale } = useI18n();
  const insets = useSafeAreaInsets();
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';
  const date =
    route.params?.date ||
    new Date().toLocaleDateString(localeTag, { weekday: 'long', month: 'short', day: 'numeric' }).replace(',', ' -').toUpperCase();
  const invitation = route.params?.invitation || '';
  const content = route.params?.content || '';
  const mood = route.params?.mood;
  const fromSunday = route.params?.fromSunday ?? false;
  const entryId = route.params?.entryId as string | undefined;

  const handleEdit = () => {
    if (!entryId) return;
    navigation.navigate('ReflectionEntry', {
      editEntryId: entryId,
      initialContent: content,
      initialInvitation: invitation,
      mood,
      journalVariant: route.params?.journalVariant || 'mid_week',
    });
  };

  const handleDelete = () => {
    if (!entryId) return;
    Alert.alert(
      t('reflection.detail.deleteTitle'),
      t('reflection.detail.deleteBody'),
      [
        { text: t('reflection.detail.cancel'), style: 'cancel' },
        {
          text: t('reflection.detail.delete'),
          style: 'destructive',
          onPress: () => {
            deleteJournalEntry(entryId);
            navigation.navigate('JourneyHistory');
          },
        },
      ]
    );
  };

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={24} color={Colors.accentGold} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('reflection.detail.title')}</Text>
          <View style={styles.backSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.metaRow}>
            <Text style={styles.dateText}>{date}</Text>
            {fromSunday ? (
              <View style={styles.sundayPill}>
                <View style={styles.sundayDot} />
                <Text style={styles.sundayPillText}>{t('reflection.detail.sundayMessage')}</Text>
              </View>
            ) : null}
          </View>

          <GlassCard style={styles.invitationCard}>
            <Text style={styles.sectionLabel}>{t('reflection.detail.invitation')}</Text>
            <Text style={styles.invitationText}>{invitation || '—'}</Text>
          </GlassCard>

          <GlassCard style={styles.wordsCard}>
            <Text style={styles.sectionLabel}>{t('reflection.detail.words')}</Text>
            <Text style={styles.wordsText}>{content || t('reflection.detail.empty')}</Text>
            {mood ? (
              <View style={styles.moodPill}>
                <Text style={styles.moodEmoji}>🌿</Text>
                <Text style={styles.moodText}>{mood}</Text>
              </View>
            ) : null}
          </GlassCard>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: 96 + insets.bottom }]}>
          {entryId ? (
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEdit}>
                <Text style={styles.editButtonText}>{t('reflection.detail.edit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>{t('reflection.detail.delete')}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <TouchableOpacity style={styles.backToJourneyButton} onPress={() => navigation.navigate('JourneyHistory')}>
            <Text style={styles.backToJourneyText}>{t('reflection.detail.backToJourney')}</Text>
          </TouchableOpacity>
          <Text style={styles.privacyText}>
            {t('reflection.privacy')}
          </Text>
        </View>
      </SafeAreaView>
    </BackgroundGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(13, 27, 42, 0.75)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backButton: { width: 30, alignItems: 'flex-start' },
  backSpacer: { width: 30 },
  headerTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 11, letterSpacing: 6, color: Colors.accentGold },
  scrollContent: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 190, gap: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  dateText: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 2.5, color: Colors.accentGold },
  sundayPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sundayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(229,185,95,0.6)' },
  sundayPillText: { fontFamily: 'Inter_400Regular', fontSize: 11, letterSpacing: 1, color: 'rgba(255,255,255,0.62)' },
  invitationCard: { padding: 20, borderRadius: 28 },
  sectionLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 3, color: Colors.accentGold, marginBottom: 12 },
  invitationText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 18, lineHeight: 30, color: 'rgba(255,255,255,0.92)' },
  wordsCard: { padding: 20, borderRadius: 28, minHeight: 250 },
  wordsText: { fontFamily: 'Inter_300Light', fontSize: 16, lineHeight: 47, color: 'rgba(255,255,255,0.82)', marginBottom: 24 },
  moodPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodEmoji: { fontSize: 22 },
  moodText: { fontFamily: 'Inter_400Regular', fontSize: 17, color: 'rgba(255,255,255,0.86)' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: 'rgba(28, 34, 48, 0.9)',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  editButton: {
    borderColor: 'rgba(229,185,95,0.45)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  editButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.accentGold,
  },
  deleteButton: {
    borderColor: 'rgba(217,123,102,0.5)',
    backgroundColor: 'rgba(217,123,102,0.08)',
  },
  deleteButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    letterSpacing: 2,
    color: '#D97B66',
  },
  backToJourneyButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(229,185,95,0.45)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 12,
  },
  backToJourneyText: { fontFamily: 'Cinzel_700Bold', fontSize: 13, letterSpacing: 4, color: Colors.accentGold },
  privacyText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center' },
});

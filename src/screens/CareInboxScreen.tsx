import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { useAppDataSync } from '../backend/appData';
import { useI18n } from '../i18n/I18nProvider';
import { CARE_SUPPORT_CATEGORIES } from '../care/supportCategories';
import { CareThread, getCareThreads } from '../storage/careInboxStore';

export const CareInboxScreen = ({ navigation }: any) => {
  const { t, locale } = useI18n();
  const { syncCareInbox } = useAppDataSync();
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';
  const [threads, setThreads] = useState<CareThread[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const load = async () => {
        try {
          await syncCareInbox();
        } catch {
          // Fall back to the locally cached inbox.
        } finally {
          if (!cancelled) {
            setThreads(getCareThreads());
          }
        }
      };
      void load();
      return () => {
        cancelled = true;
      };
    }, [syncCareInbox])
  );

  const categoryLabel = useCallback(
    (categoryId: CareThread['categoryId']) =>
      t(CARE_SUPPORT_CATEGORIES.find((category) => category.id === categoryId)?.labelKey || 'care.support.type.other'),
    [t]
  );

  const unreadCount = useMemo(
    () => threads.filter((thread) => thread.churchReplyCount > 0 && !thread.readAt).length,
    [threads]
  );

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={28} color={Colors.accentGold} />
          </TouchableOpacity>
          <Text style={styles.kicker}>{t('care.header')}</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>{t('care.inbox.title')}</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? locale === 'es'
                ? `Tienes ${unreadCount} hilo${unreadCount === 1 ? '' : 's'} con actividad nueva.`
                : `You have ${unreadCount} thread${unreadCount === 1 ? '' : 's'} with new activity.`
              : t('care.inbox.subtitle')}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {threads.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>{t('care.inbox.emptyTitle')}</Text>
              <Text style={styles.emptyBody}>{t('care.inbox.emptyBody')}</Text>
            </GlassCard>
          ) : (
            threads.map((thread) => (
              <TouchableOpacity
                key={thread.id}
                onPress={() => navigation.navigate('CareThread', { threadId: thread.id })}
              >
                <GlassCard style={styles.threadCard}>
                  <View style={styles.threadHeader}>
                    <Text style={styles.threadCategory}>{categoryLabel(thread.categoryId)}</Text>
                    <View style={[styles.statusBadge, thread.status === 'closed' ? styles.statusClosed : styles.statusAwaiting]}>
                      <Text style={styles.statusText}>
                        {thread.status === 'closed' ? t('care.inbox.status.closed') : t('care.inbox.status.awaiting')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.threadDate}>
                    {new Date(thread.updatedAt).toLocaleDateString(localeTag, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    }).toUpperCase()}
                  </Text>
                  <Text style={styles.threadPreview} numberOfLines={3}>
                    {thread.requestPreview}
                  </Text>
                  <View style={styles.threadFooter}>
                    <Text style={styles.threadMeta}>
                      {thread.preferredChannel === 'in_app' ? t('care.support.contact.inapp') : t('care.support.contact.email')}
                    </Text>
                    <View style={styles.threadAction}>
                      {thread.churchReplyCount > 0 && !thread.readAt ? <View style={styles.unreadDot} /> : null}
                      <MaterialIcons name="chevron-right" size={18} color="rgba(229,185,95,0.46)" />
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 14, paddingHorizontal: 24, marginBottom: 18 },
  backButton: {
    position: 'absolute',
    left: 12,
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.accentGold, letterSpacing: 4, marginBottom: 4 },
  divider: { width: 48, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.4)', marginBottom: 10 },
  title: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 28, color: Colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.62)', textAlign: 'center', lineHeight: 20, maxWidth: 280 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 140, gap: 14 },
  emptyCard: { padding: 26, borderRadius: 24, alignItems: 'center' },
  emptyTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 24, color: Colors.text, textAlign: 'center', marginBottom: 10 },
  emptyBody: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  threadCard: { padding: 18, borderRadius: 24, marginBottom: 14, backgroundColor: 'rgba(13, 27, 42, 0.62)' },
  threadHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 },
  threadCategory: { flex: 1, fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 2, color: Colors.accentGold, textTransform: 'uppercase' },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  statusAwaiting: { borderColor: 'rgba(229,185,95,0.18)', backgroundColor: 'rgba(229,185,95,0.08)' },
  statusClosed: { borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)' },
  statusText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.74)', textTransform: 'uppercase', letterSpacing: 1.4 },
  threadDate: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.42)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  threadPreview: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 17, lineHeight: 27, color: 'rgba(255,255,255,0.88)', marginBottom: 16 },
  threadFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  threadMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(229,185,95,0.74)', textTransform: 'uppercase', letterSpacing: 1.5 },
  threadAction: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accentGold },
});

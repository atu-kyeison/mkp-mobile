import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';
import { CARE_SUPPORT_CATEGORIES } from '../care/supportCategories';
import { getCareThreadById, markCareThreadRead } from '../storage/careInboxStore';

export const CareThreadScreen = ({ navigation, route }: any) => {
  const { t, locale } = useI18n();
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';
  const threadId = route.params?.threadId as string | undefined;
  const thread = useMemo(() => (threadId ? getCareThreadById(threadId) : null), [threadId]);

  React.useEffect(() => {
    if (threadId) {
      markCareThreadRead(threadId);
    }
  }, [threadId]);

  const categoryLabel = useMemo(
    () => t(CARE_SUPPORT_CATEGORIES.find((category) => category.id === thread?.categoryId)?.labelKey || 'care.support.type.other'),
    [thread?.categoryId, t]
  );

  if (!thread) {
    return (
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={28} color={Colors.accentGold} />
            </TouchableOpacity>
          </View>
          <View style={styles.emptyWrap}>
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>{t('care.thread.missingTitle')}</Text>
              <Text style={styles.emptyBody}>{t('care.thread.missingBody')}</Text>
            </GlassCard>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={28} color={Colors.accentGold} />
          </TouchableOpacity>
          <Text style={styles.kicker}>{t('care.header')}</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>{categoryLabel}</Text>
          <Text style={styles.subtitle}>
            {new Date(thread.createdAt).toLocaleDateString(localeTag, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {thread.messages.map((message) => {
            const isChurch = message.sender === 'church';
            return (
              <View key={message.id} style={[styles.messageRow, isChurch ? styles.messageRowChurch : styles.messageRowMember]}>
                <GlassCard style={StyleSheet.flatten([styles.messageCard, isChurch ? styles.messageCardChurch : styles.messageCardMember])}>
                  <Text style={styles.messageSender}>
                    {isChurch ? t('care.thread.sender.church') : t('care.thread.sender.you')}
                  </Text>
                  <Text style={styles.messageBody}>{message.body}</Text>
                </GlassCard>
              </View>
            );
          })}

          <GlassCard style={styles.statusCard}>
            <Text style={styles.statusTitle}>
              {thread.churchReplyCount >= thread.maxChurchReplies
                ? t('care.thread.status.closedTitle')
                : t('care.thread.status.awaitingTitle')}
            </Text>
            <Text style={styles.statusBody}>
              {thread.churchReplyCount >= thread.maxChurchReplies
                ? t('care.thread.status.closedBody')
                : t('care.thread.status.awaitingBody')}
            </Text>
            <Text style={styles.statusMeta}>{t('care.thread.oneReplyRule')}</Text>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 14, paddingHorizontal: 24, marginBottom: 18 },
  backButton: { position: 'absolute', left: 12, top: 4, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.accentGold, letterSpacing: 4, marginBottom: 4 },
  divider: { width: 48, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.4)', marginBottom: 10 },
  title: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 28, color: Colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.62)', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 140, gap: 14 },
  messageRow: { width: '100%', marginBottom: 14 },
  messageRowMember: { alignItems: 'flex-start' },
  messageRowChurch: { alignItems: 'flex-end' },
  messageCard: { maxWidth: '88%', padding: 16, borderRadius: 22 },
  messageCardMember: { backgroundColor: 'rgba(13, 27, 42, 0.68)' },
  messageCardChurch: { backgroundColor: 'rgba(229,185,95,0.12)', borderColor: 'rgba(229,185,95,0.28)' },
  messageSender: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.accentGold, letterSpacing: 1.8, marginBottom: 8, textTransform: 'uppercase' },
  messageBody: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 24, color: 'rgba(255,255,255,0.88)' },
  statusCard: { padding: 18, borderRadius: 22, marginTop: 8 },
  statusTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 22, color: Colors.text, textAlign: 'center', marginBottom: 10 },
  statusBody: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: 'rgba(255,255,255,0.72)', textAlign: 'center', marginBottom: 12 },
  statusMeta: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.6, color: 'rgba(229,185,95,0.72)', textAlign: 'center', textTransform: 'uppercase' },
  emptyWrap: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  emptyCard: { padding: 24, borderRadius: 24, alignItems: 'center' },
  emptyTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 24, color: Colors.text, textAlign: 'center', marginBottom: 12 },
  emptyBody: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: 'rgba(255,255,255,0.72)', textAlign: 'center' },
});

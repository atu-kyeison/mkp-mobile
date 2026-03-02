import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';
import { getCommunicationPrefs } from '../storage/communicationPrefsStore';
import { getChurchMessages } from '../storage/churchMessagesStore';

export const ChurchMessagesScreen = ({ navigation }: any) => {
  const { t, locale } = useI18n();
  const prefs = useMemo(() => getCommunicationPrefs(), []);
  const messages = useMemo(() => getChurchMessages(locale), [locale]);
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={28} color={Colors.accentGold} />
          </TouchableOpacity>
          <Text style={styles.kicker}>{t('care.header')}</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>{t('churchMessages.title')}</Text>
          <Text style={styles.subtitle}>{t('churchMessages.subtitle')}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!prefs.churchMessages ? (
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>{t('churchMessages.offTitle')}</Text>
              <Text style={styles.emptyBody}>{t('churchMessages.offBody')}</Text>
            </GlassCard>
          ) : (
            messages.map((message) => (
              <TouchableOpacity
                key={message.id}
                onPress={() => navigation.navigate('ChurchMessageDetail', { message })}
              >
                <GlassCard style={styles.messageCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.messageKind}>{t(`churchMessages.kind.${message.kind}`)}</Text>
                    <MaterialIcons name="chevron-right" size={18} color="rgba(229,185,95,0.46)" />
                  </View>
                  <Text style={styles.messageTitle}>{message.title}</Text>
                  <Text style={styles.messageDate}>
                    {new Date(message.createdAt).toLocaleDateString(localeTag, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    }).toUpperCase()}
                  </Text>
                  <Text style={styles.messageBody} numberOfLines={3}>{message.body}</Text>
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
  backButton: { position: 'absolute', left: 12, top: 4, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  kicker: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.accentGold, letterSpacing: 4, marginBottom: 4 },
  divider: { width: 48, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.4)', marginBottom: 10 },
  title: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 28, color: Colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.62)', textAlign: 'center', lineHeight: 20, maxWidth: 300 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 140, gap: 14 },
  emptyCard: { padding: 26, borderRadius: 24, alignItems: 'center' },
  emptyTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 24, color: Colors.text, textAlign: 'center', marginBottom: 10 },
  emptyBody: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  messageCard: { padding: 18, borderRadius: 24, marginBottom: 14, backgroundColor: 'rgba(13, 27, 42, 0.62)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  messageKind: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 2, color: Colors.accentGold, textTransform: 'uppercase', marginBottom: 10 },
  messageTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 22, color: Colors.text, marginBottom: 8 },
  messageDate: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.42)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 },
  messageBody: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 24, color: 'rgba(255,255,255,0.82)' },
});

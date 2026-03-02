import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';

export const ChurchMessageDetailScreen = ({ navigation, route }: any) => {
  const { t, locale } = useI18n();
  const message = route?.params?.message;
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';

  if (!message) {
    return (
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={28} color={Colors.accentGold} />
            </TouchableOpacity>
          </View>
          <View style={styles.centerWrap}>
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>{t('churchMessages.missingTitle')}</Text>
              <Text style={styles.emptyBody}>{t('churchMessages.missingBody')}</Text>
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
          <Text style={styles.title}>{message.title}</Text>
          <Text style={styles.subtitle}>
            {new Date(message.createdAt).toLocaleDateString(localeTag, {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.messageCard}>
            <Text style={styles.kind}>{t(`churchMessages.kind.${message.kind}`)}</Text>
            <Text style={styles.body}>{message.body}</Text>
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 140 },
  messageCard: { padding: 22, borderRadius: 24 },
  kind: { fontFamily: 'Cinzel_700Bold', fontSize: 10, letterSpacing: 2, color: Colors.accentGold, textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' },
  body: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 27, color: 'rgba(255,255,255,0.86)' },
  centerWrap: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  emptyCard: { padding: 24, borderRadius: 24, alignItems: 'center' },
  emptyTitle: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 24, color: Colors.text, textAlign: 'center', marginBottom: 12 },
  emptyBody: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, color: 'rgba(255,255,255,0.72)', textAlign: 'center' },
});

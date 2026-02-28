import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';
import { useI18n } from '../i18n/I18nProvider';

export const TechnicalSupportScreen = ({ navigation }: any) => {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const handleSend = () => {
    Alert.alert(
      t('support.alert.title'),
      t('support.alert.body'),
      [{ text: t('common.ok') }]
    );
    setMessage('');
  };

  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color="rgba(229, 185, 95, 0.6)" />
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>{t('support.header')}</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>{t('support.title')}</Text>
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.messageCard}>
            <Text style={styles.cardSubtitle}>{t('support.messageLabel')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('support.placeholder')}
              placeholderTextColor="#64748b"
              multiline
              value={message}
              onChangeText={setMessage}
            />
          </GlassCard>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>{t('support.send')}</Text>
          </TouchableOpacity>

          <GlassCard style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqItem}
              onPress={() => navigation.navigate('FAQ')}
            >
              <Text style={styles.faqText}>{t('support.faq')}</Text>
              <MaterialIcons name="chevron-right" size={20} color={Colors.accentGold} style={styles.faqIcon} />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity
              style={styles.faqItem}
              onPress={() => navigation.navigate('Guidelines')}
            >
              <Text style={styles.faqText}>{t('support.guidelines')}</Text>
              <MaterialIcons name="chevron-right" size={20} color={Colors.accentGold} style={styles.faqIcon} />
            </TouchableOpacity>
          </GlassCard>

          <Text style={styles.footerNote}>
            {t('support.footer')}
          </Text>
        </ScrollView>
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
    marginBottom: 24,
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
    width: 40,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 30,
    color: '#FFFFFF',
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '300',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  messageCard: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: 'rgba(13, 27, 42, 0.65)',
    marginBottom: 16,
  },
  cardSubtitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: Colors.accentGold,
    letterSpacing: 3,
    marginBottom: 16,
  },
  input: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 18,
    color: '#FFFFFF',
    height: 160,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: '100%',
    height: 58,
    backgroundColor: Colors.accentGold,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 8,
  },
  sendButtonText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    color: Colors.backgroundDark,
    letterSpacing: 2.5,
  },
  faqCard: {
    borderRadius: 24,
    backgroundColor: 'rgba(13, 27, 42, 0.65)',
    padding: 0,
    overflow: 'hidden',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  faqText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
  },
  faqIcon: {
    opacity: 0.6,
  },
  itemDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerNote: {
    fontFamily: 'Newsreader_400Regular',
    fontStyle: 'italic',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    marginTop: 32,
  },
});

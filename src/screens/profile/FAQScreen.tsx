import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useI18n } from '../../i18n/I18nProvider';

const FAQScreen = ({ navigation }: any) => {
  const { t } = useI18n();

  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={24} color={Colors.antiqueGold} />
            </TouchableOpacity>
            <Text style={styles.headerLabel}>{t('support.header')}</Text>
            <View style={styles.headerDivider} />
            <Text style={styles.title}>{t('faq.title')}</Text>
          </View>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <FAQItem question={t('faq.q1')} answer={t('faq.a1')} />
            <FAQItem question={t('faq.q2')} answer={t('faq.a2')} />
            <FAQItem question={t('faq.q3')} answer={t('faq.a3')} />
            <FAQItem question={t('faq.q4')} answer={t('faq.a4')} />
            <View style={styles.footer}>
              <Text style={styles.footerHint}>{t('faq.footerHint')}</Text>
              <TouchableOpacity style={styles.supportButton} onPress={() => navigation.navigate('Main', { screen: 'Profile', params: { screen: 'TechnicalSupport' } })}>
                <Text style={styles.supportButtonText}>{t('faq.supportCta')}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </MidnightBackground>
  );
};

const FAQItem = ({ question, answer }: any) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <GlassCard style={styles.faqCard}>
      <TouchableOpacity style={styles.faqHeader} onPress={() => setIsOpen(!isOpen)} activeOpacity={0.7}><Text style={styles.question}>{question}</Text><MaterialIcons name={isOpen ? "expand-less" : "expand-more"} size={24} color="rgba(229, 185, 95, 0.4)" /></TouchableOpacity>
      {isOpen && <View style={styles.faqContent}><Text style={styles.answer}>{answer}</Text></View>}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32, marginBottom: 32, position: 'relative' }, backButton: { position: 'absolute', left: 24, top: 60 }, headerLabel: { fontFamily: 'Cinzel_700Bold', fontSize: 10, color: Colors.antiqueGold, letterSpacing: 4, marginBottom: 12 }, headerDivider: { width: 40, height: 1, backgroundColor: 'rgba(229, 185, 95, 0.4)', marginBottom: 20 }, title: { fontFamily: 'PlayfairDisplay_400Regular', fontStyle: 'italic', fontSize: 30, color: 'white', textAlign: 'center', lineHeight: 38 },
  scrollView: { flex: 1 }, scrollContent: { paddingHorizontal: 24, gap: 16 },
  faqCard: { borderRadius: 28, backgroundColor: 'rgba(13, 27, 42, 0.45)', borderColor: 'rgba(229, 185, 95, 0.15)' }, faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 24 }, question: { flex: 1, fontFamily: 'PlayfairDisplay_400Regular', fontSize: 18, color: Colors.antiqueGold, paddingRight: 16, lineHeight: 22 }, faqContent: { paddingHorizontal: 24, paddingBottom: 24 }, answer: { fontFamily: 'Inter_300Light', fontSize: 15, color: '#94a3b8', lineHeight: 22 },
  footer: { marginTop: 16, alignItems: 'center' }, footerHint: { fontFamily: 'Inter_300Light', fontStyle: 'italic', fontSize: 14, color: 'rgba(255, 255, 255, 0.3)' }, supportButton: { marginTop: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(229, 185, 95, 0.3)', paddingBottom: 4 }, supportButtonText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, color: Colors.antiqueGold, letterSpacing: 2 },
});

export default FAQScreen;

import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { openChurchMessage, openScriptureReference } from '../../constants/Actions';
import { useI18n } from '../../src/i18n/I18nProvider';

export default function Sunday({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { locale } = useI18n();
  const localeTag = locale === 'es' ? 'es-ES' : 'en-US';
  const topLabel = new Date()
    .toLocaleDateString(localeTag, { weekday: 'long', month: 'short', day: 'numeric' })
    .replace(',', ' •');
  const isEs = locale === 'es';
  const copy = isEs
    ? {
        sermonTitle: 'La Vid y los Pámpanos',
        sermonPart: 'Parte 1',
        scriptureRef: 'Juan 15:1-8',
        preacherName: 'Pastor Elias Vance',
        churchName: 'Grace Fellowship',
        listen: '🔊 Escuchar el mensaje de esta semana',
        recapLabel: 'Resumen del domingo',
        recapParagraphs: [
          'El pastor predicó sobre lo que significa permanecer en Cristo en lugar de vivir desde el esfuerzo o la autosuficiencia. Juan 15 nos recuerda que el fruto espiritual no nace de una presión interna, sino de una unión continua con Jesús, la Vid verdadera.',
          'La invitación del sermón fue sencilla y profunda: quedarse cerca. La poda, la espera y la dependencia no son señales de abandono, sino parte de la obra amorosa de Dios para formar un pueblo que refleje su vida. El llamado de hoy no es producir para Dios, sino permanecer con Él.',
        ],
        keyTruths: 'Verdades clave',
        truths: [
          'Soy una rama, diseñada para depender de la Vid Verdadera.',
          'El fruto espiritual crece desde la cercanía con Cristo, no desde la presión por rendir.',
          'La poda no es castigo; a menudo es la forma en que Dios prepara una mayor fidelidad.',
          'Permanecer requiere atención, confianza y disposición para quedarme donde Dios me está formando.',
          'Separado de Jesús, mis esfuerzos se secan; en Él, mi vida recibe sustento y propósito.',
          'El descanso en Cristo no detiene la formación; la profundiza.',
        ],
        scriptureSection: 'Escritura',
        scriptures: [
          {
            quote: '“Permanezcan en mí, y yo en ustedes. Así como la rama no puede dar fruto por sí misma…”',
            reference: 'Juan 15:4',
          },
          {
            quote: '“Es como árbol plantado junto a corrientes de agua, que da su fruto…”',
            reference: 'Salmo 1:2-3',
          },
        ],
        identityLabel: 'Descanso e identidad',
        identityMain:
          'Que hoy descanses sabiendo que tu identidad está segura en el Amado. Eres sostenido, conocido y amado.',
        footer: 'La formación comienza mañana.',
      }
    : {
        sermonTitle: 'The Vine and the Branches',
        sermonPart: 'Part 1',
        scriptureRef: 'John 15:1-8',
        preacherName: 'Pastor Elias Vance',
        churchName: 'Grace Fellowship',
        listen: '🔊 Listen to This Week’s Message',
        recapLabel: 'Sunday Recap',
        recapParagraphs: [
          'Pastor preached on what it means to abide in Christ rather than live from striving or self-sufficiency. John 15 reminds us that spiritual fruit does not come from internal pressure, but from a living union with Jesus, the true Vine.',
          'The invitation of the sermon was simple and searching: stay near. Pruning, waiting, and dependence are not signs of abandonment, but part of God’s loving work in forming a people who reflect His life. The call for today is not to produce for God, but to remain with Him.',
        ],
        keyTruths: 'Key Truths',
        truths: [
          'I am a branch, designed for dependence upon the True Vine.',
          'Spiritual fruit grows from nearness to Christ, not pressure to perform.',
          'Pruning is not punishment; it is often how God prepares deeper faithfulness.',
          'Abiding requires attention, trust, and a willingness to stay where God is forming me.',
          'Apart from Jesus, my efforts dry out; in Him, my life is sustained and given purpose.',
          'Resting in Christ does not interrupt formation; it deepens it.',
        ],
        scriptureSection: 'Scripture',
        scriptures: [
          {
            quote: '"Abide in me, and I in you. As the branch cannot bear fruit by itself..."',
            reference: 'John 15:4',
          },
          {
            quote: '"He is like a tree planted by streams of water that yields its fruit..."',
            reference: 'Psalm 1:2-3',
          },
        ],
        identityLabel: 'Rest & Identity',
        identityMain:
          'May you find rest tonight knowing your identity is secure in the Beloved. You are held, you are known, and you are cherished.',
        footer: 'Formation begins tomorrow.',
      };
  return (
    <GradientBackground variant="sacred" style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 140 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.topLabel}>{topLabel}</Text>
            <Text style={styles.title}>{copy.sermonTitle}</Text>
            <Text style={styles.subtitle}>{copy.sermonPart}</Text>
            <TouchableOpacity onPress={() => openScriptureReference(copy.scriptureRef)}>
              <Text style={styles.scriptureRef}>{copy.scriptureRef}</Text>
            </TouchableOpacity>
            <Text style={styles.pastorInfo}>{copy.preacherName}</Text>
            <Text style={styles.churchInfo}>{copy.churchName}</Text>

            <TouchableOpacity
              style={styles.listenLink}
              onPress={() => openChurchMessage()}
            >
              <Text style={styles.listenLinkText}>{copy.listen}</Text>
            </TouchableOpacity>

            <GlassCard style={styles.recapCard}>
              <Text style={styles.recapLabel}>{copy.recapLabel}</Text>
              <View style={styles.recapParagraphList}>
                {copy.recapParagraphs.map((paragraph) => (
                  <Text key={paragraph} style={styles.recapText}>{paragraph}</Text>
                ))}
              </View>
            </GlassCard>
          </View>

          <View style={styles.truthsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.glowLine} />
              <Text style={styles.sectionTitle}>{copy.keyTruths}</Text>
              <View style={styles.glowLine} />
            </View>

            <View style={styles.truthsGrid}>
              {copy.truths.map((truth) => (
                <GlassCard key={truth} style={styles.truthFull}>
                  <View style={styles.truthDot} />
                  <Text style={styles.truthText}>{truth}</Text>
                </GlassCard>
              ))}
            </View>
          </View>

          <View style={styles.scriptureSection}>
            <GlassCard style={styles.scriptureOuter}>
              <Text style={styles.scriptureSectionLabel}>{copy.scriptureSection}</Text>
              <View style={styles.scriptureList}>
                {copy.scriptures.map((entry) => (
                  <View key={`${entry.reference}-${entry.quote}`} style={styles.scriptureItem}>
                    <Text style={styles.bookIcon}>📖</Text>
                    <Text style={styles.scriptureQuote}>{entry.quote}</Text>
                    <TouchableOpacity onPress={() => openScriptureReference(entry.reference)}>
                      <Text style={styles.scriptureReference}>{entry.reference}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </GlassCard>
          </View>

          <GlassCard style={styles.identitySection}>
            <View style={styles.glowDivider} />
            <Text style={styles.identityLabel}>{copy.identityLabel}</Text>
            <Text style={styles.identityMainText}>{copy.identityMain}</Text>
            <View style={styles.glowDivider} />
          </GlassCard>

          <View style={styles.footer}>
            <Text style={styles.footerLabel}>{copy.footer}</Text>
          </View>
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
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  topLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 30,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.subtleSlate,
    letterSpacing: 1,
    marginBottom: 4,
  },
  scriptureRef: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.accentGold,
    marginBottom: 4,
  },
  pastorInfo: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(148, 163, 184, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  churchInfo: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: 'rgba(148, 163, 184, 0.75)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  listenLink: {
    marginBottom: 20,
  },
  listenLinkText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    textAlign: 'center',
  },
  recapCard: {
    width: '100%',
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  recapLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: Colors.accentGold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  recapParagraphList: {
    gap: 12,
  },
  recapText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    textAlign: 'left',
  },
  truthsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  glowLine: {
    height: 1,
    width: 24,
    backgroundColor: 'rgba(229, 185, 95, 0.3)',
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  truthsGrid: {
    gap: 10,
  },
  truthFull: {
    width: '100%',
    padding: 18,
    alignItems: 'center',
  },
  truthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentGold,
    marginBottom: 12,
    alignSelf: 'center',
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  truthText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 19,
    textAlign: 'center',
  },
  scriptureSection: {
    marginBottom: 32,
  },
  scriptureOuter: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  scriptureSectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 16,
  },
  scriptureList: {
    gap: 10,
  },
  scriptureItem: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  bookIcon: {
    fontSize: 18,
    color: Colors.accentGold,
    marginBottom: 8,
  },
  scriptureQuote: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 8,
  },
  scriptureReference: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: 'rgba(229, 185, 95, 0.5)',
    textTransform: 'uppercase',
  },
  identitySection: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  glowDivider: {
    height: 1,
    width: 96,
    backgroundColor: 'rgba(229, 185, 95, 0.3)',
    marginVertical: 24,
  },
  identityLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: 'rgba(229, 185, 95, 0.8)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 12,
  },
  identityMainText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: Colors.accentGold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

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
  const isEs = locale === 'es';
  const copy = isEs
    ? {
        topLabel: 'Domingo • Sept 15',
        sermonTitle: 'La Vid y los Pámpanos',
        sermonPart: 'Parte 1',
        preacherName: 'Pastor Elias Vance',
        churchName: 'Grace Fellowship',
        listen: '🔊 Escuchar el mensaje de esta semana',
        recapLabel: 'Resumen del domingo',
        recapText:
          '“Una reflexión serena sobre permanecer en la vid, resaltando la conexión sagrada entre la rama y la fuente. No somos llamados a producir, sino a permanecer.”',
        keyTruths: 'Verdades clave',
        truths: [
          'Soy una rama, diseñada para depender de la Vid Verdadera.',
          'La poda no es castigo; es una invitación a la fructificación.',
          'Separado de Él, mis esfuerzos se secan; en Él, mi gozo se completa.',
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
        topLabel: 'Sunday • Sept 15',
        sermonTitle: 'The Vine and the Branches',
        sermonPart: 'Part 1',
        preacherName: 'Pastor Elias Vance',
        churchName: 'Grace Fellowship',
        listen: '🔊 Listen to This Week’s Message',
        recapLabel: 'Sunday Recap',
        recapText:
          '"A serene reflection on abiding in the vine, emphasizing the sacred connection between the branch and the source. We are not called to produce, but to remain."',
        keyTruths: 'Key Truths',
        truths: [
          'I am a branch, designed for dependence upon the True Vine.',
          'Pruning is not punishment; it is the invitation to fruitfulness.',
          'Apart from Him, my efforts are dry; in Him, my joy is made complete.',
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
            <Text style={styles.topLabel}>{copy.topLabel}</Text>
            <Text style={styles.title}>{copy.sermonTitle}</Text>
            <Text style={styles.subtitle}>{copy.sermonPart}</Text>
            <TouchableOpacity onPress={() => openScriptureReference('John 15:1-8')}>
              <Text style={styles.scriptureRef}>John 15:1-8</Text>
            </TouchableOpacity>
            <Text style={styles.pastorInfo}>{copy.preacherName}</Text>
            <Text style={styles.churchInfo}>{copy.churchName}</Text>

            <TouchableOpacity
              style={styles.listenLink}
              onPress={openChurchMessage}
            >
              <Text style={styles.listenLinkText}>{copy.listen}</Text>
            </TouchableOpacity>

            <GlassCard style={styles.recapCard}>
              <Text style={styles.recapLabel}>{copy.recapLabel}</Text>
              <Text style={styles.recapText}>{copy.recapText}</Text>
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
  },
  churchInfo: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: 'rgba(148, 163, 184, 0.75)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
  },
  listenLink: {
    marginBottom: 20,
  },
  listenLinkText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
  },
  recapCard: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  recapLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: Colors.accentGold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  recapText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
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
  },
  truthsGrid: {
    gap: 10,
  },
  truthFull: {
    width: '100%',
    padding: 16,
  },
  truthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentGold,
    marginBottom: 12,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  truthText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
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
  },
});

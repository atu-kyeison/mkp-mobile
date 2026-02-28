import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { MidnightBackground } from './MidnightBackground';
import { GlassCard } from './GlassCard';
import { GoldButton } from './GoldButton';
import Colors from '../constants/Colors';

type LegalSection = {
  title: string;
  content: string;
};

type LegalContentScreenProps = {
  navigation: any;
  headerLabel?: string;
  title: string;
  sections: LegalSection[];
  buttonTitle: string;
  onPress: () => void;
  footerNote?: string;
  showBackButton?: boolean;
};

export const LegalContentScreen = ({
  navigation,
  headerLabel = 'LEGAL',
  title,
  sections,
  buttonTitle,
  onPress,
  footerNote,
  showBackButton = true,
}: LegalContentScreenProps) => (
  <MidnightBackground>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {showBackButton ? (
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={24} color={Colors.antiqueGold} />
            </TouchableOpacity>
          ) : null}
          <Text style={styles.headerLabel}>{headerLabel}</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.contentContainer}>
          <GlassCard style={styles.card}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator>
              {sections.map((section, index) => (
                <View key={`${section.title}-${index}`} style={styles.section}>
                  <Text style={styles.sectionTitle}>{`${index + 1}. ${section.title.toUpperCase()}`}</Text>
                  <Text style={styles.sectionContent}>{section.content}</Text>
                </View>
              ))}
              <View style={styles.bottomSpacer} />
            </ScrollView>

            <View style={styles.cardFooter}>
              {footerNote ? <Text style={styles.footerNote}>{footerNote}</Text> : null}
              <GoldButton title={buttonTitle} onPress={onPress} style={styles.button} />
            </View>
          </GlassCard>
        </View>
      </View>
    </SafeAreaView>
  </MidnightBackground>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24 },
  header: {
    alignItems: 'center',
    paddingTop: 44,
    marginBottom: 18,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 40,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  headerLabel: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: Colors.antiqueGold,
    letterSpacing: 4,
    marginBottom: 8,
  },
  headerDivider: {
    width: 52,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.3)',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontStyle: 'italic',
    fontSize: 31,
    color: 'white',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(13, 27, 42, 0.48)',
    borderColor: 'rgba(229, 185, 95, 0.2)',
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  section: {
    marginBottom: 34,
  },
  sectionTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 11,
    color: Colors.antiqueGold,
    letterSpacing: 2,
    marginBottom: 14,
  },
  sectionContent: {
    fontFamily: 'Inter_300Light',
    fontSize: 14,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.72)',
  },
  bottomSpacer: { height: 16 },
  cardFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  footerNote: {
    fontFamily: 'Inter_300Light',
    fontStyle: 'italic',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.36)',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  button: {
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
  },
});

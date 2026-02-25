import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { BackgroundGradient } from '../components/BackgroundGradient';
import { GlassCard } from '../components/GlassCard';

const JOURNEY_ITEMS = [
  {
    id: '1',
    date: 'Friday • Sept 22',
    type: 'REFLECTION',
    content: "'I noticed God’s hand in the quietness of the morning...'",
    isItalic: true,
  },
  {
    id: '2',
    date: 'Thursday • Sept 21',
    type: 'FROM SUNDAY',
    content: "Sermon Echo: Abiding teaches us to respond, not react.",
    isItalic: false,
  },
  {
    id: '3',
    date: 'Wednesday • Sept 20',
    type: 'INNER AWARENESS',
    content: "Posture: Peaceful",
    icon: 'psychology-alt' as const,
    isItalic: false,
    moodId: 'peaceful'
  },
];

export const JourneyHistoryScreen = ({ navigation }: any) => {
  return (
    <BackgroundGradient style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>YOUR JOURNEY</Text>
          <View style={styles.divider} />
          <Text style={styles.title}>A record of grace.</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.quickLinks}>
            <TouchableOpacity style={styles.quickLinkButton} onPress={() => navigation.navigate('Insights')}>
              <Text style={styles.quickLinkText}>INSIGHTS HOME</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLinkButton}
              onPress={() => navigation.navigate('MoodDetail', { moodId: 'peaceful', date: 'Wednesday • Sept 20' })}
            >
              <Text style={styles.quickLinkText}>PAST AWARENESS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timelineLine} />

          {JOURNEY_ITEMS.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <View style={styles.timelineDot} />
              <View style={styles.itemContent}>
                <Text style={styles.itemDate}>{item.date}</Text>
                <TouchableOpacity
                  onPress={() => item.moodId && navigation.navigate('MoodDetail', { moodId: item.moodId, date: item.date })}
                >
                  <GlassCard style={styles.itemCard}>
                    <Text style={styles.itemType}>{item.type}</Text>
                    {item.icon ? (
                      <View style={styles.iconRow}>
                        <MaterialIcons name={item.icon} size={20} color={Colors.accentGold} />
                        <Text style={styles.itemText}>{item.content}</Text>
                      </View>
                    ) : (
                      <Text style={[
                        styles.itemText,
                        item.isItalic && styles.italicText
                      ]}>
                        {item.content}
                      </Text>
                    )}
                  </GlassCard>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    paddingTop: 40,
    paddingBottom: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerSubtitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 4,
    marginBottom: 12,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 36,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 150,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickLinkButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.4)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(13, 27, 42, 0.45)',
  },
  quickLinkText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1.8,
    color: Colors.accentGold,
  },
  timelineLine: {
    position: 'absolute',
    left: 24,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.2)',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.6)',
    position: 'absolute',
    left: -5.5,
    top: 16,
  },
  itemContent: {
    flex: 1,
    paddingLeft: 32,
  },
  itemDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  itemCard: {
    padding: 20,
    backgroundColor: 'rgba(13, 27, 42, 0.6)',
  },
  itemType: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 9,
    color: Colors.accentGold,
    letterSpacing: 2,
    marginBottom: 12,
  },
  itemText: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 26,
  },
  italicText: {
    fontStyle: 'italic',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

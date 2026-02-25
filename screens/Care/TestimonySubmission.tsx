import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, ScrollView, TextInput, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { GradientBackground } from '../../components/GradientBackground';
import { GlassCard } from '../../components/GlassCard';
import { CustomButton } from '../../components/CustomButton';

export default function TestimonySubmission({ navigation }: any) {
  const [anonymous, setAnonymous] = useState(false);
  const [allowShare, setAllowShare] = useState(true);
  const [testimony, setTestimony] = useState('');

  const handleShareGratitude = () => {
    Alert.alert(
      'Testimony Submitted',
      'Your testimony has been sent and will appear in the pastor dashboard.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.divider} />
            <Text style={styles.title}>Where have you seen God’s faithfulness?</Text>
          </View>

          <GlassCard withGlow style={styles.inputCard}>
            <Text style={styles.cardLabel}>TESTIMONY</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Share a moment of grace..."
              placeholderTextColor="rgba(148, 163, 184, 0.5)"
              multiline
              numberOfLines={8}
              value={testimony}
              onChangeText={setTestimony}
            />
            <View style={styles.stars}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.starLarge}>★</Text>
              <Text style={styles.star}>★</Text>
            </View>
          </GlassCard>

          <View style={styles.togglesContainer}>
            <GlassCard style={styles.innerCard}>
              <View style={styles.toggleRow}>
                <View style={styles.labelWithIcon}>
                  <Text style={styles.icon}>👤</Text>
                  <Text style={styles.toggleText}>Share anonymously</Text>
                </View>
                <Switch
                  value={anonymous}
                  onValueChange={setAnonymous}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: Colors.accentGold }}
                  thumbColor="#fff"
                />
              </View>
              <View style={styles.separator} />
              <View style={styles.toggleRow}>
                <View style={styles.labelWithIcon}>
                  <Text style={styles.icon}>⛪</Text>
                  <Text style={styles.toggleText}>Allow church to share this as encouragement</Text>
                </View>
                <Switch
                  value={allowShare}
                  onValueChange={setAllowShare}
                  trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(229, 185, 95, 0.4)' }}
                  thumbColor={allowShare ? Colors.accentGold : '#fff'}
                />
              </View>
            </GlassCard>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton title="SHARE GRATITUDE" onPress={handleShareGratitude} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Your story strengthens the church.
            </Text>
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
    paddingTop: 40,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(229, 185, 95, 0.4)',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 36,
  },
  inputCard: {
    padding: 24,
    minHeight: 300,
  },
  cardLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: 'rgba(229, 185, 95, 0.6)',
    letterSpacing: 2,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 18,
    color: Colors.text,
    textAlignVertical: 'top',
  },
  stars: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    opacity: 0.4,
  },
  star: {
    color: Colors.accentGold,
    fontSize: 10,
  },
  starLarge: {
    color: Colors.accentGold,
    fontSize: 14,
  },
  togglesContainer: {
    marginTop: 24,
  },
  innerCard: {
    padding: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 16,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    opacity: 0.4,
  },
  toggleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 24,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    lineHeight: 20,
  },
});

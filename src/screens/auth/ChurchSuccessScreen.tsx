import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Svg, { Path } from 'react-native-svg';

const ChurchSuccessScreen = ({ navigation, route }: any) => {
  const { churchName } = route.params;
  const isNewBeliever = route.params?.isNewBeliever === true;
  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.container}>
            <GlassCard style={styles.card}>
              <View style={styles.iconContainer}><View style={styles.iconCircle}><MaterialIcons name="check-circle" size={40} color={Colors.antiqueGold} /></View></View>
              <View style={styles.header}><Text style={styles.title}>You're connected!</Text><Text style={styles.churchName}>{churchName.toUpperCase()}</Text></View>
              <View style={styles.logoSlot}><View style={styles.logoCircle}><Svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={Colors.antiqueGold} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><Path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></Svg></View></View>
              <Text style={styles.description}>Welcome to the family. Your journey with us begins today.</Text>
              <GoldButton
                title={isNewBeliever ? "CONTINUE" : "GO TO MY CHURCH"}
                onPress={() =>
                  isNewBeliever
                    ? navigation.navigate('NewBelieverStart', { churchName })
                    : navigation.getParent()?.navigate('Main', { screen: 'Home' })
                }
              />
              {!isNewBeliever ? (
                <View style={styles.secondaryButton}>
                  <GoldButton
                    title="NEW TO FAITH? START HERE"
                    variant="outline"
                    onPress={() => navigation.navigate('NewBelieverStart', { churchName })}
                  />
                </View>
              ) : null}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By continuing, you agree to the <Text style={styles.footerLink} onPress={() => navigation.navigate('Terms')}>Terms of Service</Text> and <Text style={styles.footerLink} onPress={() => navigation.navigate('Privacy')}>Privacy Policy</Text>.
                </Text>
              </View>
            </GlassCard>
          </View>
        </ScrollView>
      </SafeAreaView>
    </MidnightBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 20, justifyContent: 'center' }, container: { width: '100%', alignItems: 'center' },
  card: { width: '100%', maxWidth: 420, paddingHorizontal: 28, paddingTop: 28, paddingBottom: 24, alignItems: 'center', borderRadius: 32 },
  iconContainer: { marginBottom: 24 }, iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(229, 185, 95, 0.05)', borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.1)', justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 24 }, title: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 28, color: 'white', textAlign: 'center', marginBottom: 8 },
  churchName: { fontFamily: 'Cinzel_400Regular', fontSize: 13, color: Colors.antiqueGold, letterSpacing: 2, textAlign: 'center' },
  logoSlot: { marginBottom: 24 }, logoCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(229, 185, 95, 0.2)', backgroundColor: 'rgba(13, 27, 42, 0.4)', justifyContent: 'center', alignItems: 'center' },
  description: { fontFamily: 'Inter_300Light', fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 22, marginBottom: 28, paddingHorizontal: 16 },
  secondaryButton: { marginTop: 10, width: '100%' },
  footer: { marginTop: 'auto', paddingTop: 24, alignItems: 'center' }, footerText: { fontFamily: 'Inter_300Light', fontSize: 10, color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', lineHeight: 16, maxWidth: 280 }, footerLink: { textDecorationLine: 'underline' },
});

export default ChurchSuccessScreen;

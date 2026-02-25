import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const PasswordEmailSentScreen = ({ navigation }: any) => (
  <MidnightBackground>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.logoCircle}><MaterialIcons name="church" size={32} color={Colors.antiqueGold} /></View>
          <Text style={styles.brandText}>MY KINGDOM PAL</Text>
        </View>
        <GlassCard style={styles.card}>
          <View style={styles.content}>
            <View style={styles.iconCircle}><MaterialIcons name="mail-lock" size={48} color={Colors.antiqueGold} /></View>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>If an account exists for that email, you’ll receive a reset link in a few minutes.</Text>
            <View style={styles.buttonWrapper}><GoldButton title="RETURN TO SIGN IN" onPress={() => navigation.navigate('Signin', {})} /></View>
            <View style={styles.linksContainer}>
              <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Signin', {})}><Text style={styles.linkText}>RESEND EMAIL</Text></TouchableOpacity>
              <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Signin', {})}><Text style={styles.linkText}>USE A DIFFERENT EMAIL</Text></TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.footerText}>
              By continuing, you agree to our <Text style={styles.footerLink} onPress={() => navigation.navigate('Terms')}>Terms of Service</Text> and <Text style={styles.footerLink} onPress={() => navigation.navigate('Privacy')}>Privacy Policy</Text>.
            </Text>
          </View>
        </GlassCard>
      </View>
    </SafeAreaView>
  </MidnightBackground>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, container: { flex: 1, paddingTop: 60 },
  headerContainer: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, letterSpacing: 5, color: Colors.antiqueGold },
  card: { flex: 1, borderTopLeftRadius: 56, borderTopRightRadius: 56, paddingHorizontal: 40, paddingTop: 64, paddingBottom: 32 },
  content: { alignItems: 'center' },
  iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(229, 185, 95, 0.05)', borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  title: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 30, color: 'white', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontFamily: 'Inter_300Light', fontSize: 16, color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', lineHeight: 24, maxWidth: 300, marginBottom: 48 },
  buttonWrapper: { width: '100%', marginBottom: 32 }, linksContainer: { alignItems: 'center', gap: 16 }, linkButton: { paddingVertical: 4 }, linkText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, color: Colors.antiqueGold, letterSpacing: 1.5 },
  cardFooter: { marginTop: 'auto', alignItems: 'center' }, footerText: { fontFamily: 'Inter_300Light', fontSize: 10, color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', lineHeight: 16, maxWidth: 280, textTransform: 'uppercase' }, footerLink: { textDecorationLine: 'underline' },
});

export default PasswordEmailSentScreen;

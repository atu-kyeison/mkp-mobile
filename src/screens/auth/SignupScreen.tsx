import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const SignupScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
            <View style={styles.headerContainer}>
              <View style={styles.logoCircle}><MaterialIcons name="church" size={32} color={Colors.antiqueGold} /></View>
              <Text style={styles.brandText}>MY KINGDOM PAL</Text>
            </View>
            <GlassCard style={styles.card}>
              <View style={styles.header}><Text style={styles.title}>Start your journey</Text><Text style={styles.subtitle}>Create an account to begin</Text></View>
              <View style={styles.form}>
                <View style={styles.inputGroup}><Text style={styles.label}>FIRST NAME</Text><TextInput style={styles.input} placeholder="Enter your name" placeholderTextColor="rgba(255, 255, 255, 0.25)" value={firstName} onChangeText={setFirstName} /></View>
                <View style={styles.inputGroup}><Text style={styles.label}>EMAIL ADDRESS</Text><TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor="rgba(255, 255, 255, 0.25)" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} /></View>
                <View style={styles.inputGroup}><Text style={styles.label}>PASSWORD</Text><TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="rgba(255, 255, 255, 0.25)" secureTextEntry value={password} onChangeText={setPassword} /></View>
                <TouchableOpacity style={styles.checkboxContainer} activeOpacity={0.7} onPress={() => setIsAgeVerified(!isAgeVerified)}>
                  <View style={[styles.checkbox, isAgeVerified && styles.checkboxActive]}>{isAgeVerified && <MaterialIcons name="check" size={14} color={Colors.backgroundDark} />}</View>
                  <View style={styles.checkboxLabelContainer}><Text style={styles.checkboxLabel}>I confirm I am at least 16 years old.</Text><Text style={styles.checkboxSublabel}>My Kingdom Pal is designed for ages 16+.</Text></View>
                </TouchableOpacity>
                <View style={styles.buttonWrapper}>
                  <GoldButton title="CREATE ACCOUNT" onPress={() => navigation.navigate('Terms', { nextScreen: 'ChurchSearch' })} />
                </View>
                <TouchableOpacity style={styles.signinLink} onPress={() => navigation.navigate('Signin', {})}><Text style={styles.signinText}>Already have an account? <Text style={styles.signinHighlight}>Sign in</Text></Text></TouchableOpacity>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>
                  BY CONTINUING, YOU AGREE TO OUR <Text style={styles.footerLink} onPress={() => navigation.navigate('Terms')}>TERMS OF SERVICE</Text> AND <Text style={styles.footerLink} onPress={() => navigation.navigate('Privacy')}>PRIVACY POLICY</Text>.
                </Text>
              </View>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MidnightBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, keyboardView: { flex: 1 }, scrollContent: { flexGrow: 1, paddingTop: 20, paddingBottom: 24 },
  headerContainer: { alignItems: 'center', marginBottom: 24, paddingHorizontal: 20 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, letterSpacing: 5, color: Colors.antiqueGold },
  card: { width: '100%', maxWidth: 420, alignSelf: 'center', marginHorizontal: 20, borderRadius: 28, paddingHorizontal: 28, paddingTop: 28, paddingBottom: 24 },
  header: { alignItems: 'center', marginBottom: 24 }, title: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 30, color: 'white', textAlign: 'center', marginBottom: 8 }, subtitle: { fontFamily: 'Inter_300Light', fontSize: 14, color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center' },
  form: {}, inputGroup: { marginBottom: 16 }, label: { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 2, color: 'rgba(229, 185, 95, 0.7)', marginLeft: 4, marginBottom: 6 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, color: 'white', fontFamily: 'Inter_400Regular', fontSize: 14 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 16, marginTop: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.05)', marginRight: 12, marginTop: 2, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: Colors.antiqueGold, borderColor: Colors.antiqueGold }, checkboxLabelContainer: { flex: 1 },
  checkboxLabel: { fontFamily: 'Inter_300Light', fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', lineHeight: 20 }, checkboxSublabel: { fontFamily: 'Inter_300Light', fontSize: 11, color: 'rgba(255, 255, 255, 0.3)', marginTop: 4 },
  buttonWrapper: { marginTop: 24 }, signinLink: { alignItems: 'center', marginTop: 20 }, signinText: { fontFamily: 'Inter_300Light', fontSize: 12, color: 'rgba(255, 255, 255, 0.4)' }, signinHighlight: { color: Colors.antiqueGold, textDecorationLine: 'underline' },
  cardFooter: { marginTop: 'auto', alignItems: 'center' }, footerText: { fontFamily: 'Inter_300Light', fontSize: 10, color: 'rgba(255, 255, 255, 0.2)', textAlign: 'center', lineHeight: 16, maxWidth: 280 }, footerLink: { textDecorationLine: 'underline' },
});

export default SignupScreen;

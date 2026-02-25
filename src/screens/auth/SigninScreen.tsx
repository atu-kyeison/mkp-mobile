import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MidnightBackground } from '../../components/MidnightBackground';
import { GlassCard } from '../../components/GlassCard';
import { GoldButton } from '../../components/GoldButton';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const SigninScreen = ({ navigation, route }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(route.params?.error || false);
  return (
    <MidnightBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <View style={styles.headerContainer}>
                <View style={styles.logoCircle}><MaterialIcons name="church" size={32} color={Colors.antiqueGold} /></View>
                <Text style={styles.brandText}>MY KINGDOM PAL</Text>
              </View>
              <GlassCard style={styles.card}>
                <View style={styles.header}><Text style={styles.title}>Welcome back</Text><Text style={styles.subtitle}>Continue your walk</Text></View>
                <View style={styles.form}>
                  <View style={styles.inputGroup}><Text style={styles.label}>EMAIL ADDRESS</Text><TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor="rgba(255, 255, 255, 0.25)" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} /></View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>PASSWORD</Text>
                    <TextInput style={[styles.input, isError && styles.inputError]} placeholder="••••••••" placeholderTextColor="rgba(255, 255, 255, 0.25)" secureTextEntry value={password} onChangeText={(text) => { setPassword(text); if (isError) setIsError(false); }} />
                    {isError && <Text style={styles.errorHint}>That didn't match our records. Check your details or reset your password.</Text>}
                  </View>
                  <View style={styles.buttonWrapper}>
                    <GoldButton
                      title={isError ? "TRY AGAIN" : "SIGN IN"}
                      onPress={() => navigation.getParent()?.navigate('Main')}
                    />
                  </View>
                  <TouchableOpacity style={styles.forgotLink} onPress={() => navigation.navigate('PasswordReset')}><Text style={styles.forgotText}>Forgot password?</Text></TouchableOpacity>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>
                    By continuing, you agree to our <Text style={styles.footerLink} onPress={() => navigation.navigate('Terms')}>Terms of Service</Text> and <Text style={styles.footerLink} onPress={() => navigation.navigate('Privacy')}>Privacy Policy</Text>.
                  </Text>
                </View>
              </GlassCard>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MidnightBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 }, keyboardView: { flex: 1 }, scrollContent: { flexGrow: 1, paddingTop: 20, paddingBottom: 24 },
  container: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 24 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  brandText: { fontFamily: 'Cinzel_400Regular', fontSize: 11, letterSpacing: 5, color: Colors.antiqueGold },
  card: { width: '100%', maxWidth: 420, alignSelf: 'center', borderRadius: 28, paddingHorizontal: 28, paddingTop: 28, paddingBottom: 24 },
  header: { alignItems: 'center', marginBottom: 28 }, title: { fontFamily: 'PlayfairDisplay_500Medium', fontSize: 30, color: 'white', textAlign: 'center', marginBottom: 8 }, subtitle: { fontFamily: 'Inter_300Light', fontSize: 14, color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center' },
  form: {}, inputGroup: { marginBottom: 20 }, label: { fontFamily: 'Inter_500Medium', fontSize: 10, letterSpacing: 2, color: 'rgba(229, 185, 95, 0.7)', marginLeft: 4, marginBottom: 8 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 16, color: 'white', fontFamily: 'Inter_400Regular', fontSize: 14 },
  inputError: { borderColor: '#8B2E2E' }, errorHint: { fontFamily: 'Inter_300Light', fontSize: 11, color: 'rgba(229, 185, 95, 0.8)', paddingLeft: 4, paddingTop: 8, lineHeight: 16 },
  buttonWrapper: { marginTop: 12 }, forgotLink: { alignItems: 'center', marginTop: 20 }, forgotText: { fontFamily: 'Inter_300Light', fontSize: 12, color: 'rgba(255, 255, 255, 0.3)' },
  cardFooter: { marginTop: 'auto', alignItems: 'center' }, footerText: { fontFamily: 'Inter_300Light', fontSize: 10, color: 'rgba(255, 255, 255, 0.3)', textAlign: 'center', lineHeight: 16, maxWidth: 280 }, footerLink: { textDecorationLine: 'underline' },
});

export default SigninScreen;

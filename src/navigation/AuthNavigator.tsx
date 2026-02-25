import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import ChurchSearchScreen from '../screens/auth/ChurchSearchScreen';
import ChurchSuccessScreen from '../screens/auth/ChurchSuccessScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import SigninScreen from '../screens/auth/SigninScreen';
import PasswordResetScreen from '../screens/auth/PasswordResetScreen';
import PasswordEmailSentScreen from '../screens/auth/PasswordEmailSentScreen';
import NewBelieverStartScreen from '../screens/auth/NewBelieverStartScreen';
import TermsScreen from '../screens/legal/TermsScreen';
import PrivacyPolicyScreen from '../screens/legal/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ChurchSearch" component={ChurchSearchScreen} />
      <Stack.Screen name="ChurchSuccess" component={ChurchSuccessScreen} />
      <Stack.Screen name="NewBelieverStart" component={NewBelieverStartScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Signin" component={SigninScreen} />
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
      <Stack.Screen name="PasswordEmailSent" component={PasswordEmailSentScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
};

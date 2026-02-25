import React, { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { RootStackParamList } from './types';
import FAQScreen from '../screens/profile/FAQScreen';
import UseGuidelinesScreen from '../screens/legal/UseGuidelinesScreen';
import TermsScreen from '../screens/legal/TermsScreen';
import PrivacyPolicyScreen from '../screens/legal/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const [isAuthenticated] = useState(false); // Replace with real auth state when backend is connected.
  const initialRoute = useMemo(() => (isAuthenticated ? 'Main' : 'Auth'), [isAuthenticated]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="FAQ" component={FAQScreen} />
          <Stack.Screen name="Guidelines" component={UseGuidelinesScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

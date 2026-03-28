import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { RootStackParamList } from './types';
import FAQScreen from '../screens/profile/FAQScreen';
import UseGuidelinesScreen from '../screens/legal/UseGuidelinesScreen';
import TermsScreen from '../screens/legal/TermsScreen';
import PrivacyPolicyScreen from '../screens/legal/PrivacyPolicyScreen';
import { useSession } from '../backend/SessionProvider';
import { Colors } from '../../constants/Colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isLoading, isAuthenticated, session } = useSession();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.backgroundDark,
        }}
      >
        <ActivityIndicator size="large" color={Colors.accentGold} />
      </View>
    );
  }

  const shouldEnterMain =
    isAuthenticated &&
    typeof session?.context?.currentChurchId === 'string' &&
    session.context.currentChurchId.length > 0;

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={shouldEnterMain ? 'main' : 'auth'}
        initialRouteName={shouldEnterMain ? 'Main' : 'Auth'}
        screenOptions={{ headerShown: false }}
      >
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

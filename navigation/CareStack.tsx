import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CareHome from '../screens/Care/CareHome';
import PrayerSubmission from '../screens/Care/PrayerSubmission';
import TestimonySubmission from '../screens/Care/TestimonySubmission';
import CareSupportRequest from '../screens/Care/CareSupportRequest';
import CareEscalationSuccess from '../screens/Care/CareEscalationSuccess';
import { Colors } from '../constants/Colors';

const Stack = createNativeStackNavigator();

export default function CareStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primaryBackground,
        },
        headerTintColor: Colors.accentGold,
        headerTitleStyle: {
          fontFamily: 'Cinzel_700Bold',
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="CareHome"
        component={CareHome}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="PrayerSubmission"
        component={PrayerSubmission}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="TestimonySubmission"
        component={TestimonySubmission}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="CareSupportRequest"
        component={CareSupportRequest}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="CareEscalationSuccess"
        component={CareEscalationSuccess}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

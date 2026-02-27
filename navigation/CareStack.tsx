import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CareHome from '../screens/Care/CareHome';
import PrayerSubmission from '../screens/Care/PrayerSubmission';
import TestimonySubmission from '../screens/Care/TestimonySubmission';
import CareSupportRequest from '../screens/Care/CareSupportRequest';
import CareEscalationSuccess from '../screens/Care/CareEscalationSuccess';

const Stack = createNativeStackNavigator();

export default function CareStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CareHome" component={CareHome} />
      <Stack.Screen name="PrayerSubmission" component={PrayerSubmission} />
      <Stack.Screen name="TestimonySubmission" component={TestimonySubmission} />
      <Stack.Screen name="CareSupportRequest" component={CareSupportRequest} />
      <Stack.Screen name="CareEscalationSuccess" component={CareEscalationSuccess} />
    </Stack.Navigator>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { MainTabParamList } from './types';
import { NavigationBar } from '../components/NavigationBar';
import { Colors } from '../../constants/Colors';

// Batch 2 Imports
import FormationDispatcher from '../../screens/Formation/FormationDispatcher';
import CareStack from '../../navigation/CareStack';

// Batch 3 Imports
import { MoodCheckInScreen } from '../screens/MoodCheckInScreen';
import { ReflectionEntryScreen } from '../screens/ReflectionEntryScreen';
import { MoodDetailScreen } from '../screens/MoodDetailScreen';
import { JourneyHistoryScreen } from '../screens/JourneyHistoryScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { TechnicalSupportScreen } from '../screens/TechnicalSupportScreen';

// Auth Imports
import SettingsScreen from '../screens/profile/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const JourneyStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const JourneyStackNavigator = () => {
  return (
    <JourneyStack.Navigator screenOptions={{ headerShown: false }}>
      <JourneyStack.Screen name="JourneyHistory" component={JourneyHistoryScreen} />
      <JourneyStack.Screen name="MoodCheckIn" component={MoodCheckInScreen} />
      <JourneyStack.Screen name="ReflectionEntry" component={ReflectionEntryScreen} />
      <JourneyStack.Screen name="MoodDetail" component={MoodDetailScreen} />
      <JourneyStack.Screen name="Insights" component={InsightsScreen} />
    </JourneyStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={SettingsScreen} />
      <ProfileStack.Screen name="TechnicalSupport" component={TechnicalSupportScreen} />
    </ProfileStack.Navigator>
  );
};

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => {
        const route = props.state.routes[props.state.index];
        const routeName = getFocusedRouteNameFromRoute(route);

        // Hide navigation bar during mood check-in
        if (routeName === 'MoodCheckIn') {
          return null;
        }

        return (
          <NavigationBar
            activeTab={props.state.routeNames[props.state.index].toUpperCase() as any}
            onTabPress={(tab) => props.navigation.navigate(tab.charAt(0) + tab.slice(1).toLowerCase())}
          />
        );
      }}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={FormationDispatcher} />
      <Tab.Screen name="Journey" component={JourneyStackNavigator} />
      <Tab.Screen name="Church" component={CareStack} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

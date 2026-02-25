import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import FormationDispatcher from '../screens/Formation/FormationDispatcher';
import CareStack from './CareStack';
import { Colors } from '../constants/Colors';
import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator();

// Placeholder screens
const Placeholder = ({ name }: { name: string }) => (
  <View style={{ flex: 1, backgroundColor: Colors.primaryBackground, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: Colors.accentGold, fontFamily: 'Cinzel_700Bold' }}>{name} Coming Soon</Text>
  </View>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          Platform.OS !== 'web' ? (
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' } as any]} />
          )
        ),
        tabBarActiveTintColor: Colors.accentGold,
        tabBarInactiveTintColor: 'rgba(229, 185, 95, 0.5)',
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen
        name="HOME"
        component={FormationDispatcher}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={[styles.icon, { color, opacity: focused ? 1 : 0.5 }]}>⌂</Text>
          ),
        }}
      />
      <Tab.Screen
        name="JOURNEY"
        component={() => <Placeholder name="JOURNEY" />}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={[styles.icon, { color, opacity: focused ? 1 : 0.5 }]}>⚑</Text>
          ),
        }}
      />
      <Tab.Screen
        name="CHURCH"
        component={CareStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={[styles.icon, { color, opacity: focused ? 1 : 0.5 }]}>⛪</Text>
          ),
        }}
      />
      <Tab.Screen
        name="PROFILE"
        component={() => <Placeholder name="PROFILE" />}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Text style={[styles.icon, { color, opacity: focused ? 1 : 0.5 }]}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'transparent',
    elevation: 0,
    paddingBottom: 10,
    paddingTop: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabBarLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 4,
  },
  icon: {
    fontSize: 24,
  },
});

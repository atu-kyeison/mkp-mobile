import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export const NavCapsule = ({ state, descriptors, navigation }: any) => (
  <View style={styles.container}>
    <BlurView intensity={20} tint="dark" style={styles.blur}>
      <View style={styles.content}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          let iconName: any = 'home';
          if (route.name === 'Journey') iconName = 'alt-route';
          else if (route.name === 'Church') iconName = 'church';
          else if (route.name === 'Profile') iconName = 'person';
          return (
            <TouchableOpacity key={index} onPress={onPress} style={styles.tabItem}>
              <MaterialIcons name={iconName} size={24} color={Colors.antiqueGold} style={{ opacity: isFocused ? 1 : 0.5 }} />
              <Text style={[styles.tabText, { opacity: isFocused ? 1 : 0.5 }]}>{route.name.toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  </View>
);

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 30, alignSelf: 'center', width: '90%', maxWidth: 380, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  blur: { paddingVertical: 10 },
  content: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 10 },
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  tabText: { fontFamily: 'Inter_600SemiBold', fontSize: 8, color: Colors.antiqueGold, marginTop: 4, letterSpacing: 1 },
});

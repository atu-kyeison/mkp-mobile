import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';

interface BackgroundGradientProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'full' | 'simple';
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ children, style, variant = 'full' }) => {
  const colors: [string, string, ...string[]] = variant === 'full'
    ? [Colors.backgroundDark, Colors.midnightMid, Colors.midnightBottom]
    : [Colors.backgroundDark, Colors.midnightBottom];

  return (
    <LinearGradient
      colors={colors}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View style={styles.haze} />
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  haze: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Keep this transparent until we add a native-safe haze layer.
    opacity: 0.5,
  },
});

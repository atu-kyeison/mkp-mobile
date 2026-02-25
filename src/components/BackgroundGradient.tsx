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
  const colors = variant === 'full'
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
    backgroundColor: 'radial-gradient(circle at center, rgba(238, 189, 43, 0.08) 0%, transparent 70%)',
    // Note: React Native doesn't support radial-gradient directly in StyleSheet.
    // We would need another LinearGradient or an Image for the "divine haze".
    // For now, we'll omit the radial gradient or use a simplified version.
    opacity: 0.5,
  },
});

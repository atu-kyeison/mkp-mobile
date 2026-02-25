import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

interface GradientBackgroundProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'midnight' | 'sacred';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'midnight',
  style,
  ...props
}) => {
  const colors = variant === 'midnight'
    ? [Colors.primaryBackground, Colors.midnightMid, Colors.midnightBottom]
    : [Colors.sacredDeepBlue, Colors.sacredMidBlue, Colors.sacredGold];

  return (
    <LinearGradient
      colors={colors}
      style={[styles.container, style]}
      {...props}
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
    // We could use another radial gradient here for the "divine-haze" effect
    // but a simple subtle overlay or just the linear gradient is often enough.
  },
});

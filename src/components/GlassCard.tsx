import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';
import { useTheme } from '../theme/ThemeProvider';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  variant?: 'small' | 'large';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20, variant = 'small' }) => (
  <ThemedCard intensity={intensity} style={style} variant={variant}>
    {children}
  </ThemedCard>
);

const ThemedCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20, variant = 'small' }) => {
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);

  return (
    <View style={[styles.container, variant === 'large' ? styles.large : styles.small, style]}>
      <BlurView intensity={intensity} style={StyleSheet.absoluteFill} tint="dark" />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: { 
    overflow: 'hidden', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderWidth: 1, 
    borderColor: 'rgba(229, 185, 95, 0.2)', 
  },
  small: {
    borderRadius: 16,
    // padding: 16, // removed to avoid breaking Auth layout which doesn't expect padding here
  },
  large: {
    borderRadius: 28,
    // padding: 24, // removed to avoid breaking Auth layout
    backgroundColor: 'rgba(13, 27, 42, 0.65)',
  },
  content: { flex: 1 },
});

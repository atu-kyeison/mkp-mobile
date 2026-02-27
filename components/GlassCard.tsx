import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';
import { useTheme } from '../src/theme/ThemeProvider';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  withGlow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  withGlow = false
}) => {
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  return (
    <View style={[
      styles.container,
      style,
      withGlow && styles.glow
    ]}>
      {Platform.OS !== 'web' ? (
        <BlurView intensity={intensity} tint="dark" style={styles.blur}>
          <View style={styles.content}>
            {children}
          </View>
        </BlurView>
      ) : (
        <View style={[styles.content, { backgroundColor: 'rgba(255, 255, 255, 0.04)', backdropFilter: 'blur(20px)' } as any]}>
          {children}
        </View>
      )}
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  blur: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  glow: {
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderColor: 'rgba(229, 185, 95, 0.3)',
  }
});

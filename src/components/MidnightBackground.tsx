import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import { useTheme } from '../theme/ThemeProvider';

interface MidnightBackgroundProps {
  children: React.ReactNode;
  showHaze?: boolean;
}

export const MidnightBackground: React.FC<MidnightBackgroundProps> = ({ children, showHaze = true }) => {
  const { themeId } = useTheme();
  const gradientColors: [string, string, string] = useMemo(
    () => [Colors.backgroundDark, Colors.midnightMid, Colors.midnightBottom],
    [themeId]
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
      />
      {showHaze && (
        <View style={styles.hazeContainer}>
           <LinearGradient
            colors={['rgba(229, 185, 95, 0.08)', 'transparent']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
            style={styles.hazeTopRight}
          />
          <LinearGradient
            colors={['rgba(229, 185, 95, 0.05)', 'transparent']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0.5, y: 0.5 }}
            style={styles.hazeBottomLeft}
          />
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  hazeContainer: { ...StyleSheet.absoluteFillObject, pointerEvents: 'none' },
  hazeTopRight: { position: 'absolute', top: 0, right: 0, width: '100%', height: '60%' },
  hazeBottomLeft: { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%' },
});

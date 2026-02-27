import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useTheme } from '../theme/ThemeProvider';

type LogoBadgeProps = {
  logoUri?: string;
  fallbackIcon?: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  ringWidth?: number;
  label?: string;
};

export const LogoBadge: React.FC<LogoBadgeProps> = ({
  logoUri,
  fallbackIcon = 'church',
  size = 64,
  ringWidth = 1.5,
  label,
}) => {
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logoUri) && !failed;
  const iconSize = Math.round(size * 0.48);
  const labelSize = Math.max(8, Math.round(size * 0.14));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: ringWidth,
          },
        ]}
      >
        {showImage ? (
          <Image
            source={{ uri: logoUri }}
            style={[styles.image, { width: size * 0.7, height: size * 0.7 }]}
            resizeMode="contain"
            onError={() => setFailed(true)}
          />
        ) : (
          <MaterialIcons name={fallbackIcon} size={iconSize} color={Colors.antiqueGold} />
        )}
      </View>
      {label ? (
        <Text style={[styles.label, { fontSize: labelSize }]} numberOfLines={2}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    circle: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderColor: 'rgba(229, 185, 95, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      borderRadius: 8,
    },
    label: {
      marginTop: 10,
      fontFamily: 'Cinzel_400Regular',
      letterSpacing: 2,
      color: Colors.antiqueGold,
      textAlign: 'center',
      textTransform: 'uppercase',
    },
  });

import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useTheme } from '../theme/ThemeProvider';

type ErrorStateCardProps = {
  title: string;
  body: string;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({
  title,
  body,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
}) => {
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="error-outline" size={20} color={Colors.accentGold} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton} onPress={onPrimaryPress}>
          <Text style={styles.primaryText}>{primaryLabel}</Text>
        </TouchableOpacity>
        {secondaryLabel && onSecondaryPress ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={onSecondaryPress}>
            <Text style={styles.secondaryText}>{secondaryLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    card: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: 'rgba(229, 185, 95, 0.28)',
      backgroundColor: 'rgba(13, 27, 42, 0.65)',
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginTop: 14,
    },
    iconWrap: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: 'rgba(229, 185, 95, 0.3)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      backgroundColor: 'rgba(229, 185, 95, 0.1)',
    },
    title: {
      fontFamily: 'Cinzel_700Bold',
      fontSize: 10,
      letterSpacing: 1.8,
      color: Colors.accentGold,
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    body: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      lineHeight: 18,
      color: 'rgba(255, 255, 255, 0.82)',
      marginBottom: 12,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    primaryButton: {
      borderRadius: 999,
      backgroundColor: Colors.accentGold,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    primaryText: {
      fontFamily: 'Cinzel_700Bold',
      fontSize: 10,
      letterSpacing: 1.6,
      color: Colors.backgroundDark,
      textTransform: 'uppercase',
    },
    secondaryButton: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: 'rgba(229, 185, 95, 0.4)',
      paddingVertical: 10,
      paddingHorizontal: 14,
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    secondaryText: {
      fontFamily: 'Cinzel_700Bold',
      fontSize: 10,
      letterSpacing: 1.6,
      color: Colors.accentGold,
      textTransform: 'uppercase',
    },
  });

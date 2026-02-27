import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../constants/Colors';
import { useTheme } from '../src/theme/ThemeProvider';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  disabled?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  style,
  textStyle,
  loading = false,
  disabled = false,
}) => {
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        isPrimary && styles.primaryButton,
        isOutline && styles.outlineButton,
        disabled && styles.disabledButton,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? Colors.primaryBackground : Colors.accentGold} />
      ) : (
        <Text style={[
          styles.text,
          isPrimary && styles.primaryText,
          isOutline && styles.outlineText,
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = () => StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.accentGold,
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  outlineButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(229, 185, 95, 0.3)',
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 14,
    letterSpacing: 2,
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.primaryBackground,
  },
  outlineText: {
    color: Colors.accentGold,
  },
});

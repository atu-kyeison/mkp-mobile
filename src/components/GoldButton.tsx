import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const GoldButton = ({ title, onPress, style, variant = 'solid' }: any) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.button, variant === 'solid' ? styles.solid : styles.outline, style]}>
    <Text style={[styles.text, variant === 'solid' ? styles.solidText : styles.outlineText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { width: '100%', paddingVertical: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  solid: { backgroundColor: Colors.antiqueGold, shadowColor: Colors.antiqueGold, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 5 },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(229, 185, 95, 0.4)' },
  text: { fontFamily: 'Cinzel_700Bold', fontSize: 13, letterSpacing: 2 },
  solidText: { color: Colors.backgroundDark },
  outlineText: { color: Colors.antiqueGold },
});

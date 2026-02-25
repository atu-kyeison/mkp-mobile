import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export const GlobalStyles = StyleSheet.create({
  midnightGradient: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  glassCard: {
    backgroundColor: Colors.glassBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  glassCardLarge: {
    backgroundColor: 'rgba(13, 27, 42, 0.65)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: 24,
  },
  goldGlow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 5,
  },
  sacredText: {
    fontFamily: 'Cinzel_400Regular',
    color: Colors.accentGold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  displayFont: {
    fontFamily: 'Newsreader_400Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  serifAccent: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  sansInter: {
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  }
});

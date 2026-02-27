import React, { createContext, useContext, useMemo, useState } from 'react';
import { Settings } from 'react-native';
import { Colors as RootColors } from '../../constants/Colors';
import LocalColors from '../constants/Colors';

export type ThemeId = 'midnight_reverence' | 'dawn_mercy';

type ThemeContextValue = {
  themeId: ThemeId;
  setThemeId: (themeId: ThemeId) => void;
  themeOptions: Array<{ id: ThemeId; labelKey: string }>;
};

const themeOptions: Array<{ id: ThemeId; labelKey: string }> = [
  { id: 'dawn_mercy', labelKey: 'settings.theme.dawn' },
  { id: 'midnight_reverence', labelKey: 'settings.theme.midnight' },
];

const themePalettes: Record<ThemeId, Record<string, string>> = {
  midnight_reverence: {
    primary: '#eebd2b',
    accentGold: '#E5B95F',
    backgroundDark: '#0D1B2A',
    midnightMid: '#162A3A',
    midnightBottom: '#1C2230',
    subtleSlate: '#94a3b8',
    referenceGold: 'rgba(229, 185, 95, 0.45)',
    peaceful: '#829AB1',
    joyful: '#D4AF37',
    contemplative: '#4A5D6E',
    text: '#F5F7FA',
    textMuted: 'rgba(245, 247, 250, 0.6)',
    mutedBorder: 'rgba(255, 255, 255, 0.08)',
    glassBorder: 'rgba(229, 185, 95, 0.2)',
    glassBackground: 'rgba(255, 255, 255, 0.05)',
    primaryBackground: '#0D1B2A',
    brightGold: '#eebd2b',
    parchment: '#fdfaf1',
    sacredDeepBlue: '#0a1128',
    sacredMidBlue: '#1a2a4d',
    sacredGold: '#c9bb92',
  },
  dawn_mercy: {
    primary: '#E8B44D',
    accentGold: '#EBCB8B',
    backgroundDark: '#1A2238',
    midnightMid: '#2D3A58',
    midnightBottom: '#3A4A6A',
    subtleSlate: '#B8C5D6',
    referenceGold: 'rgba(235, 203, 139, 0.55)',
    peaceful: '#9BC4D8',
    joyful: '#F2C75C',
    contemplative: '#7487A2',
    text: '#F7FAFF',
    textMuted: 'rgba(247, 250, 255, 0.72)',
    mutedBorder: 'rgba(255, 255, 255, 0.16)',
    glassBorder: 'rgba(235, 203, 139, 0.3)',
    glassBackground: 'rgba(255, 255, 255, 0.08)',
    primaryBackground: '#1A2238',
    brightGold: '#E8B44D',
    parchment: '#fff9ef',
    sacredDeepBlue: '#1B2848',
    sacredMidBlue: '#324D7A',
    sacredGold: '#E8D3A6',
  },
};

const applyThemePalette = (themeId: ThemeId) => {
  const palette = themePalettes[themeId];
  Object.assign(RootColors, palette);
  Object.assign(LocalColors, {
    ...palette,
    antiqueGold: palette.accentGold,
    muted: palette.mutedBorder,
  });
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const getDefaultThemeByTime = (): ThemeId => {
  const hour = new Date().getHours();
  if (hour >= 19 || hour < 6) {
    return 'midnight_reverence';
  }
  return 'dawn_mercy';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeIdState, setThemeIdState] = useState<ThemeId>(() => {
    const saved = Settings.get('mkp.theme');
    if (saved === 'dawn_mercy' || saved === 'midnight_reverence') {
      applyThemePalette(saved);
      return saved;
    }
    const initial = getDefaultThemeByTime();
    applyThemePalette(initial);
    Settings.set({ 'mkp.theme': initial });
    return initial;
  });

  const setThemeId = (nextTheme: ThemeId) => {
    Settings.set({ 'mkp.theme': nextTheme });
    applyThemePalette(nextTheme);
    setThemeIdState(nextTheme);
  };
  const themeId = themeIdState;

  const value = useMemo(
    () => ({
      themeId,
      setThemeId,
      themeOptions,
    }),
    [themeId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

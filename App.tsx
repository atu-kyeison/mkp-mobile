import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Cinzel_400Regular,
  Cinzel_700Bold,
} from '@expo-google-fonts/cinzel';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { Colors } from './constants/Colors';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider } from './src/i18n/I18nProvider';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

const ThemedAppShell = ({ onLayoutRootView }: { onLayoutRootView: () => Promise<void> }) => {
  const { themeId } = useTheme();
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <RootNavigator key={`theme-${themeId}`} />
      <StatusBar style="light" />
    </View>
  );
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Cinzel_400Regular,
    Cinzel_700Bold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
    // Normalize to the more readable non-italic style across screens.
    PlayfairDisplay_400Regular_Italic: PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold_Italic: PlayfairDisplay_700Bold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    // Map legacy display families to readable settings-era typography.
    Newsreader_400Regular: PlayfairDisplay_400Regular,
    Newsreader_400Regular_Italic: PlayfairDisplay_400Regular,
    Newsreader_500Medium: PlayfairDisplay_500Medium,
    Newsreader_600SemiBold: PlayfairDisplay_700Bold,
    Newsreader_700Bold: PlayfairDisplay_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <ThemedAppShell onLayoutRootView={onLayoutRootView} />
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark || '#0D1B2A',
  },
});

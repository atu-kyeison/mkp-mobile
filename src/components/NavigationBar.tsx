import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../theme/ThemeProvider';

interface NavigationBarProps {
  activeTab: 'HOME' | 'JOURNEY' | 'CHURCH' | 'PROFILE';
  onTabPress: (tab: 'HOME' | 'JOURNEY' | 'CHURCH' | 'PROFILE') => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { themeId } = useTheme();
  const styles = useMemo(() => createStyles(), [themeId]);
  const tabs: Array<{ id: typeof activeTab; icon: keyof typeof MaterialIcons.glyphMap }> = [
    { id: 'HOME', icon: 'home' },
    { id: 'JOURNEY', icon: 'route' },
    { id: 'CHURCH', icon: 'church' },
    { id: 'PROFILE', icon: 'person' },
  ];

  return (
    <View style={[styles.container, { bottom: Math.max(16, insets.bottom + 8) }]}>
      <View style={styles.capsule}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => onTabPress(tab.id)}
            >
              <MaterialIcons
                name={tab.icon}
                size={24}
                color={Colors.accentGold}
                style={{ opacity: isActive ? 1 : 0.5 }}
              />
              <Text style={[
                styles.label,
                { opacity: isActive ? 1 : 0.5 }
              ]}>
                {t(`nav.${tab.id.toLowerCase()}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  capsule: {
    width: '90%',
    maxWidth: 380,
    height: 72,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    // Backdrop blur is not easily supported in RN without extra libs like @react-native-community/blur
    // but for now we'll use semi-transparency.
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: Colors.accentGold,
    marginTop: 4,
    letterSpacing: 1,
  },
});

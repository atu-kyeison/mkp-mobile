import { Settings } from 'react-native';

const KEYS = {
  reminders: 'mkp.pref.reminders',
  churchMessages: 'mkp.pref.churchMessages',
  encouragement: 'mkp.pref.encouragement',
} as const;

export type CommunicationPrefs = {
  reminders: boolean;
  churchMessages: boolean;
  encouragement: boolean;
};

const getBoolean = (key: string, fallback: boolean) => {
  const value = Settings.get(key);
  return typeof value === 'boolean' ? value : fallback;
};

export const getCommunicationPrefs = (): CommunicationPrefs => ({
  reminders: getBoolean(KEYS.reminders, true),
  churchMessages: getBoolean(KEYS.churchMessages, true),
  encouragement: getBoolean(KEYS.encouragement, false),
});

export const setReminderPreference = (value: boolean) => {
  Settings.set({ [KEYS.reminders]: value });
};

export const setChurchMessagesPreference = (value: boolean) => {
  Settings.set({ [KEYS.churchMessages]: value });
};

export const setEncouragementPreference = (value: boolean) => {
  Settings.set({ [KEYS.encouragement]: value });
};

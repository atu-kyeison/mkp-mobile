import { Settings } from 'react-native';

const CHURCH_MESSAGES_KEY = 'mkp.church.messages';

export type ChurchMessage = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  kind: 'pastoral' | 'announcement' | 'reminder';
};

const parseMessages = (raw: unknown): ChurchMessage[] => {
  if (typeof raw !== 'string' || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === 'object') as ChurchMessage[];
  } catch {
    return [];
  }
};

export const getChurchMessages = (): ChurchMessage[] => {
  const raw = Settings.get(CHURCH_MESSAGES_KEY);
  return parseMessages(raw).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const replaceChurchMessages = (messages: ChurchMessage[]) => {
  Settings.set({ [CHURCH_MESSAGES_KEY]: JSON.stringify(messages) });
};

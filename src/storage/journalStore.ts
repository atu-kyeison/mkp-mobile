import { Settings } from 'react-native';

const JOURNAL_KEY = 'mkp.journal.entries';

export type JournalEntry = {
  id: string;
  createdAt: string;
  body: string;
  invitationText?: string;
  journalVariant?: 'early_week' | 'mid_week';
  mood?: string;
  linkedSermonTitle?: string;
};

const parseEntries = (raw: unknown): JournalEntry[] => {
  if (typeof raw !== 'string' || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === 'object') as JournalEntry[];
  } catch {
    return [];
  }
};

export const getJournalEntries = (): JournalEntry[] => {
  const raw = Settings.get(JOURNAL_KEY);
  return parseEntries(raw)
    .filter((entry) => typeof entry.id === 'string' && typeof entry.createdAt === 'string' && typeof entry.body === 'string')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const saveJournalEntries = (entries: JournalEntry[]) => {
  Settings.set({ [JOURNAL_KEY]: JSON.stringify(entries) });
};

export const addJournalEntry = (entry: JournalEntry): JournalEntry[] => {
  const existing = getJournalEntries();
  const next = [entry, ...existing];
  saveJournalEntries(next);
  return next;
};

export const getJournalEntryById = (id: string): JournalEntry | null => {
  if (!id) return null;
  const entries = getJournalEntries();
  return entries.find((entry) => entry.id === id) || null;
};

export const updateJournalEntry = (
  id: string,
  updates: Partial<Pick<JournalEntry, 'body' | 'invitationText' | 'journalVariant' | 'mood' | 'linkedSermonTitle'>>
): JournalEntry[] => {
  const existing = getJournalEntries();
  const next = existing.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry));
  saveJournalEntries(next);
  return next;
};

export const deleteJournalEntry = (id: string): JournalEntry[] => {
  const existing = getJournalEntries();
  const next = existing.filter((entry) => entry.id !== id);
  saveJournalEntries(next);
  return next;
};

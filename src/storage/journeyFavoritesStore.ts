import { Settings } from './deviceSettings';

const FAVORITES_KEY = 'mkp.journey.favoriteIds';

const parseFavorites = (raw: unknown): string[] => {
  if (typeof raw !== 'string' || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
  } catch {
    return [];
  }
};

export const getJourneyFavoriteIds = (): string[] => {
  const raw = Settings.get(FAVORITES_KEY);
  return parseFavorites(raw);
};

export const saveJourneyFavoriteIds = (favoriteIds: string[]) => {
  Settings.set({ [FAVORITES_KEY]: JSON.stringify(favoriteIds) });
};

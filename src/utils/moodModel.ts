const MOOD_EMOJI: Record<string, string> = {
  peaceful: '🌤️',
  rushed: '🌬️',
  anxious: '⛈️',
  grateful: '☀️',
  tired: '🌙',
  heavy: '🌧️',
  longing: '✨',
};

const MOOD_COLORS: Record<string, string> = {
  peaceful: 'rgba(186, 175, 142, 0.62)',
  rushed: 'rgba(176, 132, 96, 0.56)',
  anxious: 'rgba(114, 136, 168, 0.56)',
  grateful: 'rgba(229, 185, 95, 0.72)',
  tired: 'rgba(123, 133, 151, 0.5)',
  heavy: 'rgba(111, 125, 148, 0.62)',
  longing: 'rgba(201, 165, 98, 0.6)',
};

const MOOD_SCORES: Record<string, number> = {
  anxious: -2,
  rushed: -1,
  tired: -1,
  heavy: -2,
  longing: 1,
  grateful: 1,
  peaceful: 2,
};

export const normalizeMoodId = (mood: unknown) => {
  const normalized = String(mood || '').trim().toLowerCase();
  if (normalized === 'focused') return 'peaceful';
  return normalized;
};

export const getMoodEmoji = (mood: unknown) => MOOD_EMOJI[normalizeMoodId(mood)] || '🌿';

export const getMoodColor = (mood: unknown) =>
  MOOD_COLORS[normalizeMoodId(mood)] || 'rgba(130, 154, 177, 0.7)';

export const getMoodScore = (mood: unknown) => MOOD_SCORES[normalizeMoodId(mood)] ?? 0;

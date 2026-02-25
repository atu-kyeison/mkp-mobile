export const getTodayFormationDateLabel = (locale = 'en-US'): string => {
  const now = new Date();
  const weekday = now.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase();
  const month = now.toLocaleDateString(locale, { month: 'short' }).toUpperCase();
  return `${weekday} • ${month} ${now.getDate()}`;
};

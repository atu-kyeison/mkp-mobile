export const getTodayFormationDateLabel = (locale = 'en-US'): string => {
  const now = new Date();
  const weekday = now.toLocaleDateString(locale, { weekday: 'long' }).toUpperCase();
  const month = now.toLocaleDateString(locale, { month: 'short' }).toUpperCase();
  return `${weekday} • ${month} ${now.getDate()}`;
};

export const getTimeAwareFormationGreeting = (locale = 'en-US'): string => {
  const hour = new Date().getHours();
  const isSpanish = locale.startsWith('es');

  if (hour < 12) {
    return isSpanish ? 'Buenos días.' : 'Good morning.';
  }
  if (hour < 18) {
    return isSpanish ? 'Buenas tardes.' : 'Good afternoon.';
  }
  return isSpanish ? 'Buenas noches.' : 'Good evening.';
};

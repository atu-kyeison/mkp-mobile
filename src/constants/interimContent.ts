export type InterimContentLocale = 'en' | 'es';

type JourneyInterimContent = {
  libraryEmptyTitle: string;
  libraryEmptyBody: string;
  libraryEmptyCta: string;
  favoritesEmptyBody: string;
  pastAwarenessEmptyTitle: string;
  pastAwarenessEmptyBody: string;
};

type InsightsInterimContent = {
  rhythmEmpty: string;
  noticeTitle: string;
  noticeBody: string;
  monthBody: string;
  metricsFallback: string;
};

type InterimContent = {
  journey: JourneyInterimContent;
  insights: InsightsInterimContent;
};

const INTERIM_CONTENT: Record<InterimContentLocale, InterimContent> = {
  en: {
    journey: {
      libraryEmptyTitle: 'Begin your private rhythm.',
      libraryEmptyBody:
        'Your reflections and mood notes stay on this device. Start with one honest reflection today.',
      libraryEmptyCta: 'WRITE YOUR FIRST REFLECTION',
      favoritesEmptyBody:
        'Save reflections to favorites when you want to revisit what God is shaping over time.',
      pastAwarenessEmptyTitle: 'No mood check-ins yet.',
      pastAwarenessEmptyBody:
        'When you log your inner posture, it will appear here as part of your formation rhythm.',
    },
    insights: {
      rhythmEmpty: 'Log a few mood check-ins this week to see your rhythm arc.',
      noticeTitle: 'Start with presence, not performance.',
      noticeBody:
        'Insights become available after a few honest check-ins. This is for awareness, not evaluation.',
      monthBody:
        'As your daily reflections grow, this section will help you notice month-to-month formation patterns.',
      metricsFallback: 'No local entries yet for this period.',
    },
  },
  es: {
    journey: {
      libraryEmptyTitle: 'Comienza tu ritmo privado.',
      libraryEmptyBody:
        'Tus reflexiones y estados permanecen en este dispositivo. Empieza con una reflexión honesta hoy.',
      libraryEmptyCta: 'ESCRIBE TU PRIMERA REFLEXIÓN',
      favoritesEmptyBody:
        'Guarda reflexiones en favoritos cuando quieras volver a lo que Dios está formando con el tiempo.',
      pastAwarenessEmptyTitle: 'Todavía no hay registros de estado.',
      pastAwarenessEmptyBody:
        'Cuando registres tu postura interior, aparecerá aquí como parte de tu ritmo de formación.',
    },
    insights: {
      rhythmEmpty: 'Registra algunos estados esta semana para ver tu arco de ritmo.',
      noticeTitle: 'Comienza con presencia, no con rendimiento.',
      noticeBody:
        'Los insights aparecen después de algunos registros honestos. Esto es para conciencia, no para evaluación.',
      monthBody:
        'Cuando crezcan tus reflexiones diarias, esta sección te ayudará a notar patrones de formación entre meses.',
      metricsFallback: 'Aún no hay entradas locales para este periodo.',
    },
  },
};

export const getInterimContent = (locale: InterimContentLocale): InterimContent =>
  INTERIM_CONTENT[locale];

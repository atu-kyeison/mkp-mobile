import { JournalEntry } from '../storage/journalStore';

const SAMPLE_MOODS = ['peaceful', 'rushed', 'anxious', 'grateful', 'tired', 'focused'] as const;

const findPreviousNonSunday = (startDate: Date, offset: number) => {
  const cursor = new Date(startDate);
  let remaining = offset;

  while (remaining > 0) {
    cursor.setDate(cursor.getDate() - 1);
    if (cursor.getDay() !== 0) {
      remaining -= 1;
    }
  }

  while (cursor.getDay() === 0) {
    cursor.setDate(cursor.getDate() - 1);
  }

  return cursor;
};

export const buildJourneyPreviewEntries = (locale: 'en' | 'es', totalEntries = 6): JournalEntry[] => {
  const today = new Date();

  return Array.from({ length: totalEntries }, (_, index) => {
    const mood = SAMPLE_MOODS[index % SAMPLE_MOODS.length];
    const entryDate = findPreviousNonSunday(today, index);
    entryDate.setHours(9, 0, 0, 0);

    return {
      id: `journey-preview-${mood}-${index}`,
      createdAt: entryDate.toISOString(),
      body:
        locale === 'es'
          ? mood === 'peaceful'
            ? 'Hoy sentí una quietud serena y noté cuánto se aligeró mi espíritu cuando bajé el ritmo.'
            : mood === 'rushed'
              ? 'Todo se sintió rápido hoy. Necesité pausar y dejar que Dios reiniciara mi ritmo.'
              : mood === 'anxious'
                ? 'Había tensión bajo la superficie, pero nombrarla me ayudó a dejar de cargarla solo.'
                : mood === 'grateful'
                  ? 'Noté varios regalos pequeños hoy y sentí cómo mi corazón se suavizaba en gratitud.'
                  : mood === 'tired'
                    ? 'Mi cuerpo y mi mente se sintieron agotados, así que elegí el descanso en lugar de forzar más.'
                    : 'Mi atención se sintió inusualmente clara hoy, y quise mantenerme alineado con lo que más importa.'
          : mood === 'peaceful'
            ? 'I felt a quiet steadiness today and noticed how much lighter my spirit became when I slowed down.'
            : mood === 'rushed'
              ? 'Everything felt fast today. I needed to pause and let God reset my pace.'
              : mood === 'anxious'
                ? 'There was tension under the surface, but naming it helped me stop carrying it alone.'
                : mood === 'grateful'
                  ? 'I noticed several small gifts today and felt my heart soften in gratitude.'
                  : mood === 'tired'
                    ? 'My body and mind felt worn down, so I chose rest over forcing more output.'
                    : 'My attention felt unusually clear today, and I wanted to stay aligned with what mattered most.',
      invitationText:
        locale === 'es'
          ? 'Un momento sencillo de conciencia se volvió parte de la formación de hoy.'
          : 'A simple moment of awareness became part of today’s formation.',
      journalVariant: 'mid_week',
      mood,
      linkedSermonTitle: index % 2 === 0 ? (locale === 'es' ? 'Permanece y descansa' : 'Abide and Remain') : undefined,
      linkedSermonUrl: index % 2 === 0 ? 'https://www.youtube.com/' : undefined,
    };
  });
};

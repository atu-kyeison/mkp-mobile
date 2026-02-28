import { JournalEntry } from '../storage/journalStore';

type SupportedLocale = 'en' | 'es';
type Translate = (key: string) => string;

export type InsightResult = {
  noticeText: string;
  summaryText: string;
  signalLabels: string[];
  metricsText: string;
};

export type MonthComparisonResult = {
  titleText: string;
  bodyText: string;
  supportingText: string;
};

const MOOD_SCORES: Record<string, number> = {
  anxious: -2,
  rushed: -1,
  tired: -1,
  focused: 1,
  grateful: 1,
  peaceful: 2,
};

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const diffInDays = (a: Date, b: Date) =>
  Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000);

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

const uniqueDayKeys = (entries: JournalEntry[]) =>
  Array.from(new Set(entries.map((entry) => entry.createdAt.slice(0, 10)))).sort();

const regularityScore = (dayKeys: string[]) => {
  if (dayKeys.length < 3) return null;
  const gaps: number[] = [];
  for (let index = 1; index < dayKeys.length; index += 1) {
    gaps.push(diffInDays(new Date(dayKeys[index]), new Date(dayKeys[index - 1])));
  }
  const avgGap = average(gaps);
  const variance = average(gaps.map((gap) => Math.abs(gap - avgGap)));
  return { avgGap, variance };
};

const volatilityScore = (scores: number[]) => {
  if (scores.length < 2) return null;
  const swings: number[] = [];
  for (let index = 1; index < scores.length; index += 1) {
    swings.push(Math.abs(scores[index] - scores[index - 1]));
  }
  return average(swings);
};

const countRecoveries = (scores: number[]) => {
  let recoveries = 0;
  for (let index = 0; index < scores.length - 1; index += 1) {
    if (scores[index] <= -1 && scores[index + 1] >= 1) recoveries += 1;
  }
  return recoveries;
};

const signalLabel = (signal: string, locale: SupportedLocale) => {
  const labels: Record<string, { en: string; es: string }> = {
    steady_cadence: { en: 'Steady cadence', es: 'Cadencia constante' },
    scattered_cadence: { en: 'Scattered cadence', es: 'Cadencia dispersa' },
    rising_strain: { en: 'Rising strain', es: 'Tensión en aumento' },
    growing_steadiness: { en: 'Growing steadiness', es: 'Mayor estabilidad' },
    recovery_present: { en: 'Recovery present', es: 'Recuperación visible' },
    high_variation: { en: 'High variation', es: 'Alta variación' },
    sunday_anchor: { en: 'Sunday anchored', es: 'Anclado al domingo' },
  };
  return labels[signal]?.[locale] || signal;
};

export const generateFormationInsight = ({
  locale,
  t,
  currentWeekEntries,
  previousWeekEntries,
}: {
  locale: SupportedLocale;
  t: Translate;
  currentWeekEntries: JournalEntry[];
  previousWeekEntries: JournalEntry[];
}): InsightResult => {
  const currentMoodEntries = currentWeekEntries
    .filter((entry) => Boolean(entry.mood))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const previousMoodEntries = previousWeekEntries
    .filter((entry) => Boolean(entry.mood))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const currentScores = currentMoodEntries.map((entry) => MOOD_SCORES[String(entry.mood).toLowerCase()] ?? 0);
  const previousScores = previousMoodEntries.map((entry) => MOOD_SCORES[String(entry.mood).toLowerCase()] ?? 0);
  const currentDays = uniqueDayKeys(currentWeekEntries);
  const previousDays = uniqueDayKeys(previousWeekEntries);
  const cadence = regularityScore(currentDays);
  const currentVolatility = volatilityScore(currentScores);
  const previousAverage = average(previousScores);
  const currentAverage = average(currentScores);
  const averageDelta = currentAverage - previousAverage;
  const recoveries = countRecoveries(currentScores);
  const sundayLinkedCount = currentWeekEntries.filter((entry) => Boolean(entry.linkedSermonTitle)).length;
  const dominantMood = Array.from(new Set(currentMoodEntries.map((entry) => String(entry.mood).toLowerCase())))
    .map((mood) => ({
      mood,
      count: currentMoodEntries.filter((entry) => String(entry.mood).toLowerCase() === mood).length,
    }))
    .sort((a, b) => b.count - a.count)[0];

  const signals: string[] = [];
  if (cadence && currentDays.length >= 4) {
    if (cadence.variance <= 0.4) signals.push('steady_cadence');
    if (cadence.variance >= 1.1) signals.push('scattered_cadence');
  }
  if (recoveries >= 1) signals.push('recovery_present');
  if (currentVolatility !== null && currentVolatility >= 2.2) signals.push('high_variation');
  if (sundayLinkedCount >= 2) signals.push('sunday_anchor');
  if (previousScores.length >= 2 && averageDelta >= 0.8) signals.push('growing_steadiness');
  if (previousScores.length >= 2 && averageDelta <= -0.8) signals.push('rising_strain');

  let noticeText: string;
  if (signals.includes('recovery_present')) {
    noticeText =
      locale === 'es'
        ? '"Después de días más pesados, tus registros también muestran señales de recuperación. Eso sugiere que no solo estás sintiendo la semana; también estás aprendiendo a volver al reposo y a la atención delante de Dios."'
        : '"After lower days, your check-ins also show signs of recovery. That suggests you are not only feeling the week; you are learning how to return to rest and attentiveness before God."';
  } else if (signals.includes('steady_cadence') && signals.includes('growing_steadiness')) {
    noticeText =
      locale === 'es'
        ? '"Tu ritmo fue constante esta semana y tu estado general se sintió más estable que la semana pasada. Eso parece menos impulso y más formación."'
        : '"Your rhythm was steady this week, and your overall posture felt calmer than last week. That looks less like momentum and more like formation."';
  } else if (signals.includes('rising_strain')) {
    noticeText =
      locale === 'es'
        ? '"En comparación con la semana pasada, esta cargó más tensión. Eso no es fracaso; es una señal para bajar el ritmo y prestar atención a lo que te está agotando."'
        : '"Compared with last week, this one carried more strain. That is not failure; it is a signal to slow down and notice what is wearing you down."';
  } else if (signals.includes('high_variation')) {
    noticeText =
      locale === 'es'
        ? '"Tus estados cambiaron bastante de un día a otro. La semana no fue lineal, lo cual hace aún más valioso notar qué te ayudó a mantenerte presente."'
        : '"Your mood states shifted quite a bit from day to day. The week was not linear, which makes it even more useful to notice what helped you stay present."';
  } else if (signals.includes('sunday_anchor')) {
    noticeText =
      locale === 'es'
        ? '"Varias de tus reflexiones siguieron conectadas al domingo. Eso sugiere que el mensaje no se quedó en un solo momento; siguió acompañando tu semana."'
        : '"Several of your reflections stayed connected to Sunday. That suggests the message did not remain a single moment; it kept accompanying your week."';
  } else if (dominantMood && dominantMood.count >= 3) {
    noticeText =
      locale === 'es'
        ? `"${t(`mood.label.${dominantMood.mood}`)} fue el estado que más se repitió esta semana. Eso parece estar marcando el tono espiritual y emocional de tus días."`
        : `"${t(`mood.label.${dominantMood.mood}`)} appeared most often this week. That seems to be shaping the spiritual and emotional tone of your days."`;
  } else if (currentDays.length <= 1) {
    noticeText =
      locale === 'es'
        ? '"Todavía hay poca información esta semana, pero incluso una pausa honesta ya es parte de la formación."'
        : '"There is still very little data this week, but even one honest pause is already part of formation."';
  } else {
    noticeText =
      locale === 'es'
        ? '"Tu semana muestra un ritmo en formación. Lo importante no es la perfección del patrón, sino que seguiste regresando con honestidad."'
        : '"Your week shows a rhythm taking shape. What matters is not a perfect pattern, but that you kept returning with honesty."';
  }

  let summaryText: string;
  if (signals.includes('steady_cadence') && cadence) {
    summaryText =
      locale === 'es'
        ? `Tu ritmo apareció con bastante regularidad, más o menos cada ${cadence.avgGap.toFixed(1)} días.`
        : `Your rhythm appeared with fairly even spacing, roughly every ${cadence.avgGap.toFixed(1)} days.`;
  } else if (signals.includes('scattered_cadence')) {
    summaryText =
      locale === 'es'
        ? 'Tus pausas estuvieron más agrupadas que distribuidas. Puede ayudarte reservar un momento más pequeño, pero más regular.'
        : 'Your pauses came in clusters more than in an even rhythm. A smaller but more regular pause may help.';
  } else if (signals.includes('growing_steadiness')) {
    summaryText =
      locale === 'es'
        ? 'La calidad general de tus registros se sintió más estable que la semana anterior.'
        : 'The overall tone of your recent check-ins felt steadier than the week before.';
  } else if (signals.includes('rising_strain')) {
    summaryText =
      locale === 'es'
        ? 'La tensión promedio fue mayor que en la semana anterior, así que conviene notar qué cambió.'
        : 'Average strain was higher than the week before, so it is worth noticing what changed.';
  } else if (signals.includes('sunday_anchor')) {
    summaryText =
      locale === 'es'
        ? `${sundayLinkedCount} reflexiones de esta semana siguieron ancladas al mensaje del domingo.`
        : `${sundayLinkedCount} reflections this week stayed anchored to Sunday’s message.`;
  } else if (signals.includes('high_variation')) {
    summaryText =
      locale === 'es'
        ? 'Hubo varios cambios bruscos entre registros, lo cual apunta a una semana emocionalmente variable.'
        : 'There were several sharp shifts between check-ins, which points to a more variable week.';
  } else if (dominantMood) {
    summaryText =
      locale === 'es'
        ? `El estado más repetido fue ${t(`mood.label.${dominantMood.mood}`)}.`
        : `The most repeated posture was ${t(`mood.label.${dominantMood.mood}`)}.`;
  } else {
    summaryText =
      locale === 'es'
        ? 'Sigue registrando tu semana para que estas observaciones ganen más claridad.'
        : 'Keep checking in through the week so these observations can become clearer.';
  }

  const metricParts =
    locale === 'es'
      ? [
          `${currentMoodEntries.length} check-ins recientes`,
          `${currentDays.length} días activos`,
          previousDays.length > 0 ? `${previousDays.length} días la semana anterior` : null,
        ].filter(Boolean)
      : [
          `${currentMoodEntries.length} recent check-ins`,
          `${currentDays.length} active days`,
          previousDays.length > 0 ? `${previousDays.length} days last week` : null,
        ].filter(Boolean);

  return {
    noticeText,
    summaryText,
    metricsText:
      locale === 'es'
        ? `Esta lectura se apoya en ${metricParts.join(', ')}.`
        : `This reading is based on ${metricParts.join(', ')}.`,
    signalLabels: Array.from(new Set(signals)).map((signal) => signalLabel(signal, locale)),
  };
};

export const generateMonthComparison = ({
  locale,
  t,
  currentMonthEntries,
  previousMonthEntries,
}: {
  locale: SupportedLocale;
  t: Translate;
  currentMonthEntries: JournalEntry[];
  previousMonthEntries: JournalEntry[];
}): MonthComparisonResult => {
  const currentDays = uniqueDayKeys(currentMonthEntries);
  const previousDays = uniqueDayKeys(previousMonthEntries);
  const currentMoodEntries = currentMonthEntries.filter((entry) => Boolean(entry.mood));
  const previousMoodEntries = previousMonthEntries.filter((entry) => Boolean(entry.mood));
  const currentAverage = average(
    currentMoodEntries.map((entry) => MOOD_SCORES[String(entry.mood).toLowerCase()] ?? 0)
  );
  const previousAverage = average(
    previousMoodEntries.map((entry) => MOOD_SCORES[String(entry.mood).toLowerCase()] ?? 0)
  );
  const currentSundayLinked = currentMonthEntries.filter((entry) => Boolean(entry.linkedSermonTitle)).length;
  const previousSundayLinked = previousMonthEntries.filter((entry) => Boolean(entry.linkedSermonTitle)).length;

  let bodyText: string;
  if (currentDays.length >= previousDays.length + 3) {
    bodyText =
      locale === 'es'
        ? 'Te has presentado con más constancia este mes que en el mismo tramo del mes anterior.'
        : 'You have shown up more consistently this month than in the same stretch of last month.';
  } else if (currentAverage >= previousAverage + 0.75) {
    bodyText =
      locale === 'es'
        ? 'El tono general de este mes se siente más estable que el del mes anterior.'
        : 'The overall tone of this month feels steadier than the month before.';
  } else if (currentAverage <= previousAverage - 0.75) {
    bodyText =
      locale === 'es'
        ? 'Este mes ha cargado más peso que el anterior. Vale la pena notar qué está presionando tu ritmo.'
        : 'This month has carried more weight than the one before. It is worth noticing what is pressing on your rhythm.';
  } else {
    bodyText =
      locale === 'es'
        ? 'Tu ritmo mensual se está formando poco a poco. No parece una racha; parece una práctica en crecimiento.'
        : 'Your monthly rhythm is taking shape little by little. It does not look like a streak; it looks like a practice growing over time.';
  }

  const sundayLine =
    currentSundayLinked > previousSundayLinked
      ? locale === 'es'
        ? 'El mensaje del domingo siguió acompañando más tus reflexiones este mes.'
        : 'Sunday’s message carried into more of your reflections this month.'
      : currentSundayLinked < previousSundayLinked
        ? locale === 'es'
          ? 'Hubo menos reflexiones ancladas al domingo que el mes pasado.'
          : 'Fewer reflections stayed anchored to Sunday than last month.'
        : locale === 'es'
          ? 'La continuidad con el domingo se mantuvo similar al mes pasado.'
          : 'Your carry-through from Sunday stayed similar to last month.';

  const supportingText =
    locale === 'es'
      ? `${currentDays.length} días con actividad este mes frente a ${previousDays.length} en el mismo tramo del mes anterior. ${sundayLine}`
      : `${currentDays.length} active days this month compared with ${previousDays.length} over the same span last month. ${sundayLine}`;

  return {
    titleText: locale === 'es' ? 'FORMACIÓN MES A MES' : 'FORMATION MONTH OVER MONTH',
    bodyText,
    supportingText,
  };
};

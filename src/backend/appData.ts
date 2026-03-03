import { useCallback } from 'react';
import { saveWeeklyFormationPackage } from '../../screens/Formation/formationContent';
import { replaceCareThreads } from '../storage/careInboxStore';
import { replaceChurchMessages } from '../storage/churchMessagesStore';
import { useSession } from './SessionProvider';

type FormationWeek = {
  weekStartDate: string;
  days?: Record<string, { title?: string; prompt?: string }>;
  truths?: string[];
  scriptureRefs?: string[];
  listen?: { url?: string | null };
  sunday?: { summary?: string };
};

const buildFormationLocalePack = (
  week: FormationWeek,
  locale: 'en' | 'es'
) => {
  const days = week.days || {};
  const truth = week.truths?.[0] || '';
  const scripture = week.scriptureRefs?.[0] || '';
  const listenLabel = locale === 'es' ? 'Escuchar' : 'Listen';

  return {
    monday: {
      topLabel: locale === 'es' ? 'ENFOQUE DE HOY' : "TODAY'S FOCUS",
      focusTagline: days.monday?.title || '',
      greeting: locale === 'es' ? 'Buenos días.' : 'Good morning.',
      sundayMessageLabel:
        locale === 'es' ? 'Del mensaje del domingo' : "From Sunday's Message",
      sundayMessageText: week.sunday?.summary || truth,
      listenLabel,
      practiceLabel: days.monday?.title || (locale === 'es' ? 'Práctica de hoy' : "Today's Practice"),
      practiceText: days.monday?.prompt || truth,
      practiceButton: locale === 'es' ? 'PRACTICAR' : 'STEP INTO PRACTICE',
      practiceVariant: 'early_week' as const,
      prayerLabel: locale === 'es' ? 'INVITACIÓN A ORAR' : 'INVITATION TO PRAY',
      prayerText: truth,
      scriptureLabel: locale === 'es' ? 'Escritura de hoy' : "Today's Scripture",
      scriptureText: truth,
      scriptureReference: scripture,
    },
    tuesday: {
      topLabel: locale === 'es' ? 'ENFOQUE DE HOY' : "TODAY'S FOCUS",
      focusTagline: days.tuesday?.title || '',
      greeting: locale === 'es' ? 'Buenos días.' : 'Good morning.',
      sundayMessageLabel:
        locale === 'es' ? 'Del mensaje del domingo' : "From Sunday's Message",
      sundayMessageText: week.sunday?.summary || truth,
      listenLabel,
      practiceLabel: days.tuesday?.title || (locale === 'es' ? 'Práctica de hoy' : "Today's Practice"),
      practiceText: days.tuesday?.prompt || truth,
      practiceButton: locale === 'es' ? 'PRACTICAR' : 'STEP INTO PRACTICE',
      practiceVariant: 'early_week' as const,
      prayerLabel: locale === 'es' ? 'INVITACIÓN A ORAR' : 'INVITATION TO PRAY',
      prayerText: truth,
      scriptureLabel: locale === 'es' ? 'Escritura de hoy' : "Today's Scripture",
      scriptureText: truth,
      scriptureReference: scripture,
    },
    wednesday: {
      topLabel: locale === 'es' ? 'ENFOQUE DE HOY' : "TODAY'S FOCUS",
      focusTagline: days.wednesday?.title || '',
      greeting: locale === 'es' ? 'Buenos días.' : 'Good morning.',
      sundayMessageLabel:
        locale === 'es' ? 'Del mensaje del domingo' : "From Sunday's Message",
      sundayMessageText: week.sunday?.summary || truth,
      listenLabel,
      practiceLabel: days.wednesday?.title || (locale === 'es' ? 'Perspectiva de hoy' : "Today's Insight"),
      practiceText: days.wednesday?.prompt || truth,
      practiceButton: locale === 'es' ? 'PAUSA Y OBSERVA' : 'PAUSE & NOTICE',
      practiceVariant: 'mid_week' as const,
      prayerLabel: locale === 'es' ? 'INVITACIÓN A ORAR' : 'INVITATION TO PRAY',
      prayerText: truth,
      scriptureLabel: locale === 'es' ? 'Escritura de hoy' : "Today's Scripture",
      scriptureText: truth,
      scriptureReference: scripture,
    },
    thursday: {
      topLabel: locale === 'es' ? 'ENFOQUE DE HOY' : "TODAY'S FOCUS",
      focusTagline: days.thursday?.title || '',
      greeting: locale === 'es' ? 'Buenos días.' : 'Good morning.',
      sundayMessageLabel:
        locale === 'es' ? 'Del mensaje del domingo' : "From Sunday's Message",
      sundayMessageText: week.sunday?.summary || truth,
      listenLabel,
      practiceLabel: days.thursday?.title || (locale === 'es' ? 'Entrega de hoy' : "Today's Surrender"),
      practiceText: days.thursday?.prompt || truth,
      practiceButton: locale === 'es' ? 'REFLEXIONAR' : 'REFLECT',
      practiceVariant: 'mid_week' as const,
      prayerLabel: locale === 'es' ? 'INVITACIÓN A ORAR' : 'INVITATION TO PRAY',
      prayerText: truth,
      scriptureLabel: locale === 'es' ? 'Escritura de hoy' : "Today's Scripture",
      scriptureText: truth,
      scriptureReference: scripture,
    },
    friday: {
      topLabel: locale === 'es' ? 'ENFOQUE DE HOY' : "TODAY'S FOCUS",
      focusTagline: days.friday?.title || '',
      greeting: locale === 'es' ? 'Buenos días.' : 'Good morning.',
      sundayMessageLabel:
        locale === 'es' ? 'Del mensaje del domingo' : "From Sunday's Message",
      sundayMessageText: week.sunday?.summary || truth,
      listenLabel,
      practiceLabel: days.friday?.title || (locale === 'es' ? 'Invitación de hoy' : "Today's Invitation"),
      practiceText: days.friday?.prompt || truth,
      practiceButton: locale === 'es' ? 'REFLEXIONAR' : 'REFLECT',
      practiceVariant: 'mid_week' as const,
      prayerLabel: locale === 'es' ? 'INVITACIÓN A ORAR' : 'INVITATION TO PRAY',
      prayerText: truth,
      scriptureLabel: locale === 'es' ? 'Escritura de hoy' : "Today's Scripture",
      scriptureText: truth,
      scriptureReference: scripture,
    },
    saturday: {
      topLabel: locale === 'es' ? 'ENFOQUE DE HOY' : "TODAY'S FOCUS",
      focusTagline: days.saturday?.title || '',
      greeting: locale === 'es' ? 'Buenos días.' : 'Good morning.',
      practiceLabel: days.saturday?.title || (locale === 'es' ? 'Postura de hoy' : "Today's Posture"),
      practiceText: days.saturday?.prompt || truth,
      practiceButton: locale === 'es' ? 'PERMANECE EN CALMA' : 'BE STILL',
      practiceVariant: 'mid_week' as const,
      prayerLabel: locale === 'es' ? 'INVITACIÓN A ORAR' : 'INVITATION TO PRAY',
      prayerText: truth,
      identityLabel: locale === 'es' ? 'IDENTIDAD' : 'IDENTITY',
      identityText: truth,
    },
  };
};

export const useAppDataSync = () => {
  const { callFunction, isAuthenticated, session } = useSession();

  const syncCareInbox = useCallback(async () => {
    if (!isAuthenticated || !session?.context?.currentChurchId) return;
    const result = await callFunction<{ threads: any[] }>('getCareInbox', {});
    replaceCareThreads(result.threads);
  }, [callFunction, isAuthenticated, session?.context?.currentChurchId]);

  const syncChurchMessages = useCallback(async () => {
    if (!isAuthenticated || !session?.context?.currentChurchId) return;
    const result = await callFunction<{ messages: any[] }>('getChurchMessagesFeed', {});
    replaceChurchMessages(result.messages);
  }, [callFunction, isAuthenticated, session?.context?.currentChurchId]);

  const syncFormationWeek = useCallback(async () => {
    if (!isAuthenticated || !session?.context?.currentChurchId) return;
    const result = await callFunction<{ week: FormationWeek | null }>('getCurrentFormationWeek', {});
    if (!result.week) return;

    saveWeeklyFormationPackage({
      weekStartIso: result.week.weekStartDate,
      generatedAt: new Date().toISOString(),
      locales: {
        en: buildFormationLocalePack(result.week, 'en'),
        es: buildFormationLocalePack(result.week, 'es'),
      },
    });
  }, [callFunction, isAuthenticated, session?.context?.currentChurchId]);

  return {
    syncCareInbox,
    syncChurchMessages,
    syncFormationWeek,
  };
};

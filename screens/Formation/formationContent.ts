export type FormationDayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type ReflectionVariant = 'early_week' | 'mid_week';

export interface FormationDayContent {
  topLabel: string;
  focusTagline: string;
  greeting: string;
  scriptureLabel?: string;
  scriptureText?: string;
  scriptureReference?: string;
  scriptureSpeech?: string;
  sundayMessageLabel?: string;
  sundayMessageText?: string;
  listenLabel?: string;
  practiceLabel: string;
  practiceText: string;
  practiceButton: string;
  practiceVariant: ReflectionVariant;
  prayerLabel: string;
  prayerText: string;
  identityLabel?: string;
  identityText?: string;
}

type SupportedFormationLocale = 'en' | 'es';

const FORMATION_CONTENT: Record<FormationDayKey, FormationDayContent> = {
  monday: {
    topLabel: "TODAY'S FOCUS",
    focusTagline: 'a gentle start',
    greeting: 'Good morning.',
    scriptureLabel: "Today's Scripture",
    scriptureText: '“Trust in the Lord with all your heart…”',
    scriptureReference: 'Proverbs 3:5-6',
    scriptureSpeech: 'Trust in the Lord with all your heart. Proverbs 3:5-6',
    sundayMessageLabel: "From Sunday's Message",
    sundayMessageText: 'Fruit comes from remaining, not striving.',
    listenLabel: 'Listen',
    practiceLabel: "Today's Practice",
    practiceText: 'Before you make a decision today, ask: “Am I acting from trust or from control?”',
    practiceButton: 'STEP INTO PRACTICE',
    practiceVariant: 'early_week',
    prayerLabel: 'INVITATION TO PRAY',
    prayerText: 'Pause and invite God into your decisions today, asking for trust over tension.',
  },
  tuesday: {
    topLabel: "TODAY'S FOCUS",
    focusTagline: 'take a step',
    greeting: 'Good morning.',
    scriptureLabel: "Today's Scripture",
    scriptureText: '“Trust in the Lord with all your heart…”',
    scriptureReference: 'Proverbs 3:5-6',
    scriptureSpeech: 'Trust in the Lord with all your heart. Proverbs 3:5-6',
    sundayMessageLabel: "From Sunday's Message",
    sundayMessageText: 'Fruit comes from remaining, not striving.',
    listenLabel: 'Listen',
    practiceLabel: "Today's Practice",
    practiceText: 'Before you make a decision today, ask: “Am I acting from trust or from control?”',
    practiceButton: 'STEP INTO PRACTICE',
    practiceVariant: 'early_week',
    prayerLabel: 'INVITATION TO PRAY',
    prayerText: 'Ask God for courage to take one faithful step instead of staying in hesitation.',
  },
  wednesday: {
    topLabel: "TODAY'S FOCUS",
    focusTagline: 'inner awareness',
    greeting: 'Good morning.',
    scriptureLabel: "TODAY'S SCRIPTURE",
    scriptureText: '“Search me, God, and know my heart…”',
    scriptureReference: 'Psalm 139:23',
    scriptureSpeech: 'Search me, God, and know my heart. Psalm 139:23',
    sundayMessageLabel: "FROM SUNDAY'S MESSAGE",
    sundayMessageText: 'Remaining in Christ reveals what striving hides.',
    listenLabel: 'LISTEN',
    practiceLabel: "TODAY'S INSIGHT",
    practiceText: 'Notice what is stirring beneath the surface today. God often meets us in what we are tempted to ignore.',
    practiceButton: 'PAUSE & NOTICE',
    practiceVariant: 'mid_week',
    prayerLabel: 'INVITATION TO PRAY',
    prayerText: 'Ask God to reveal what is beneath the surface and guide your response with honesty.',
  },
  thursday: {
    topLabel: "TODAY'S FOCUS",
    focusTagline: 'release & trust',
    greeting: 'Good morning',
    scriptureLabel: "Today's Scripture",
    scriptureText: '“If any of you lacks wisdom, let him ask God…”',
    scriptureReference: 'James 1:5',
    scriptureSpeech: 'If any of you lacks wisdom, let him ask God. James 1:5',
    sundayMessageLabel: "From Sunday's Message",
    sundayMessageText: 'Abiding teaches us how to respond, not react.',
    listenLabel: 'Listen',
    practiceLabel: "Today's Surrender",
    practiceText: 'Where this week are you reacting instead of responding? What would wisdom look like in that moment?',
    practiceButton: 'REFLECT',
    practiceVariant: 'mid_week',
    prayerLabel: 'INVITATION TO PRAY',
    prayerText: 'Bring your strongest reaction to God and ask for wisdom before you respond.',
  },
  friday: {
    topLabel: "TODAY'S FOCUS",
    focusTagline: 'gratitude & joy',
    greeting: 'Good morning',
    scriptureLabel: "TODAY'S SCRIPTURE",
    scriptureText: '“Give thanks in all circumstances; for this is God’s will for you in Christ Jesus.”',
    scriptureReference: '1 Thessalonians 5:18',
    scriptureSpeech: 'Give thanks in all circumstances, for this is God’s will for you in Christ Jesus. 1 Thessalonians 5:18',
    sundayMessageLabel: 'FROM SUNDAY',
    sundayMessageText: 'Gratitude turns what we have into enough, and more.',
    listenLabel: 'Listen',
    practiceLabel: "TODAY'S INVITATION",
    practiceText: 'What are three small things you are grateful for today? How have you seen God’s goodness throughout this past week?',
    practiceButton: 'REFLECT',
    practiceVariant: 'mid_week',
    prayerLabel: 'INVITATION TO PRAY',
    prayerText: 'Thank God for three signs of grace this week and ask for joy to carry forward.',
  },
  saturday: {
    topLabel: "TODAY'S FOCUS",
    focusTagline: 'rest',
    greeting: 'Good morning',
    practiceLabel: "TODAY'S POSTURE",
    practiceText: 'Nothing needs to be accomplished today. Rest is not a break from formation — it is part of it.',
    practiceButton: 'BE STILL',
    practiceVariant: 'mid_week',
    prayerLabel: 'INVITATION TO PRAY',
    prayerText: 'Sit quietly and release unfinished things to God, asking for rest in His care.',
    identityLabel: 'IDENTITY',
    identityText: 'You are held, not measured. You are loved, not evaluated.',
  },
};

const FORMATION_CONTENT_ES: Partial<Record<FormationDayKey, Partial<FormationDayContent>>> = {
  monday: {
    topLabel: 'ENFOQUE DE HOY',
    focusTagline: 'un comienzo apacible',
    greeting: 'Buenos días.',
    scriptureLabel: 'Escritura de hoy',
    scriptureText: '“Confía en el Señor con todo tu corazón…”',
    scriptureReference: 'Proverbios 3:5-6',
    scriptureSpeech: 'Confía en el Señor con todo tu corazón. Proverbios 3:5-6',
    sundayMessageLabel: 'Del mensaje del domingo',
    sundayMessageText: 'El fruto viene de permanecer, no de esforzarse.',
    listenLabel: 'Escuchar',
    practiceLabel: 'Práctica de hoy',
    practiceText: 'Antes de tomar una decisión hoy, pregúntate: “¿Actúo desde la confianza o desde el control?”',
    practiceButton: 'ENTRAR EN PRÁCTICA',
    prayerLabel: 'INVITACIÓN A ORAR',
    prayerText: 'Haz una pausa e invita a Dios a tus decisiones de hoy, pidiéndole confianza en lugar de tensión.',
  },
  tuesday: {
    topLabel: 'ENFOQUE DE HOY',
    focusTagline: 'da un paso',
    greeting: 'Buenos días.',
    scriptureLabel: 'Escritura de hoy',
    scriptureText: '“Confía en el Señor con todo tu corazón…”',
    scriptureReference: 'Proverbios 3:5-6',
    scriptureSpeech: 'Confía en el Señor con todo tu corazón. Proverbios 3:5-6',
    sundayMessageLabel: 'Del mensaje del domingo',
    sundayMessageText: 'El fruto viene de permanecer, no de esforzarse.',
    listenLabel: 'Escuchar',
    practiceLabel: 'Práctica de hoy',
    practiceText: 'Antes de tomar una decisión hoy, pregúntate: “¿Actúo desde la confianza o desde el control?”',
    practiceButton: 'ENTRAR EN PRÁCTICA',
    prayerLabel: 'INVITACIÓN A ORAR',
    prayerText: 'Pídele a Dios valor para dar un paso fiel en lugar de quedarte en la duda.',
  },
  wednesday: {
    topLabel: 'ENFOQUE DE HOY',
    focusTagline: 'conciencia interior',
    greeting: 'Buenos días.',
    scriptureLabel: 'ESCRITURA DE HOY',
    scriptureText: '“Examíname, oh Dios, y conoce mi corazón…”',
    scriptureReference: 'Salmo 139:23',
    scriptureSpeech: 'Examíname, oh Dios, y conoce mi corazón. Salmo 139:23',
    sundayMessageLabel: 'DEL MENSAJE DEL DOMINGO',
    sundayMessageText: 'Permanecer en Cristo revela lo que el esfuerzo oculta.',
    listenLabel: 'ESCUCHAR',
    practiceLabel: 'PERSPECTIVA DE HOY',
    practiceText: 'Observa qué se está moviendo bajo la superficie hoy. Dios a menudo nos encuentra en lo que intentamos ignorar.',
    practiceButton: 'PAUSA Y OBSERVA',
    prayerLabel: 'INVITACIÓN A ORAR',
    prayerText: 'Pídele a Dios que revele lo que está bajo la superficie y guíe tu respuesta con honestidad.',
  },
  thursday: {
    topLabel: 'ENFOQUE DE HOY',
    focusTagline: 'soltar y confiar',
    greeting: 'Buenos días',
    scriptureLabel: 'Escritura de hoy',
    scriptureText: '“Y si a alguno de ustedes le falta sabiduría, pídasela a Dios…”',
    scriptureReference: 'Santiago 1:5',
    scriptureSpeech: 'Y si a alguno de ustedes le falta sabiduría, pídasela a Dios. Santiago 1:5',
    sundayMessageLabel: 'Del mensaje del domingo',
    sundayMessageText: 'Permanecer nos enseña a responder, no a reaccionar.',
    listenLabel: 'Escuchar',
    practiceLabel: 'Entrega de hoy',
    practiceText: '¿En qué parte de esta semana estás reaccionando en lugar de responder? ¿Cómo se vería la sabiduría en ese momento?',
    practiceButton: 'REFLEXIONAR',
    prayerLabel: 'INVITACIÓN A ORAR',
    prayerText: 'Trae tu reacción más fuerte a Dios y pídele sabiduría antes de responder.',
  },
  friday: {
    topLabel: 'ENFOQUE DE HOY',
    focusTagline: 'gratitud y gozo',
    greeting: 'Buenos días',
    scriptureLabel: 'ESCRITURA DE HOY',
    scriptureText: '“Den gracias en toda circunstancia, porque esta es la voluntad de Dios para ustedes en Cristo Jesús.”',
    scriptureReference: '1 Tesalonicenses 5:18',
    scriptureSpeech: 'Den gracias en toda circunstancia, porque esta es la voluntad de Dios para ustedes en Cristo Jesús. 1 Tesalonicenses 5:18',
    sundayMessageLabel: 'DESDE EL DOMINGO',
    sundayMessageText: 'La gratitud transforma lo que tenemos en suficiente, y más.',
    listenLabel: 'ESCUCHAR',
    practiceLabel: 'INVITACIÓN DE HOY',
    practiceText: '¿Cuáles son tres cosas pequeñas por las que estás agradecido hoy? ¿Cómo has visto la bondad de Dios esta semana?',
    practiceButton: 'REFLEXIONAR',
    prayerLabel: 'INVITACIÓN A ORAR',
    prayerText: 'Agradece a Dios por tres señales de gracia esta semana y pídele gozo para continuar.',
  },
  saturday: {
    topLabel: 'ENFOQUE DE HOY',
    focusTagline: 'descanso',
    greeting: 'Buenos días',
    practiceLabel: 'POSTURA DE HOY',
    practiceText: 'Hoy no tienes que lograr nada. El descanso no es una pausa de la formación, es parte de ella.',
    practiceButton: 'PERMANECE EN CALMA',
    prayerLabel: 'INVITACIÓN A ORAR',
    prayerText: 'Siéntate en silencio y entrega a Dios lo que quedó pendiente, pidiéndole descanso en su cuidado.',
    identityLabel: 'IDENTIDAD',
    identityText: 'Eres sostenido, no medido. Eres amado, no evaluado.',
  },
};

// Backend handoff: replace this resolver with STT -> Gemini content payload.
export const getFormationDayContent = (
  day: FormationDayKey,
  locale: SupportedFormationLocale = 'en'
): FormationDayContent => {
  const base = FORMATION_CONTENT[day];
  const overrides = locale === 'es' ? FORMATION_CONTENT_ES[day] : undefined;
  return overrides ? { ...base, ...overrides } : base;
};

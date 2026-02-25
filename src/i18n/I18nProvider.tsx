import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type SupportedLocale = 'en' | 'es';

type Dictionary = Record<string, string>;

const dictionaries: Record<SupportedLocale, Dictionary> = {
  en: {
    'nav.home': 'HOME',
    'nav.journey': 'JOURNEY',
    'nav.church': 'CHURCH',
    'nav.profile': 'PROFILE',

    'auth.brand': 'MY KINGDOM PAL',
    'auth.welcome.title': 'Walk with the Word all week.',
    'auth.welcome.subtitle': 'Helping Believers Live the Word Every Day - Beyond Sunday',
    'auth.welcome.join': 'JOIN YOUR CHURCH',
    'auth.welcome.haveAccess': 'I ALREADY HAVE ACCESS',
    'auth.footer.prefix': 'By continuing, you agree to our',
    'auth.footer.terms': 'Terms of Service',
    'auth.footer.and': 'and',
    'auth.footer.privacy': 'Privacy Policy',

    'auth.signin.title': 'Welcome back',
    'auth.signin.subtitle': 'Continue your walk',
    'auth.signin.emailLabel': 'EMAIL ADDRESS',
    'auth.signin.passwordLabel': 'PASSWORD',
    'auth.signin.error': "That didn't match our records. Check your details or reset your password.",
    'auth.signin.tryAgain': 'TRY AGAIN',
    'auth.signin.submit': 'SIGN IN',
    'auth.signin.forgot': 'Forgot password?',

    'auth.signup.title': 'Start your journey',
    'auth.signup.subtitle': 'Create an account to begin',
    'auth.signup.firstNameLabel': 'FIRST NAME',
    'auth.signup.firstNamePlaceholder': 'Enter your name',
    'auth.signup.ageLine': 'I confirm I am at least 16 years old.',
    'auth.signup.ageSubline': 'My Kingdom Pal is designed for ages 16+.',
    'auth.signup.submit': 'CREATE ACCOUNT',
    'auth.signup.hasAccount': 'Already have an account?',
    'auth.signup.signin': 'Sign in',

    'auth.churchSearch.title': 'Find your church',
    'auth.churchSearch.subtitle': 'Enter the code your church gave you to join the community.',
    'auth.churchSearch.codeLabel': 'CHURCH CODE',
    'auth.churchSearch.submit': 'CONNECT',
    'auth.churchSearch.codeHelp': 'Where can I find my code?',
    'auth.churchSearch.helpTitle': 'Find Your Church Code',
    'auth.churchSearch.helpBody': 'Your church can provide this code from the Sunday slide, bulletin, or welcome team.',

    'auth.churchSuccess.title': "You're connected!",
    'auth.churchSuccess.description': 'Welcome to the family. Your journey with us begins today.',
    'auth.churchSuccess.submit': 'GO TO MY CHURCH',
    'auth.churchSuccess.continue': 'CONTINUE',
    'auth.churchSuccess.newBeliever': 'NEW TO FAITH? START HERE',

    'auth.passwordReset.title': 'Reset your password',
    'auth.passwordReset.subtitle': 'Enter your email and we’ll send you a reset link.',
    'auth.passwordReset.submit': 'SEND RESET LINK',
    'auth.passwordReset.remembered': 'Remember your password?',

    'auth.passwordEmailSent.title': 'Check your email',
    'auth.passwordEmailSent.subtitle': 'If an account exists for that email, you’ll receive a reset link in a few minutes.',
    'auth.passwordEmailSent.submit': 'RETURN TO SIGN IN',
    'auth.passwordEmailSent.resend': 'RESEND EMAIL',
    'auth.passwordEmailSent.useDifferent': 'USE A DIFFERENT EMAIL',

    'settings.section.language': 'LANGUAGE',
    'settings.language.label': 'App Language',
    'settings.language.en': 'English',
    'settings.language.es': 'Español',

    'care.home.title': 'How can we walk with you?',
    'care.home.prayer.label': 'PRAYER REQUEST',
    'care.home.prayer.prompt': 'What would you like prayer for today?',
    'care.home.prayer.action': 'SHARE PRAYER',
    'care.home.needMore': 'Need more than prayer?',
    'care.home.gratitude.label': 'GRATITUDE',
    'care.home.gratitude.prompt': 'Where have you seen God’s faithfulness this week?',
    'care.home.gratitude.action': 'SHARE GRATITUDE',
    'care.home.footer': 'Your community is here to hold you in prayer.',

    'care.support.title': 'How can we support you right now?',
    'care.support.section.type': 'WHAT KIND OF SUPPORT?',
    'care.support.section.message': 'YOUR MESSAGE',
    'care.support.section.contact': 'PREFERRED CONTACT',
    'care.support.placeholder': 'Tell us how we can walk with you...',
    'care.support.crisis': 'If you are in immediate danger, call local emergency services.',
    'care.support.send': 'SEND REQUEST',
    'care.support.type.pastor': 'A conversation with a pastor',
    'care.support.type.discipleship': 'Discipleship / next steps',
    'care.support.type.accountability': 'Accountability support',
    'care.support.type.prayer': 'Prayer in person or by call',
    'care.support.type.difficult': "I'm going through something difficult",
    'care.support.type.newBeliever': 'I recently gave my life to Christ',
    'care.support.type.other': 'Other',
    'care.support.contact.call': 'Call',
    'care.support.contact.text': 'Text',
    'care.support.contact.email': 'Email',

    'care.success.kicker': 'CARE SUPPORT',
    'care.success.title': 'Thanks for reaching out.',
    'care.success.message': 'Someone from your church will follow up with you soon.',
    'care.success.back': 'BACK TO CARE',

    'care.prayer.alert.title': 'Prayer Submitted',
    'care.prayer.alert.body': 'Your request has been received. A pastor will review it in the dashboard.',
    'care.prayer.alert.done': 'DONE',
    'care.prayer.alert.needSupport': 'NEED MORE SUPPORT',
    'care.prayer.title': 'How can we pray for you?',
    'care.prayer.label': 'PRAYER REQUEST',
    'care.prayer.placeholder': 'What would you like prayer for today?',
    'care.prayer.action': 'SHARE PRAYER',
    'care.prayer.anonymous.title': 'Post Anonymously',
    'care.prayer.anonymous.subtitle': 'Your name will be hidden from the care team view',
    'care.prayer.support.title': 'Request Pastoral Support',
    'care.prayer.support.subtitle': 'A leader will reach out to walk with you',

    'care.testimony.alert.title': 'Testimony Submitted',
    'care.testimony.alert.body': 'Your testimony has been sent and will appear in the pastor dashboard.',
    'care.testimony.title': 'Where have you seen God’s faithfulness?',
    'care.testimony.label': 'TESTIMONY',
    'care.testimony.placeholder': 'Share a moment of grace...',
    'care.testimony.anonymous': 'Share anonymously',
    'care.testimony.allowShare': 'Allow church to share this as encouragement',
    'care.testimony.action': 'SHARE GRATITUDE',
    'care.testimony.footer': 'Your story strengthens the church.',
  },
  es: {
    'nav.home': 'INICIO',
    'nav.journey': 'CAMINO',
    'nav.church': 'IGLESIA',
    'nav.profile': 'PERFIL',

    'auth.brand': 'MI REINO PAL',
    'auth.welcome.title': 'Camina con la Palabra toda la semana.',
    'auth.welcome.subtitle': 'Ayudando a los creyentes a vivir la Palabra cada día, más allá del domingo',
    'auth.welcome.join': 'ÚNETE A TU IGLESIA',
    'auth.welcome.haveAccess': 'YA TENGO ACCESO',
    'auth.footer.prefix': 'Al continuar, aceptas nuestros',
    'auth.footer.terms': 'Términos de Servicio',
    'auth.footer.and': 'y la',
    'auth.footer.privacy': 'Política de Privacidad',

    'auth.signin.title': 'Bienvenido de nuevo',
    'auth.signin.subtitle': 'Continúa tu caminar',
    'auth.signin.emailLabel': 'CORREO ELECTRÓNICO',
    'auth.signin.passwordLabel': 'CONTRASEÑA',
    'auth.signin.error': 'No coincide con nuestros registros. Verifica tus datos o restablece tu contraseña.',
    'auth.signin.tryAgain': 'INTENTAR DE NUEVO',
    'auth.signin.submit': 'INICIAR SESIÓN',
    'auth.signin.forgot': '¿Olvidaste tu contraseña?',

    'auth.signup.title': 'Comienza tu camino',
    'auth.signup.subtitle': 'Crea una cuenta para empezar',
    'auth.signup.firstNameLabel': 'NOMBRE',
    'auth.signup.firstNamePlaceholder': 'Ingresa tu nombre',
    'auth.signup.ageLine': 'Confirmo que tengo al menos 16 años.',
    'auth.signup.ageSubline': 'My Kingdom Pal está diseñado para mayores de 16 años.',
    'auth.signup.submit': 'CREAR CUENTA',
    'auth.signup.hasAccount': '¿Ya tienes una cuenta?',
    'auth.signup.signin': 'Inicia sesión',

    'auth.churchSearch.title': 'Encuentra tu iglesia',
    'auth.churchSearch.subtitle': 'Ingresa el código que te dio tu iglesia para unirte.',
    'auth.churchSearch.codeLabel': 'CÓDIGO DE IGLESIA',
    'auth.churchSearch.submit': 'CONECTAR',
    'auth.churchSearch.codeHelp': '¿Dónde encuentro mi código?',
    'auth.churchSearch.helpTitle': 'Encuentra el código de tu iglesia',
    'auth.churchSearch.helpBody': 'Tu iglesia puede compartir este código en la pantalla del domingo, boletín o equipo de bienvenida.',

    'auth.churchSuccess.title': '¡Estás conectado!',
    'auth.churchSuccess.description': 'Bienvenido a la familia. Tu camino con nosotros comienza hoy.',
    'auth.churchSuccess.submit': 'IR A MI IGLESIA',
    'auth.churchSuccess.continue': 'CONTINUAR',
    'auth.churchSuccess.newBeliever': '¿NUEVO EN LA FE? COMIENZA AQUÍ',

    'auth.passwordReset.title': 'Restablece tu contraseña',
    'auth.passwordReset.subtitle': 'Ingresa tu correo y te enviaremos un enlace de restablecimiento.',
    'auth.passwordReset.submit': 'ENVIAR ENLACE',
    'auth.passwordReset.remembered': '¿Recuerdas tu contraseña?',

    'auth.passwordEmailSent.title': 'Revisa tu correo',
    'auth.passwordEmailSent.subtitle': 'Si existe una cuenta con ese correo, recibirás un enlace en unos minutos.',
    'auth.passwordEmailSent.submit': 'VOLVER A INICIAR SESIÓN',
    'auth.passwordEmailSent.resend': 'REENVIAR CORREO',
    'auth.passwordEmailSent.useDifferent': 'USAR OTRO CORREO',

    'settings.section.language': 'IDIOMA',
    'settings.language.label': 'Idioma de la app',
    'settings.language.en': 'Inglés',
    'settings.language.es': 'Español',

    'care.home.title': '¿Cómo podemos caminar contigo?',
    'care.home.prayer.label': 'PETICIÓN DE ORACIÓN',
    'care.home.prayer.prompt': '¿Por qué te gustaría que oremos hoy?',
    'care.home.prayer.action': 'COMPARTIR ORACIÓN',
    'care.home.needMore': '¿Necesitas más que oración?',
    'care.home.gratitude.label': 'GRATITUD',
    'care.home.gratitude.prompt': '¿Dónde has visto la fidelidad de Dios esta semana?',
    'care.home.gratitude.action': 'COMPARTIR GRATITUD',
    'care.home.footer': 'Tu comunidad está aquí para sostenerte en oración.',

    'care.support.title': '¿Cómo podemos apoyarte ahora mismo?',
    'care.support.section.type': '¿QUÉ TIPO DE APOYO?',
    'care.support.section.message': 'TU MENSAJE',
    'care.support.section.contact': 'CONTACTO PREFERIDO',
    'care.support.placeholder': 'Cuéntanos cómo podemos caminar contigo...',
    'care.support.crisis': 'Si estás en peligro inmediato, llama a los servicios de emergencia locales.',
    'care.support.send': 'ENVIAR SOLICITUD',
    'care.support.type.pastor': 'Una conversación con un pastor',
    'care.support.type.discipleship': 'Discipulado / próximos pasos',
    'care.support.type.accountability': 'Acompañamiento y responsabilidad',
    'care.support.type.prayer': 'Oración en persona o por llamada',
    'care.support.type.difficult': 'Estoy pasando por algo difícil',
    'care.support.type.newBeliever': 'Recientemente entregué mi vida a Cristo',
    'care.support.type.other': 'Otro',
    'care.support.contact.call': 'Llamada',
    'care.support.contact.text': 'Texto',
    'care.support.contact.email': 'Correo',

    'care.success.kicker': 'APOYO PASTORAL',
    'care.success.title': 'Gracias por comunicarte.',
    'care.success.message': 'Alguien de tu iglesia te dará seguimiento pronto.',
    'care.success.back': 'VOLVER A CUIDADO',

    'care.prayer.alert.title': 'Oración enviada',
    'care.prayer.alert.body': 'Tu solicitud fue recibida. Un pastor la revisará en el panel.',
    'care.prayer.alert.done': 'LISTO',
    'care.prayer.alert.needSupport': 'NECESITO MÁS APOYO',
    'care.prayer.title': '¿Cómo podemos orar por ti?',
    'care.prayer.label': 'PETICIÓN DE ORACIÓN',
    'care.prayer.placeholder': '¿Por qué te gustaría oración hoy?',
    'care.prayer.action': 'COMPARTIR ORACIÓN',
    'care.prayer.anonymous.title': 'Publicar de forma anónima',
    'care.prayer.anonymous.subtitle': 'Tu nombre estará oculto en la vista del equipo pastoral',
    'care.prayer.support.title': 'Solicitar apoyo pastoral',
    'care.prayer.support.subtitle': 'Un líder se comunicará para caminar contigo',

    'care.testimony.alert.title': 'Testimonio enviado',
    'care.testimony.alert.body': 'Tu testimonio fue enviado y aparecerá en el panel pastoral.',
    'care.testimony.title': '¿Dónde has visto la fidelidad de Dios?',
    'care.testimony.label': 'TESTIMONIO',
    'care.testimony.placeholder': 'Comparte un momento de gracia...',
    'care.testimony.anonymous': 'Compartir de forma anónima',
    'care.testimony.allowShare': 'Permitir que la iglesia lo comparta como ánimo',
    'care.testimony.action': 'COMPARTIR GRATITUD',
    'care.testimony.footer': 'Tu historia fortalece a la iglesia.',
  },
};

const getDefaultLocale = (): SupportedLocale => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
  if (locale.startsWith('es')) {
    return 'es';
  }
  return 'en';
};

type I18nContextValue = {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(getDefaultLocale);

  const setLocale = useCallback((nextLocale: SupportedLocale) => {
    setLocaleState(nextLocale);
  }, []);

  const t = useCallback(
    (key: string) => dictionaries[locale][key] ?? dictionaries.en[key] ?? key,
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

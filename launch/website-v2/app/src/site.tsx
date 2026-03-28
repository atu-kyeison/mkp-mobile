import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

type Locale = 'en' | 'es';

type CardItem = {
  kicker?: string;
  title: string;
  body: string;
};

type PolicyItem = {
  title: string;
  body: string;
};

type Copy = {
  nav: {
    home: string;
    how: string;
    privacy: string;
    contact: string;
    cta: string;
  };
  footer: {
    tagline: string;
    contact: string;
    privacy: string;
    terms: string;
    whitepaper: string;
  };
  home: {
    eyebrow: string;
    title: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    points: string[];
    panelNote: string;
    visionEyebrow: string;
    visionTitle: string;
    visionBody: string;
    visionCards: CardItem[];
    methodEyebrow: string;
    methodTitle: string;
    methodCards: CardItem[];
    learnEyebrow: string;
    learnTitle: string;
    learnBody: string;
    privacyEyebrow: string;
    privacyTitle: string;
    privacyBody: string;
    contactTitle: string;
    contactBody: string;
  };
  privacy: {
    eyebrow: string;
    title: string;
    lead: string;
    intro: string;
    meta: string;
    sections: PolicyItem[];
  };
  terms: {
    eyebrow: string;
    title: string;
    lead: string;
    meta: string;
    sections: PolicyItem[];
    contactEyebrow: string;
    contactTitle: string;
    contactBody: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    supportKicker: string;
    supportBody: string;
    churchKicker: string;
    churchBody: string;
    docsKicker: string;
    docsTitle: string;
    trustEyebrow: string;
    trustBody: string;
  };
  whitepaper: {
    eyebrow: string;
    title: string;
    lead: string;
    summaryTitle: string;
    summaryBody: string;
    convictionsTitle: string;
    convictionsBody: string;
  };
  notFound: {
    eyebrow: string;
    title: string;
    body: string;
    home: string;
    contact: string;
  };
};

const copy: Record<Locale, Copy> = {
  en: {
    nav: {
      home: 'What It Is',
      how: 'How It Works',
      privacy: 'Privacy',
      contact: 'Contact',
      cta: 'Contact Us',
    },
    footer: {
      tagline: 'Church-led spiritual formation beyond Sunday.',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      whitepaper: 'Whitepaper',
    },
    home: {
      eyebrow: 'Church-led formation',
      title: 'Church-led spiritual formation beyond Sunday.',
      lead:
        'My Kingdom Pal helps churches extend Sunday teaching through a gentle weekly rhythm, private-by-default reflection, and care connection when members choose to reach out.',
      ctaPrimary: 'Contact Us',
      ctaSecondary: 'Read Privacy Policy',
      points: [
        'Church-led formation',
        'Sunday-to-week rhythm',
        'Reflection stays on your device',
      ],
      panelNote: 'A gentle rhythm through the week.',
      visionEyebrow: 'The Vision',
      visionTitle: 'Built for churches that want a steadier rhythm between teaching and life.',
      visionBody:
        'My Kingdom Pal helps create continuity between Sunday teaching, weekday reflection, and moments when care is needed, without turning formation into noise.',
      visionCards: [
        {
          title: 'Church-led formation',
          body: 'A weekly rhythm shaped by the teaching and voice of the local church.',
        },
        {
          title: 'Sunday-to-week rhythm',
          body: 'Help members carry Sunday into the rest of the week through simple, grounded formation.',
        },
        {
          title: 'Private-by-default reflection',
          body: 'Journal entries, mood notes, and reflection text are designed to remain on the member’s device.',
        },
      ],
      methodEyebrow: 'The Method',
      methodTitle: 'How It Works',
      methodCards: [
        {
          kicker: 'STEP 01',
          title: 'Start with Sunday teaching',
          body: 'The week begins with the message your church is already preaching.',
        },
        {
          kicker: 'STEP 02',
          title: 'Guide the week gently',
          body: 'Members receive a calmer daily rhythm for reflection, prayer, and response.',
        },
        {
          kicker: 'STEP 03',
          title: 'Support care when invited',
          body: 'Prayer and support requests create a path for follow-up only when a member intentionally submits them.',
        },
      ],
      learnEyebrow: 'Contact',
      learnTitle: 'Want to learn more?',
      learnBody: 'Contact us if you are exploring My Kingdom Pal for your church.',
      privacyEyebrow: 'Privacy',
      privacyTitle: 'Privacy and trust matter here.',
      privacyBody:
        'Private reflections are designed to stay on the member’s device. Prayer and support requests create a path for care only when a member intentionally submits them.',
      contactTitle: 'Connect With Us',
      contactBody:
        'If you need support with My Kingdom Pal, or if you are a church leader interested in learning more, you can reach us here.',
    },
    privacy: {
      eyebrow: 'Our commitment',
      title: 'Privacy Policy',
      lead:
        'My Kingdom Pal (“MKP,” “we,” “our,” or “us”) is a church-led spiritual formation app designed to help churches extend Sunday teaching into the week through reflection, formation, and care connection.',
      intro:
        'This page explains what stays local on a member’s device, what may be processed to operate the service, and what may be shared when a member intentionally submits it.',
      meta: 'Last updated: March 23, 2026',
      sections: [
        {
          title: '1. Information designed to stay on your device',
          body: 'Journal entries, mood notes, and reflection text are designed to remain on the member’s device and not be stored on MKP backend infrastructure as part of the core product experience.',
        },
        {
          title: '2. Device backups',
          body: 'Because this content is local to the device, it may still be affected by the device owner’s own backup settings, such as iCloud Backup or Android device backup, if those services are enabled.',
        },
        {
          title: '3. Information a member intentionally submits',
          body: 'If a member chooses to submit a prayer request, support request, gratitude note, or similar church-directed request through MKP, that submitted content may be made available to the connected church team for follow-up.',
        },
        {
          title: '4. Not public',
          body: 'These submissions are not public and are not posted to a public community feed or prayer wall.',
        },
        {
          title: '5. Account, church, and service information',
          body: 'To operate the app, MKP may process limited account and service information such as sign-in details, church membership association, communication preferences, notification tokens, and other operational records necessary to provide the service.',
        },
        {
          title: '6. Church-scoped data',
          body: 'Church data is intended to remain scoped to the relevant church context rather than shared across unrelated churches.',
        },
        {
          title: '7. What MKP does not provide',
          body: 'MKP is not designed as a public social platform, public prayer wall, or pastoral notes system.',
        },
        {
          title: '8. Church teaching and formation content',
          body: 'MKP may support church sermon content, sermon summaries, and formation content that help extend Sunday teaching into the week. These church-content systems are separate from private member journal entries, mood notes, and reflection text.',
        },
        {
          title: '9. User choice and control',
          body: 'Members choose what they write privately on their own device and what they intentionally submit to a church through MKP workflows.',
        },
        {
          title: '10. Contact',
          body: 'If you have questions about this Privacy Policy or need support, contact support@mykingdompal.com or hello@mykingdompal.com.',
        },
      ],
    },
    terms: {
      eyebrow: 'Legal framework',
      title: 'Terms of Use',
      lead:
        'These Terms of Use govern access to and use of My Kingdom Pal (“MKP,” “we,” “our,” or “us”). By using MKP, you agree to these Terms.',
      meta: 'Last updated: March 23, 2026',
      sections: [
        {
          title: '1. What MKP is',
          body: 'MKP is a church-led spiritual formation app designed to help churches extend Sunday teaching into the week through reflection, formation, and care connection.',
        },
        {
          title: '2. Not emergency, medical, or crisis care',
          body: 'MKP is not emergency response, therapy, medical care, or crisis intervention. If you are in immediate danger or need urgent help, contact local emergency services or another appropriate emergency resource.',
        },
        {
          title: '3. Private reflection and church submissions',
          body: 'MKP is designed so that journal entries, mood notes, and private reflection text remain local to the user’s device as part of the intended product experience. If a user intentionally submits a prayer request, support request, or other church-directed request, that submitted content may be shared with the connected church team for ministry follow-up.',
        },
        {
          title: '4. Acceptable use',
          body: 'You agree not to misuse MKP, interfere with the service, attempt unauthorized access, impersonate others, or use the app in a way that violates applicable law or the trust and safety of others.',
        },
        {
          title: '5. Church-related use',
          body: 'MKP is intended to support the life and rhythm of the local church. It does not replace church leadership, pastoral judgment, or ministry relationships.',
        },
        {
          title: '6. Service availability',
          body: 'We may update, change, suspend, or improve parts of MKP over time. We do not guarantee that the service will always be uninterrupted, error-free, or available in every situation.',
        },
        {
          title: '7. Intellectual property',
          body: 'MKP and its related branding, software, and content are owned by or licensed to us, except for third-party content and church-provided materials used within the service.',
        },
        {
          title: '8. Suspension or termination',
          body: 'We may suspend or terminate access to MKP if needed to protect the service, comply with legal obligations, address misuse, or respond to security or operational issues.',
        },
        {
          title: '9. Changes to these Terms',
          body: 'We may update these Terms from time to time. When we do, we will update the “Last updated” date on this page.',
        },
        {
          title: '10. Contact',
          body: 'Questions about these Terms may be sent to support@mykingdompal.com or hello@mykingdompal.com.',
        },
      ],
      contactEyebrow: 'Questions & Contact',
      contactTitle: 'Questions about these Terms?',
      contactBody: 'If you have questions about these Terms, our team is available to help.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Connect With Us',
      lead:
        'If you need support with My Kingdom Pal, or if you are a church leader interested in learning more, you can reach us here.',
      supportKicker: 'Member Support',
      supportBody: 'If you need help with access, account questions, or product support, contact us here.',
      churchKicker: 'Church Inquiries',
      churchBody: 'If you are a church leader interested in learning more, reach out here.',
      docsKicker: 'Helpful Links',
      docsTitle: 'Essential documentation',
      trustEyebrow: 'Trust',
      trustBody:
        'My Kingdom Pal is built for church-led spiritual formation, private-by-default reflection, and care connection when members choose to reach out.',
    },
    whitepaper: {
      eyebrow: 'Whitepaper',
      title: 'The church problem we’re solving is continuity.',
      lead:
        'My Kingdom Pal is being built to help churches create more continuity between Sunday teaching, weekday formation, private reflection, and care connection.',
      summaryTitle: 'Executive summary',
      summaryBody:
        'Churches already preach, teach, pray, and care. What is often missing is a simple structure that helps members carry Sunday into weekday life without turning spirituality into performance or pressure.',
      convictionsTitle: 'Product convictions',
      convictionsBody:
        'The product is church-led, private by default, and intentionally non-gamified. Reflection and mood notes are designed to stay on the device. Prayer and support requests create a path for care only when the member chooses to share.',
    },
    notFound: {
      eyebrow: '404',
      title: 'This page isn’t available.',
      body: 'Return to the main site or review the current privacy, terms, and contact pages.',
      home: 'Go home',
      contact: 'Contact Us',
    },
  },
  es: {
    nav: {
      home: 'Qué Es',
      how: 'Cómo Funciona',
      privacy: 'Privacidad',
      contact: 'Contacto',
      cta: 'Contáctanos',
    },
    footer: {
      tagline: 'Formación espiritual guiada por la iglesia, más allá del domingo.',
      contact: 'Contacto',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Uso',
      whitepaper: 'Documento',
    },
    home: {
      eyebrow: 'Formación guiada por la iglesia',
      title: 'Formación espiritual guiada por la iglesia, más allá del domingo.',
      lead:
        'My Kingdom Pal ayuda a las iglesias a extender la enseñanza del domingo mediante un ritmo semanal sereno, reflexión privada por defecto y conexión de cuidado cuando los miembros deciden compartir.',
      ctaPrimary: 'Contáctanos',
      ctaSecondary: 'Leer Política de Privacidad',
      points: [
        'Formación guiada por la iglesia',
        'Ritmo del domingo a la semana',
        'La reflexión permanece en tu dispositivo',
      ],
      panelNote: 'Un ritmo suave durante la semana.',
      visionEyebrow: 'La visión',
      visionTitle: 'Pensado para iglesias que desean un ritmo más constante entre la enseñanza y la vida.',
      visionBody:
        'My Kingdom Pal ayuda a crear continuidad entre la enseñanza del domingo, la reflexión durante la semana y los momentos en que se necesita cuidado, sin convertir la formación en ruido.',
      visionCards: [
        {
          title: 'Formación guiada por la iglesia',
          body: 'Un ritmo semanal moldeado por la enseñanza y la voz de la iglesia local.',
        },
        {
          title: 'Ritmo del domingo a la semana',
          body: 'Ayuda a los miembros a llevar el domingo al resto de la semana mediante una formación sencilla y arraigada.',
        },
        {
          title: 'Reflexión privada por defecto',
          body: 'Las entradas de journal, los estados de ánimo y la reflexión están diseñados para permanecer en el dispositivo del miembro.',
        },
      ],
      methodEyebrow: 'El método',
      methodTitle: 'Cómo Funciona',
      methodCards: [
        {
          kicker: 'PASO 01',
          title: 'Comienza con la enseñanza del domingo',
          body: 'La semana comienza con el mensaje que tu iglesia ya está predicando.',
        },
        {
          kicker: 'PASO 02',
          title: 'Guía la semana con suavidad',
          body: 'Los miembros reciben un ritmo diario más sereno para reflexionar, orar y responder.',
        },
        {
          kicker: 'PASO 03',
          title: 'Apoya el cuidado cuando se invite',
          body: 'Las solicitudes de oración y apoyo crean un camino de seguimiento solo cuando un miembro las envía intencionalmente.',
        },
      ],
      learnEyebrow: 'Contacto',
      learnTitle: '¿Quieres saber más?',
      learnBody: 'Contáctanos si estás explorando My Kingdom Pal para tu iglesia.',
      privacyEyebrow: 'Privacidad',
      privacyTitle: 'La privacidad y la confianza importan aquí.',
      privacyBody:
        'Las reflexiones privadas están diseñadas para permanecer en el dispositivo del miembro. Las solicitudes de oración y apoyo crean un camino de cuidado solo cuando el miembro las envía intencionalmente.',
      contactTitle: 'Conecta con nosotros',
      contactBody:
        'Si necesitas ayuda con My Kingdom Pal, o si eres un líder de iglesia interesado en conocer más, puedes comunicarte con nosotros aquí.',
    },
    privacy: {
      eyebrow: 'Nuestro compromiso',
      title: 'Política de Privacidad',
      lead:
        'My Kingdom Pal (“MKP”, “nosotros” o “nuestro”) es una app de formación espiritual guiada por la iglesia, diseñada para ayudar a las iglesias a extender la enseñanza del domingo durante la semana mediante reflexión, formación y conexión de cuidado.',
      intro:
        'Esta página explica qué permanece local en el dispositivo del miembro, qué puede procesarse para operar el servicio y qué puede compartirse cuando un miembro lo envía intencionalmente.',
      meta: 'Última actualización: 23 de marzo de 2026',
      sections: [
        {
          title: '1. Información diseñada para permanecer en tu dispositivo',
          body: 'Las entradas de journal, los estados de ánimo y el texto de reflexión están diseñados para permanecer en el dispositivo del miembro y no almacenarse en la infraestructura backend de MKP como parte de la experiencia principal del producto.',
        },
        {
          title: '2. Respaldos del dispositivo',
          body: 'Como este contenido es local al dispositivo, aún puede verse afectado por la configuración de respaldo del propietario, como iCloud Backup o el respaldo del dispositivo Android, si estos servicios están habilitados.',
        },
        {
          title: '3. Información que un miembro envía intencionalmente',
          body: 'Si un miembro decide enviar una solicitud de oración, apoyo, gratitud u otra solicitud dirigida a la iglesia a través de MKP, ese contenido puede ponerse a disposición del equipo de la iglesia para seguimiento.',
        },
        {
          title: '4. No es público',
          body: 'Estas solicitudes no son públicas y no se publican en un feed comunitario ni en un muro de oración.',
        },
        {
          title: '5. Información de cuenta, iglesia y servicio',
          body: 'Para operar la app, MKP puede procesar información limitada de cuenta y servicio, como datos de inicio de sesión, asociación con la iglesia, preferencias de comunicación, tokens de notificación y otros registros operativos necesarios para prestar el servicio.',
        },
        {
          title: '6. Datos limitados a la iglesia correspondiente',
          body: 'Los datos de la iglesia están pensados para permanecer dentro del contexto de la iglesia correspondiente y no compartirse entre iglesias no relacionadas.',
        },
        {
          title: '7. Lo que MKP no ofrece',
          body: 'MKP no está diseñado como una plataforma social pública, un muro público de oración ni un sistema de notas pastorales.',
        },
        {
          title: '8. Enseñanza y formación de la iglesia',
          body: 'MKP puede apoyar contenido de sermones, resúmenes y contenido de formación que ayude a extender la enseñanza del domingo durante la semana. Estos sistemas son independientes de las entradas privadas, estados de ánimo y texto de reflexión de los miembros.',
        },
        {
          title: '9. Elección y control del usuario',
          body: 'Los miembros deciden qué escriben en privado en su dispositivo y qué envían intencionalmente a una iglesia mediante los flujos de MKP.',
        },
        {
          title: '10. Contacto',
          body: 'Si tienes preguntas sobre esta Política de Privacidad o necesitas ayuda, contacta a support@mykingdompal.com o hello@mykingdompal.com.',
        },
      ],
    },
    terms: {
      eyebrow: 'Marco legal',
      title: 'Términos de Uso',
      lead:
        'Estos Términos de Uso rigen el acceso y uso de My Kingdom Pal (“MKP”, “nosotros” o “nuestro”). Al usar MKP, aceptas estos Términos.',
      meta: 'Última actualización: 23 de marzo de 2026',
      sections: [
        {
          title: '1. Qué es MKP',
          body: 'MKP es una app de formación espiritual guiada por la iglesia, diseñada para ayudar a las iglesias a extender la enseñanza del domingo durante la semana mediante reflexión, formación y conexión de cuidado.',
        },
        {
          title: '2. No es atención de emergencia, médica ni de crisis',
          body: 'MKP no es respuesta a emergencias, terapia, atención médica ni intervención en crisis. Si estás en peligro inmediato o necesitas ayuda urgente, contacta a los servicios de emergencia locales u otro recurso apropiado.',
        },
        {
          title: '3. Reflexión privada y envíos a la iglesia',
          body: 'MKP está diseñado para que las entradas de journal, los estados de ánimo y el texto de reflexión privada permanezcan locales al dispositivo del usuario como parte de la experiencia prevista. Si un usuario envía intencionalmente una solicitud de oración, apoyo u otra solicitud dirigida a la iglesia, ese contenido puede compartirse con el equipo de la iglesia para seguimiento ministerial.',
        },
        {
          title: '4. Uso aceptable',
          body: 'Aceptas no hacer un uso indebido de MKP, no interferir con el servicio, no intentar acceso no autorizado, no suplantar a otros ni usar la app de una manera que viole la ley aplicable o la seguridad y confianza de los demás.',
        },
        {
          title: '5. Uso relacionado con la iglesia',
          body: 'MKP está pensado para apoyar la vida y el ritmo de la iglesia local. No sustituye el liderazgo de la iglesia, el juicio pastoral ni las relaciones ministeriales.',
        },
        {
          title: '6. Disponibilidad del servicio',
          body: 'Podemos actualizar, cambiar, suspender o mejorar partes de MKP con el tiempo. No garantizamos que el servicio esté siempre disponible, sin errores o sin interrupciones.',
        },
        {
          title: '7. Propiedad intelectual',
          body: 'MKP y su marca, software y contenido relacionado son propiedad nuestra o se usan bajo licencia, excepto el contenido de terceros y los materiales proporcionados por las iglesias dentro del servicio.',
        },
        {
          title: '8. Suspensión o terminación',
          body: 'Podemos suspender o terminar el acceso a MKP si es necesario para proteger el servicio, cumplir obligaciones legales, abordar usos indebidos o responder a problemas de seguridad u operación.',
        },
        {
          title: '9. Cambios a estos Términos',
          body: 'Podemos actualizar estos Términos de vez en cuando. Cuando lo hagamos, actualizaremos la fecha de “Última actualización” en esta página.',
        },
        {
          title: '10. Contacto',
          body: 'Las preguntas sobre estos Términos pueden enviarse a support@mykingdompal.com o hello@mykingdompal.com.',
        },
      ],
      contactEyebrow: 'Preguntas y contacto',
      contactTitle: '¿Preguntas sobre estos Términos?',
      contactBody: 'Si tienes preguntas sobre estos Términos, nuestro equipo está disponible para ayudarte.',
    },
    contact: {
      eyebrow: 'Contacto',
      title: 'Conecta con nosotros',
      lead:
        'Si necesitas ayuda con My Kingdom Pal, o si eres un líder de iglesia interesado en conocer más, puedes comunicarte con nosotros aquí.',
      supportKicker: 'Soporte para miembros',
      supportBody: 'Si necesitas ayuda con acceso, cuenta o soporte del producto, contáctanos aquí.',
      churchKicker: 'Consultas de iglesias',
      churchBody: 'Si eres un líder de iglesia interesado en conocer más, escríbenos aquí.',
      docsKicker: 'Enlaces útiles',
      docsTitle: 'Documentación esencial',
      trustEyebrow: 'Confianza',
      trustBody:
        'My Kingdom Pal está construido para formación espiritual guiada por la iglesia, reflexión privada por defecto y conexión de cuidado cuando los miembros deciden compartir.',
    },
    whitepaper: {
      eyebrow: 'Documento',
      title: 'El problema de la iglesia que estamos resolviendo es la continuidad.',
      lead:
        'My Kingdom Pal está siendo construido para ayudar a las iglesias a crear más continuidad entre la enseñanza del domingo, la formación semanal, la reflexión privada y la conexión de cuidado.',
      summaryTitle: 'Resumen ejecutivo',
      summaryBody:
        'Las iglesias ya predican, enseñan, oran y cuidan. Lo que a menudo falta es una estructura simple que ayude a los miembros a llevar el domingo a la vida diaria sin convertir la espiritualidad en rendimiento o presión.',
      convictionsTitle: 'Convicciones del producto',
      convictionsBody:
        'El producto es guiado por la iglesia, privado por defecto e intencionalmente no gamificado. La reflexión y los estados de ánimo están diseñados para permanecer en el dispositivo. Las solicitudes de oración y apoyo crean un camino de cuidado solo cuando el miembro decide compartir.',
    },
    notFound: {
      eyebrow: '404',
      title: 'Esta página no está disponible.',
      body: 'Vuelve al sitio principal o revisa las páginas actuales de privacidad, términos y contacto.',
      home: 'Ir al inicio',
      contact: 'Contáctanos',
    },
  },
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: Copy;
} | null>(null);

function useSiteLocale() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error('Locale context missing');
  }
  return value;
}

function Header() {
  const { locale, setLocale, copy } = useSiteLocale();
  const navItems = [
    { to: '/', label: copy.nav.home, end: true },
    { to: '/#how-it-works', label: copy.nav.how, hashLink: true },
    { to: '/privacy', label: copy.nav.privacy },
    { to: '/contact', label: copy.nav.contact },
  ];

  return (
    <header className="chrome">
      <div className="page-shell chrome__inner">
        <NavLink className="wordmark" to="/">
          My Kingdom Pal
        </NavLink>
        <nav className="chrome__nav" aria-label="Primary">
          {navItems.map((item) =>
            item.hashLink ? (
              <a className="nav-link" href={item.to.slice(1)} key={item.to}>
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.to}
                className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
                end={item.end}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ),
          )}
          <div className="locale-toggle" aria-label="Language toggle">
            <button
              className={locale === 'en' ? 'locale-toggle__button is-active' : 'locale-toggle__button'}
              onClick={() => setLocale('en')}
              type="button"
            >
              EN
            </button>
            <button
              className={locale === 'es' ? 'locale-toggle__button is-active' : 'locale-toggle__button'}
              onClick={() => setLocale('es')}
              type="button"
            >
              ES
            </button>
          </div>
          <NavLink className="button button--primary button--header" to="/contact">
            {copy.nav.cta}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const { copy } = useSiteLocale();

  return (
    <footer className="site-footer">
      <div className="page-shell site-footer__inner">
        <div>
          <div className="footer-mark">My Kingdom Pal</div>
          <p className="footer-copy">{copy.footer.tagline}</p>
          <p className="footer-meta">© 2026 My Kingdom Pal, Inc.</p>
        </div>
        <div className="footer-contact">
          <div className="footer-heading">{copy.footer.contact}</div>
          <a href="mailto:support@mykingdompal.com">support@mykingdompal.com</a>
          <a href="mailto:hello@mykingdompal.com">hello@mykingdompal.com</a>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <NavLink to="/privacy">{copy.footer.privacy}</NavLink>
          <NavLink to="/terms">{copy.footer.terms}</NavLink>
          <NavLink to="/contact">{copy.footer.contact}</NavLink>
          <NavLink to="/whitepaper">{copy.footer.whitepaper}</NavLink>
        </nav>
      </div>
    </footer>
  );
}

function PageHero(props: { eyebrow: string; title: string; lead: string; meta?: string }) {
  return (
    <section className="page-hero">
      <div className="page-shell">
        <div className="eyebrow">{props.eyebrow}</div>
        <h1>{props.title}</h1>
        <p>{props.lead}</p>
        {props.meta ? <div className="page-meta">{props.meta}</div> : null}
      </div>
    </section>
  );
}

function CardGrid(props: { items: CardItem[]; className?: string }) {
  return (
    <div className={props.className ?? 'card-grid'}>
      {props.items.map((item) => (
        <article className="story-card" key={item.title}>
          {item.kicker ? <div className="story-card__kicker">{item.kicker}</div> : null}
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function PolicyGrid(props: { items: PolicyItem[] }) {
  return (
    <div className="policy-grid">
      {props.items.map((item) => (
        <article className="policy-card" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function HeroPanel() {
  const { copy } = useSiteLocale();

  return (
    <aside className="hero-panel" aria-label="Product frame">
      <div className="hero-panel__mock">
        <div className="hero-panel__row">
          <div className="hero-panel__tile" />
          <div className="hero-panel__tile" />
          <div className="hero-panel__tile" />
        </div>
        <div className="hero-panel__body" />
      </div>
      <div className="hero-panel__note">{copy.home.panelNote}</div>
    </aside>
  );
}

function ContactCards() {
  const { copy } = useSiteLocale();

  return (
    <div className="card-grid">
      <article className="story-card">
        <div className="story-card__kicker">{copy.contact.supportKicker}</div>
        <h3>
          <a className="contact-link" href="mailto:support@mykingdompal.com">
            support@mykingdompal.com
          </a>
        </h3>
        <p>{copy.contact.supportBody}</p>
      </article>
      <article className="story-card">
        <div className="story-card__kicker">{copy.contact.churchKicker}</div>
        <h3>
          <a className="contact-link" href="mailto:hello@mykingdompal.com">
            hello@mykingdompal.com
          </a>
        </h3>
        <p>{copy.contact.churchBody}</p>
      </article>
      <article className="story-card">
        <div className="story-card__kicker">{copy.contact.docsKicker}</div>
        <h3>{copy.contact.docsTitle}</h3>
        <p>
          <NavLink to="/privacy">{copy.footer.privacy}</NavLink>
          <span className="inline-divider">•</span>
          <NavLink to="/terms">{copy.footer.terms}</NavLink>
        </p>
      </article>
    </div>
  );
}

export function AppLayout() {
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem('mkp-site-locale');
    if (stored === 'en' || stored === 'es') {
      setLocale(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('mkp-site-locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      copy: copy[locale],
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>
      <div className="site-shell">
        <div className="background-orb background-orb--one" />
        <div className="background-orb background-orb--two" />
        <Header />
        <Outlet />
        <Footer />
      </div>
    </LocaleContext.Provider>
  );
}

export function HomePage() {
  const { copy } = useSiteLocale();

  return (
    <main>
      <section className="hero">
        <div className="page-shell hero__grid">
          <div className="hero__copy">
            <div className="eyebrow">{copy.home.eyebrow}</div>
            <h1>{copy.home.title}</h1>
            <p>{copy.home.lead}</p>
            <div className="hero__actions">
              <NavLink className="button button--primary" to="/contact">
                {copy.home.ctaPrimary}
              </NavLink>
              <NavLink className="button button--ghost" to="/privacy">
                {copy.home.ctaSecondary}
              </NavLink>
            </div>
            <ul className="support-points">
              {copy.home.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <HeroPanel />
        </div>
      </section>

      <section className="section">
        <div className="page-shell split-layout split-layout--vision">
          <div className="section-heading section-heading--compact">
            <div className="eyebrow">{copy.home.visionEyebrow}</div>
            <h2>{copy.home.visionTitle}</h2>
          </div>
          <div className="vision-copy">
            <p>{copy.home.visionBody}</p>
          </div>
        </div>
        <div className="page-shell">
          <CardGrid items={copy.home.visionCards} />
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="page-shell">
          <div className="section-heading">
            <div className="eyebrow">{copy.home.methodEyebrow}</div>
            <h2>{copy.home.methodTitle}</h2>
          </div>
          <CardGrid items={copy.home.methodCards} />
        </div>
      </section>

      <section className="section">
        <div className="page-shell action-banner action-banner--light">
          <div>
            <div className="eyebrow">{copy.home.learnEyebrow}</div>
            <h2>{copy.home.learnTitle}</h2>
            <p>{copy.home.learnBody}</p>
          </div>
          <div className="hero__actions">
            <NavLink className="button button--primary" to="/contact">
              {copy.home.ctaPrimary}
            </NavLink>
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="page-shell privacy-banner">
          <div className="eyebrow eyebrow--dark">{copy.home.privacyEyebrow}</div>
          <h2>{copy.home.privacyTitle}</h2>
          <p>{copy.home.privacyBody}</p>
        </div>
      </section>

      <section className="section">
        <div className="page-shell">
          <div className="section-heading section-heading--centered">
            <div className="eyebrow">{copy.contact.eyebrow}</div>
            <h2>{copy.home.contactTitle}</h2>
            <p>{copy.home.contactBody}</p>
          </div>
          <ContactCards />
        </div>
      </section>
    </main>
  );
}

export function PrivacyPage() {
  const { copy } = useSiteLocale();

  return (
    <main>
      <PageHero
        eyebrow={copy.privacy.eyebrow}
        title={copy.privacy.title}
        lead={copy.privacy.lead}
        meta={copy.privacy.meta}
      />
      <section className="section">
        <div className="page-shell intro-block">
          <p>{copy.privacy.intro}</p>
        </div>
        <div className="page-shell">
          <PolicyGrid items={copy.privacy.sections} />
        </div>
      </section>
    </main>
  );
}

export function TermsPage() {
  const { copy } = useSiteLocale();

  return (
    <main>
      <PageHero
        eyebrow={copy.terms.eyebrow}
        title={copy.terms.title}
        lead={copy.terms.lead}
        meta={copy.terms.meta}
      />
      <section className="section">
        <div className="page-shell">
          <PolicyGrid items={copy.terms.sections} />
          <div className="contact-panel">
            <div className="eyebrow">{copy.terms.contactEyebrow}</div>
            <h2>{copy.terms.contactTitle}</h2>
            <p>{copy.terms.contactBody}</p>
            <div className="hero__actions">
              <a className="button button--primary" href="mailto:support@mykingdompal.com">
                support@mykingdompal.com
              </a>
              <a className="button button--ghost" href="mailto:hello@mykingdompal.com">
                hello@mykingdompal.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ContactPage() {
  const { copy } = useSiteLocale();

  return (
    <main>
      <PageHero eyebrow={copy.contact.eyebrow} title={copy.contact.title} lead={copy.contact.lead} />
      <section className="section">
        <div className="page-shell">
          <ContactCards />
          <div className="contact-note">
            <div className="eyebrow">{copy.contact.trustEyebrow}</div>
            <p>{copy.contact.trustBody}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function WhitepaperPage() {
  const { copy } = useSiteLocale();

  return (
    <main>
      <PageHero
        eyebrow={copy.whitepaper.eyebrow}
        title={copy.whitepaper.title}
        lead={copy.whitepaper.lead}
      />
      <section className="section">
        <div className="page-shell stack">
          <article className="article-card">
            <h2>{copy.whitepaper.summaryTitle}</h2>
            <p>{copy.whitepaper.summaryBody}</p>
          </article>
          <article className="article-card">
            <h2>{copy.whitepaper.convictionsTitle}</h2>
            <p>{copy.whitepaper.convictionsBody}</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export function NotFoundPage() {
  const { copy } = useSiteLocale();

  return (
    <main>
      <section className="section section--centered">
        <div className="page-shell">
          <div className="thank-you-card">
            <div className="eyebrow">{copy.notFound.eyebrow}</div>
            <h1>{copy.notFound.title}</h1>
            <p>{copy.notFound.body}</p>
            <div className="hero__actions">
              <NavLink className="button button--primary" to="/">
                {copy.notFound.home}
              </NavLink>
              <NavLink className="button button--ghost" to="/contact">
                {copy.notFound.contact}
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

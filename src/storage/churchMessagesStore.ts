export type ChurchMessage = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  kind: 'pastoral' | 'announcement' | 'reminder';
};

export const getChurchMessages = (locale: 'en' | 'es'): ChurchMessage[] => {
  const now = new Date();
  const one = new Date(now);
  one.setDate(now.getDate() - 1);
  const two = new Date(now);
  two.setDate(now.getDate() - 4);
  const three = new Date(now);
  three.setDate(now.getDate() - 7);

  if (locale === 'es') {
    return [
      {
        id: 'church-message-1',
        title: 'Una palabra pastoral para la semana',
        body: 'Que el mensaje del domingo no quede atrás. Vuelve a Juan 15 esta semana y pregúntale al Señor dónde te está invitando a permanecer.',
        createdAt: one.toISOString(),
        kind: 'pastoral',
      },
      {
        id: 'church-message-2',
        title: 'Recordatorio de noche de oración',
        body: 'La reunión de oración de esta semana será el miércoles por la noche. Si no puedes asistir, toma unos minutos para orar desde donde estés.',
        createdAt: two.toISOString(),
        kind: 'reminder',
      },
      {
        id: 'church-message-3',
        title: 'Actualización de la iglesia',
        body: 'Gracias por servir y permanecer fieles. Esta semana seguimos avanzando con bautismos y próximos pasos para nuevos creyentes.',
        createdAt: three.toISOString(),
        kind: 'announcement',
      },
    ];
  }

  return [
    {
      id: 'church-message-1',
      title: 'A pastoral word for the week',
      body: 'Do not let Sunday’s message stay behind you. Return to John 15 this week and ask where the Lord is inviting you to remain.',
      createdAt: one.toISOString(),
      kind: 'pastoral',
    },
    {
      id: 'church-message-2',
      title: 'Prayer night reminder',
      body: 'This week’s prayer gathering will be Wednesday evening. If you cannot attend, take a few minutes to pray where you are.',
      createdAt: two.toISOString(),
      kind: 'reminder',
    },
    {
      id: 'church-message-3',
      title: 'Church update',
      body: 'Thank you for serving and staying faithful. This week we continue moving forward with baptisms and next steps for new believers.',
      createdAt: three.toISOString(),
      kind: 'announcement',
    },
  ];
};

export type CareSupportCategoryId =
  | 'pastor_conversation'
  | 'discipleship_next_steps'
  | 'accountability_support'
  | 'baptism_request'
  | 'baby_dedication_request'
  | 'difficult_season'
  | 'new_believer'
  | 'other';

export type CareResponseChannel = 'in_app' | 'email';

export const CARE_SUPPORT_CATEGORIES: Array<{
  id: CareSupportCategoryId;
  labelKey: string;
  legacyLabels: string[];
}> = [
  {
    id: 'pastor_conversation',
    labelKey: 'care.support.type.pastor',
    legacyLabels: ['A conversation with a pastor', 'Una conversación con un pastor'],
  },
  {
    id: 'discipleship_next_steps',
    labelKey: 'care.support.type.discipleship',
    legacyLabels: ['Discipleship / next steps', 'Discipulado / próximos pasos'],
  },
  {
    id: 'accountability_support',
    labelKey: 'care.support.type.accountability',
    legacyLabels: ['Accountability support', 'Acompañamiento y responsabilidad'],
  },
  {
    id: 'baptism_request',
    labelKey: 'care.support.type.baptism',
    legacyLabels: ['Baptism request', 'Solicitud de bautismo'],
  },
  {
    id: 'baby_dedication_request',
    labelKey: 'care.support.type.dedication',
    legacyLabels: ['Baby dedication request', 'Solicitud de dedicación de bebé'],
  },
  {
    id: 'difficult_season',
    labelKey: 'care.support.type.difficult',
    legacyLabels: ["I'm going through something difficult", 'Estoy pasando por algo difícil'],
  },
  {
    id: 'new_believer',
    labelKey: 'care.support.type.newBeliever',
    legacyLabels: ['I recently gave my life to Christ', 'Recientemente entregué mi vida a Cristo'],
  },
  {
    id: 'other',
    labelKey: 'care.support.type.other',
    legacyLabels: ['Other', 'Otro'],
  },
];

export const resolveCareSupportCategory = (value?: string): CareSupportCategoryId => {
  if (!value) return 'pastor_conversation';
  const normalized = value.trim().toLowerCase();
  const match = CARE_SUPPORT_CATEGORIES.find(
    (category) =>
      category.id === value ||
      category.legacyLabels.some((label) => label.trim().toLowerCase() === normalized)
  );
  return match?.id || 'pastor_conversation';
};

export const DOCUMENT_STATUS = {
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  POR_VENCER: 'POR_VENCER',
  VENCIDO: 'VENCIDO',
  RESPONDIDO: 'RESPONDIDO',
};

export const STATUS_CONFIG = {
  [DOCUMENT_STATUS.PENDIENTE]: {
    label: 'Pendiente',
    bg: '#EEF2FF',
    text: '#4338CA',
    dot: '#6366F1',
    border: '#C7D2FE',
  },
  [DOCUMENT_STATUS.EN_PROCESO]: {
    label: 'En Proceso',
    bg: '#EFF6FF',
    text: '#1D4ED8',
    dot: '#3B82F6',
    border: '#BFDBFE',
  },
  [DOCUMENT_STATUS.POR_VENCER]: {
    label: 'Por Vencer',
    bg: '#FFFBEB',
    text: '#B45309',
    dot: '#F59E0B',
    border: '#FDE68A',
  },
  [DOCUMENT_STATUS.VENCIDO]: {
    label: 'Vencido',
    bg: '#FEF2F2',
    text: '#B91C1C',
    dot: '#EF4444',
    border: '#FECACA',
  },
  [DOCUMENT_STATUS.RESPONDIDO]: {
    label: 'Respondido',
    bg: '#F0FDF4',
    text: '#15803D',
    dot: '#22C55E',
    border: '#BBF7D0',
  },
};

export const PRIORIDAD_CONFIG = {
  Alta: { bg: '#FEF2F2', text: '#991B1B' },
  Media: { bg: '#FFFBEB', text: '#92400E' },
  Baja: { bg: '#F0FDF4', text: '#14532D' },
};

export const DEPENDENCIAS = [
  'Todas las dependencias',
  'Despacho del Alcalde',
  'Secretaría General',
  'Secretaría de Hacienda',
  'Secretaría de Planeación',
  'Secretaría de Infraestructura',
  'Secretaría de Salud',
  'Secretaría de Medio Ambiente',
];

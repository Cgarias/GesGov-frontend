const STATUS_CONFIG = {
  PENDIENTE:   { label: 'Pendiente',   bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
  EN_PROCESO:  { label: 'En Proceso',  bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  POR_VENCER:  { label: 'Por Vencer',  bg: '#FFFBEB', color: '#B45309', dot: '#F59E0B' },
  VENCIDO:     { label: 'Vencido',     bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
  RESPONDIDO:  { label: 'Respondido',  bg: '#ECFDF5', color: '#059669', dot: '#10B981' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDIENTE;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        background: cfg.bg,
        color: cfg.color,
        letterSpacing: '-.01em',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

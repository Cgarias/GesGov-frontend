import { STATUS_CONFIG, DOCUMENT_STATUS } from '../../constants/documentStatus';

/**
 * Badge que muestra el estado de un documento con colores
 */
export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[DOCUMENT_STATUS.PENDIENTE];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        borderRadius: 20,
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '.02em',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: config.dot,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}

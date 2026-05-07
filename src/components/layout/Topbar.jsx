import { Icons } from '../common/Icons';
import { Button } from '../common/Button';

/**
 * Componente Topbar - Barra superior
 */
export function Topbar({ title, subtitle, onNew, stats = {} }) {
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const alerts = (stats.VENCIDO || 0) + (stats.POR_VENCER || 0);

  return (
    <header
      style={{
        background: '#fff',
        borderBottom: '1px solid var(--gray-200)',
        padding: '0 32px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,.05)',
      }}
    >
      <div>
        <h2 style={{ fontSize: 18, color: 'var(--navy)', margin: 0 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 12, color: 'var(--gray-400)', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            fontSize: 12,
            color: 'var(--gray-400)',
            textTransform: 'capitalize',
          }}
        >
          {today}
        </span>

        {/* Notificaciones */}
        <button
          style={{
            position: 'relative',
            background: 'var(--gray-100)',
            border: 'none',
            borderRadius: 8,
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--gray-500)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Icons.Bell />
          {alerts > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#EF4444',
                border: '1.5px solid #fff',
              }}
            />
          )}
        </button>

        {onNew && (
          <Button onClick={onNew} icon={<Icons.Plus />} variant="gold">
            Radicar Documento
          </Button>
        )}
      </div>
    </header>
  );
}

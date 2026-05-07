import { Bell, FilePlus } from 'lucide-react';
import { Button } from '../common/Button';

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
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 28px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: 'var(--shadow-xs)',
        flexShrink: 0,
      }}
    >
      {/* Título */}
      <div>
        <h2
          style={{
            fontSize: 17,
            color: 'var(--text-1)',
            margin: 0,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            letterSpacing: '-.02em',
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 12, color: 'var(--text-4)', margin: 0, marginTop: 1 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontSize: 12,
            color: 'var(--text-4)',
            textTransform: 'capitalize',
            display: 'none',
          }}
          className="hide-mobile"
        >
          {today}
        </span>

        {/* Notificaciones */}
        <button
          style={{
            position: 'relative',
            background: 'var(--surface-3)',
            border: '1px solid var(--border)',
            borderRadius: 9,
            padding: '7px',
            cursor: 'pointer',
            color: 'var(--text-3)',
            display: 'flex',
            alignItems: 'center',
            transition: 'all .15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface-2)';
            e.currentTarget.style.borderColor = 'var(--border-2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--surface-3)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <Bell size={17} />
          {alerts > 0 && (
            <span
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--danger)',
                border: '1.5px solid var(--surface)',
              }}
            />
          )}
        </button>

        {onNew && (
          <Button
            onClick={onNew}
            icon={<FilePlus size={16} />}
            variant="primary"
            size="md"
          >
            Radicar Documento
          </Button>
        )}
      </div>
    </header>
  );
}

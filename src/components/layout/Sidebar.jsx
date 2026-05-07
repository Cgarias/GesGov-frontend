import { Icons } from '../common/Icons';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Panel Principal', icon: Icons.Dashboard },
  { id: 'documents', label: 'Documentos', icon: Icons.Documents },
  { id: 'upload', label: 'Radicar Documento', icon: Icons.Upload },
  { id: 'reports', label: 'Reportes', icon: Icons.Reports },
  { id: 'settings', label: 'Configuración', icon: Icons.Settings },
];

/**
 * Componente Sidebar - Navegación lateral
 */
export function Sidebar({ active, onNav, collapsed, onToggle, stats = {} }) {
  const vencidos = stats.VENCIDO || 0;
  const porVencer = stats.POR_VENCER || 0;
  const totalDocs = Object.values(stats).reduce((sum, val) => sum + val, 0);

  return (
    <aside
      style={{
        width: collapsed ? 68 : 'var(--sidebar-w)',
        minWidth: collapsed ? 68 : 'var(--sidebar-w)',
        background: 'var(--navy)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'width .25s ease, min-width .25s ease',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '20px 16px' : '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          minHeight: 80,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            background: 'linear-gradient(145deg, var(--gold), var(--gold-dk))',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,.3)',
          }}
        >
          <Icons.Office />
        </div>
        {!collapsed && (
          <div style={{ animation: 'fadeIn .2s ease' }}>
            <div
              style={{
                fontFamily: "'Libre Baskerville', serif",
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Alcaldía Municipal
            </div>
            <div style={{ color: 'var(--gold-lt)', fontSize: 11, marginTop: 2 }}>
              Sistema de Gestión Documental
            </div>
          </div>
        )}
      </div>

      {/* Alertas */}
      {!collapsed && (vencidos > 0 || porVencer > 0) && (
        <div
          style={{
            margin: '12px 12px 0',
            background: 'rgba(239,68,68,.12)',
            border: '1px solid rgba(239,68,68,.3)',
            borderRadius: 8,
            padding: '10px 12px',
            animation: 'fadeIn .3s ease',
          }}
        >
          <div
            style={{
              color: '#FCA5A5',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
            }}
          >
            <Icons.Alert /> Alertas activas
          </div>
          {vencidos > 0 && (
            <div style={{ color: '#FCA5A5', fontSize: 11 }}>
              • {vencidos} documento(s) vencido(s)
            </div>
          )}
          {porVencer > 0 && (
            <div style={{ color: '#FCD34D', fontSize: 11 }}>
              • {porVencer} por vencer pronto
            </div>
          )}
        </div>
      )}

      {/* Navegación */}
      <nav
        style={{
          flex: 1,
          padding: '16px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 12,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '11px 0' : '11px 14px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'rgba(201,168,76,.18)' : 'transparent',
                color: isActive ? 'var(--gold-lt)' : 'rgba(255,255,255,.65)',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: 'all .15s',
                width: '100%',
                borderLeft: isActive
                  ? '3px solid var(--gold)'
                  : '3px solid transparent',
              }}
            >
              <IconComponent />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.id === 'documents' && totalDocs > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: 'rgba(255,255,255,.12)',
                    color: 'rgba(255,255,255,.7)',
                    fontSize: 11,
                    padding: '1px 7px',
                    borderRadius: 10,
                    fontWeight: 600,
                  }}
                >
                  {totalDocs}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Toggle + User */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,.08)',
          padding: '12px 10px',
        }}
      >
        <button
          onClick={onToggle}
          style={{
            width: '100%',
            padding: '9px',
            borderRadius: 8,
            background: 'rgba(255,255,255,.05)',
            border: '1px solid rgba(255,255,255,.08)',
            color: 'rgba(255,255,255,.5)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            gap: 8,
            transition: 'all .15s',
          }}
        >
          <Icons.Menu />
          {!collapsed && <span>Colapsar menú</span>}
        </button>

        {!collapsed && (
          <div
            style={{
              marginTop: 10,
              padding: '10px 12px',
              background: 'rgba(255,255,255,.05)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: 'fadeIn .2s ease',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dk))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--navy)',
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              JS
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>
                Juan Secretario
              </div>
              <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11 }}>
                Administrador
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Building2,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Panel Principal',    Icon: LayoutDashboard },
  { id: 'documents', label: 'Documentos',          Icon: FileText },
  { id: 'upload',    label: 'Radicar Documento',   Icon: FilePlus },
  { id: 'settings',  label: 'Configuración',       Icon: Settings },
];

export function Sidebar({ active, onNav, collapsed, onToggle, stats = {} }) {
  const { user, logout } = useAuth();
  const vencidos  = stats.VENCIDO    || 0;
  const porVencer = stats.POR_VENCER || 0;
  const totalDocs = Object.values(stats).reduce((s, v) => s + v, 0);

  return (
    <aside
      style={{
        width: collapsed ? 64 : 'var(--sidebar-w)',
        minWidth: collapsed ? 64 : 'var(--sidebar-w)',
        background: 'var(--sidebar-bg)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'width .22s cubic-bezier(.4,0,.2,1), min-width .22s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
        flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,.06)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? '18px 14px' : '20px 18px',
          borderBottom: '1px solid rgba(255,255,255,.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          minHeight: 72,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            flexShrink: 0,
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dk) 100%)',
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(37,99,235,.4)',
          }}
        >
          <Building2 size={17} color="#fff" />
        </div>
        {!collapsed && (
          <div style={{ animation: 'slideRight .2s ease' }}>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-.02em',
              }}
            >
              Alcaldía Municipal
            </div>
            <div style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginTop: 2 }}>
              Gestión Documental
            </div>
          </div>
        )}
      </div>

      {/* Alertas */}
      {!collapsed && (vencidos > 0 || porVencer > 0) && (
        <div
          style={{
            margin: '10px 10px 0',
            background: 'rgba(239,68,68,.1)',
            border: '1px solid rgba(239,68,68,.2)',
            borderRadius: 8,
            padding: '10px 12px',
            animation: 'fadeIn .3s ease',
          }}
        >
          <div
            style={{
              color: '#FCA5A5',
              fontSize: 11,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              marginBottom: 5,
            }}
          >
            <AlertTriangle size={12} /> Alertas activas
          </div>
          {vencidos > 0 && (
            <div style={{ color: '#FCA5A5', fontSize: 11 }}>
              · {vencidos} documento{vencidos > 1 ? 's' : ''} vencido{vencidos > 1 ? 's' : ''}
            </div>
          )}
          {porVencer > 0 && (
            <div style={{ color: '#FCD34D', fontSize: 11 }}>
              · {porVencer} por vencer pronto
            </div>
          )}
        </div>
      )}

      {/* Navegación */}
      <nav
        style={{
          flex: 1,
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflowY: 'auto',
        }}
      >
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              title={collapsed ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '10px 0' : '10px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? 'var(--sidebar-active)' : 'transparent',
                color: isActive ? '#60A5FA' : 'rgba(255,255,255,.55)',
                fontWeight: isActive ? 600 : 400,
                fontSize: 13.5,
                transition: 'all .15s',
                width: '100%',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--sidebar-hover)';
                if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,.85)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
                if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,.55)';
              }}
            >
              {/* Indicador activo */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    height: '60%',
                    width: 3,
                    background: '#60A5FA',
                    borderRadius: '0 3px 3px 0',
                  }}
                />
              )}
              <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && id === 'documents' && totalDocs > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: 'rgba(255,255,255,.1)',
                    color: 'rgba(255,255,255,.6)',
                    fontSize: 11,
                    padding: '1px 7px',
                    borderRadius: 99,
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

      {/* Footer: toggle + usuario */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '10px 8px' }}>
        {/* Toggle */}
        <button
          onClick={onToggle}
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: 8,
            background: 'rgba(255,255,255,.05)',
            border: '1px solid rgba(255,255,255,.07)',
            color: 'rgba(255,255,255,.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 12,
            transition: 'all .15s',
            marginBottom: 8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,.09)';
            e.currentTarget.style.color = 'rgba(255,255,255,.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,.05)';
            e.currentTarget.style.color = 'rgba(255,255,255,.4)';
          }}
        >
          {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /><span>Colapsar</span></>}
        </button>

        {/* Usuario + Logout */}
        {!collapsed && (
          <div
            style={{
              marginTop: 8,
              padding: '10px 12px',
              background: 'rgba(255,255,255,.05)',
              borderRadius: 8,
              animation: 'fadeIn .2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dk) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div
                  style={{
                    color: '#fff',
                    fontSize: 12.5,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name || 'Usuario'}
                </div>
                <div style={{ color: 'rgba(255,255,255,.35)', fontSize: 11 }}>
                  {user?.role || 'Sin rol'}
                </div>
              </div>
              <button
                onClick={logout}
                title="Cerrar sesión"
                style={{
                  background: 'rgba(239,68,68,.15)',
                  border: '1px solid rgba(239,68,68,.25)',
                  borderRadius: 7,
                  padding: '5px',
                  cursor: 'pointer',
                  color: '#FCA5A5',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all .15s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,.3)';
                  e.currentTarget.style.color = '#FEE2E2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239,68,68,.15)';
                  e.currentTarget.style.color = '#FCA5A5';
                }}
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        )}
        {collapsed && (
          <button
            onClick={logout}
            title="Cerrar sesión"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: 8,
              background: 'rgba(239,68,68,.1)',
              border: '1px solid rgba(239,68,68,.2)',
              color: '#FCA5A5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
              transition: 'all .15s',
            }}
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </aside>
  );
}

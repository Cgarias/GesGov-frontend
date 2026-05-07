import { Card, Button, Loading, ErrorMessage } from '../common';

/**
 * Vista del Dashboard con estadísticas
 */
export function Dashboard({ stats, loading, error, onNav, onRetry }) {
  if (loading) {
    return <Loading message="Cargando estadísticas..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  const total = Object.values(stats).reduce((sum, val) => sum + val, 0);

  const StatCard = ({ label, value, color, bg, border, icon }) => (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        animation: 'fadeUp .4s ease both',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 22,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--navy)',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>
          {label}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>
      {/* Banner institucional */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-lt) 100%)',
          borderRadius: 14,
          padding: '28px 36px',
          marginBottom: 28,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeUp .4s ease both',
        }}
      >
        <div>
          <h2
            style={{
              color: '#fff',
              fontFamily: "'Libre Baskerville', serif",
              fontSize: 22,
              marginBottom: 6,
            }}
          >
            Sistema de Gestión de Tiempo de Respuesta
          </h2>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, margin: 0 }}>
            Control y seguimiento de documentos institucionales · Alcaldía Municipal
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--gold-lt)', fontSize: 13, fontWeight: 600 }}>
            Vigencia 2025
          </div>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, marginTop: 2 }}>
            {total} documentos activos
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="Total Documentos"
          value={total}
          color="#0D2545"
          bg="#EEF2FF"
          border="#C7D2FE"
          icon="📋"
        />
        <StatCard
          label="En Proceso"
          value={stats.EN_PROCESO || 0}
          color="#1D4ED8"
          bg="#EFF6FF"
          border="#BFDBFE"
          icon="🔄"
        />
        <StatCard
          label="Por Vencer"
          value={stats.POR_VENCER || 0}
          color="#B45309"
          bg="#FFFBEB"
          border="#FDE68A"
          icon="⚠️"
        />
        <StatCard
          label="Vencidos"
          value={stats.VENCIDO || 0}
          color="#B91C1C"
          bg="#FEF2F2"
          border="#FECACA"
          icon="🔴"
        />
        <StatCard
          label="Respondidos"
          value={stats.RESPONDIDO || 0}
          color="#15803D"
          bg="#F0FDF4"
          border="#BBF7D0"
          icon="✅"
        />
      </div>

      {/* Mensaje de bienvenida */}
      <Card animate style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
        <h3 style={{ marginBottom: 8 }}>Sistema Operativo</h3>
        <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 20 }}>
          El sistema está funcionando correctamente. Navega por las secciones para gestionar documentos.
        </p>
        <Button onClick={() => onNav('documents')} variant="gold">
          Ver Documentos
        </Button>
      </Card>
    </div>
  );
}

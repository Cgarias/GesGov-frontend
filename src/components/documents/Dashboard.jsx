import {
  FileText,
  RefreshCw,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button, Loading, ErrorMessage } from '../common';

const STAT_CONFIG = [
  {
    key: 'total',
    label: 'Total Documentos',
    Icon: FileText,
    color: '#2563EB',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    key: 'EN_PROCESO',
    label: 'En Proceso',
    Icon: RefreshCw,
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
  {
    key: 'POR_VENCER',
    label: 'Por Vencer',
    Icon: AlertTriangle,
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    key: 'VENCIDO',
    label: 'Vencidos',
    Icon: XCircle,
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
  {
    key: 'RESPONDIDO',
    label: 'Respondidos',
    Icon: CheckCircle2,
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    key: 'PENDIENTE',
    label: 'Pendientes',
    Icon: Clock,
    color: '#475569',
    bg: '#F8FAFC',
    border: '#E2E8F0',
  },
];

export function Dashboard({ stats, loading, error, onNav, onRetry }) {
  if (loading) return <Loading message="Cargando estadísticas..." />;
  if (error)   return <ErrorMessage message={error} onRetry={onRetry} />;

  const total = Object.values(stats).reduce((s, v) => s + v, 0);
  const statsWithTotal = { ...stats, total };

  const urgentes = (stats.VENCIDO || 0) + (stats.POR_VENCER || 0);

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1200 }}>

      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #3B82F6 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(37,99,235,.25)',
          animation: 'fadeUp .4s ease both',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decoración */}
        <div
          style={{
            position: 'absolute',
            right: -40,
            top: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,.05)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 60,
            bottom: -60,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'rgba(255,255,255,.04)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,.15)',
              borderRadius: 99,
              padding: '3px 12px',
              fontSize: 11,
              color: 'rgba(255,255,255,.85)',
              fontWeight: 600,
              marginBottom: 10,
              letterSpacing: '.04em',
            }}
          >
            <TrendingUp size={11} /> SISTEMA ACTIVO
          </div>
          <h2
            style={{
              color: '#fff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 22,
              marginBottom: 6,
              letterSpacing: '-.03em',
            }}
          >
            Sistema de Gestión Documental
          </h2>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, margin: 0 }}>
            Control y seguimiento de tiempos de respuesta · Alcaldía Municipal
          </p>
        </div>

        <div style={{ textAlign: 'right', position: 'relative' }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: '#fff',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              lineHeight: 1,
            }}
          >
            {total}
          </div>
          <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, marginTop: 4 }}>
            documentos activos
          </div>
          {urgentes > 0 && (
            <div
              style={{
                marginTop: 8,
                background: 'rgba(239,68,68,.25)',
                border: '1px solid rgba(239,68,68,.4)',
                borderRadius: 99,
                padding: '3px 10px',
                fontSize: 11,
                color: '#FCA5A5',
                fontWeight: 600,
              }}
            >
              ⚠ {urgentes} requieren atención
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >
        {STAT_CONFIG.map(({ key, label, Icon, color, bg, border }, i) => (
          <div
            key={key}
            style={{
              background: 'var(--surface)',
              border: `1px solid ${border}`,
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              animation: `fadeUp .4s ease ${i * 0.05}s both`,
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform .2s, box-shadow .2s',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 11,
                background: bg,
                border: `1px solid ${border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color,
              }}
            >
              <Icon size={19} strokeWidth={2} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: 'var(--text-1)',
                  lineHeight: 1,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {statsWithTotal[key] || 0}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)',
          animation: 'fadeUp .4s ease .3s both',
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text-1)',
              marginBottom: 4,
            }}
          >
            Gestión de Documentos
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
            Consulta, filtra y administra todos los documentos radicados en el sistema.
          </p>
        </div>
        <Button
          onClick={() => onNav('documents')}
          variant="primary"
          icon={<ArrowRight size={15} />}
          style={{ flexShrink: 0 }}
        >
          Ver Documentos
        </Button>
      </div>
    </div>
  );
}

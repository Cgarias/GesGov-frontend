import { X, FileText, Calendar, CheckCircle, Trash2, Clock } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatDate, getDaysRemaining, formatFileSize } from '../../utils/dateUtils';

export function DocumentDetailModal({ document, onClose, onMarkResponded, onDelete }) {
  if (!document) return null;

  const days = getDaysRemaining(document.responseDeadline);

  const handleMarkResponded = async () => {
    if (window.confirm('¿Marcar este documento como respondido?')) {
      try {
        await onMarkResponded(document._id);
        onClose();
      } catch {
        alert('Error al actualizar el documento');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Eliminar este documento? Esta acción no se puede deshacer.')) {
      try {
        await onDelete(document._id);
        onClose();
      } catch {
        alert('Error al eliminar el documento');
      }
    }
  };

  const InfoRow = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-4)',
          textTransform: 'uppercase',
          letterSpacing: '.07em',
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15,23,42,.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn .2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: 620,
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: 'var(--shadow-xl)',
          animation: 'scaleIn .22s ease',
          border: '1px solid var(--border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            padding: '22px 24px',
            borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'rgba(255,255,255,.12)',
              border: 'none',
              borderRadius: 8,
              padding: '6px',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.12)')}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingRight: 36 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                flexShrink: 0,
                background: 'rgba(255,255,255,.12)',
                border: '1px solid rgba(255,255,255,.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              {document.radicado && (
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 11,
                    background: 'rgba(255,255,255,.15)',
                    color: 'rgba(255,255,255,.85)',
                    padding: '2px 9px',
                    borderRadius: 99,
                    fontWeight: 700,
                    marginBottom: 7,
                    letterSpacing: '.03em',
                  }}
                >
                  {document.radicado}
                </span>
              )}
              <h3
                style={{
                  color: '#fff',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 16,
                  lineHeight: 1.35,
                  letterSpacing: '-.02em',
                }}
              >
                {document.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 24px' }}>

          {/* Estado + Fecha límite */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div
              style={{
                background: 'var(--surface-2)',
                borderRadius: 10,
                padding: '12px 14px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 7 }}>
                Estado
              </div>
              <StatusBadge status={document.status} />
            </div>

            <div
              style={{
                background: 'var(--surface-2)',
                borderRadius: 10,
                padding: '12px 14px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 7 }}>
                Fecha límite
              </div>
              {document.responseDeadline ? (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text-1)',
                    }}
                  >
                    <Calendar size={13} style={{ color: 'var(--text-3)' }} />
                    {formatDate(document.responseDeadline)}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      marginTop: 3,
                      fontWeight: 600,
                      color: days < 0 ? '#DC2626' : days <= 3 ? '#D97706' : '#059669',
                    }}
                  >
                    {days < 0
                      ? `Vencido hace ${Math.abs(days)} días`
                      : days === 0
                      ? 'Vence hoy'
                      : `${days} días restantes`}
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: 13, color: 'var(--text-4)' }}>Sin fecha límite</span>
              )}
            </div>
          </div>

          {/* Descripción */}
          {document.description && (
            <InfoRow label="Descripción">
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                {document.description}
              </p>
            </InfoRow>
          )}

          {/* Archivo */}
          <InfoRow label="Archivo adjunto">
            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 9,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: 'var(--primary-bg)',
                  border: '1px solid var(--primary-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0,
                }}
              >
                <FileText size={17} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                  {document.fileName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>
                  {formatFileSize(document.fileSize)} ·{' '}
                  {document.mimeType?.includes('pdf')
                    ? 'PDF'
                    : document.mimeType?.includes('word') || document.mimeType?.includes('openxmlformats')
                    ? 'Word'
                    : document.mimeType?.includes('excel') || document.mimeType?.includes('spreadsheet')
                    ? 'Excel'
                    : 'Imagen'}
                </div>
              </div>
            </div>
          </InfoRow>

          {/* Notas */}
          {document.notes && (
            <InfoRow label="Notas internas">
              <div
                style={{
                  background: 'var(--warning-bg)',
                  border: '1px solid var(--warning-border)',
                  borderRadius: 9,
                  padding: '12px 14px',
                }}
              >
                <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.55 }}>
                  {document.notes}
                </p>
              </div>
            </InfoRow>
          )}

          {/* Fechas */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              fontSize: 12,
              color: 'var(--text-4)',
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
              marginBottom: 18,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> Radicado: {formatDate(document.createdAt)}
            </span>
            {document.respondedAt && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={12} /> Respondido: {formatDate(document.respondedAt)}
              </span>
            )}
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {document.status !== 'RESPONDIDO' && (
              <Button
                variant="success"
                icon={<CheckCircle size={15} />}
                onClick={handleMarkResponded}
              >
                Marcar Respondido
              </Button>
            )}
            <Button
              variant="danger"
              icon={<Trash2 size={14} />}
              onClick={handleDelete}
              style={{ marginLeft: 'auto' }}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

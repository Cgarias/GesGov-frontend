import { StatusBadge, Button, Icons } from '../common';
import { formatDate, getDaysRemaining, formatFileSize } from '../../utils/dateUtils';

/**
 * Modal de detalle de documento
 */
export function DocumentDetailModal({ document, onClose, onMarkResponded, onDelete }) {
  if (!document) return null;

  const days = getDaysRemaining(document.responseDeadline);

  const handleMarkResponded = async () => {
    if (window.confirm('¿Marcar este documento como respondido?')) {
      try {
        await onMarkResponded(document._id);
        onClose();
      } catch (error) {
        alert('Error al actualizar el documento');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Está seguro de eliminar este documento? Esta acción no se puede deshacer.')) {
      try {
        await onDelete(document._id);
        onClose();
      } catch (error) {
        alert('Error al eliminar el documento');
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(13,37,69,.55)',
        backdropFilter: 'blur(4px)',
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
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 640,
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,.25)',
          animation: 'scaleIn .25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-lt) 100%)',
            padding: '24px 28px',
            borderRadius: '16px 16px 0 0',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,.15)',
              border: 'none',
              borderRadius: 8,
              padding: '6px',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icons.Close />
          </button>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                flexShrink: 0,
                background: 'rgba(201,168,76,.25)',
                border: '1px solid rgba(201,168,76,.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons.File />
            </div>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <code
                  style={{
                    fontSize: 11,
                    background: 'rgba(255,255,255,.15)',
                    color: 'var(--gold-lt)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 700,
                  }}
                >
                  {document.radicado || 'SIN-RAD'}
                </code>
              </div>
              <h3
                style={{
                  color: '#fff',
                  fontFamily: "'Libre Baskerville',serif",
                  fontSize: 17,
                  lineHeight: 1.3,
                  marginBottom: 4,
                }}
              >
                {document.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* Estado y fechas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                background: 'var(--gray-50)',
                borderRadius: 8,
                padding: '12px 14px',
                border: '1px solid var(--gray-200)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--gray-400)',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                ESTADO
              </div>
              <StatusBadge status={document.status} />
            </div>
            <div
              style={{
                background: 'var(--gray-50)',
                borderRadius: 8,
                padding: '12px 14px',
                border: '1px solid var(--gray-200)',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--gray-400)',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                FECHA LÍMITE
              </div>
              <div style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 600 }}>
                {document.responseDeadline ? (
                  <>
                    {formatDate(document.responseDeadline)}
                    <br />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: days < 0 ? '#B91C1C' : days <= 3 ? '#B45309' : '#15803D',
                      }}
                    >
                      {days < 0
                        ? `Vencido ${Math.abs(days)}d`
                        : days === 0
                        ? 'Vence hoy'
                        : `${days}d restantes`}
                    </span>
                  </>
                ) : (
                  '—'
                )}
              </div>
            </div>
          </div>

          {/* Descripción */}
          {document.description && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--gray-400)',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                DESCRIPCIÓN
              </div>
              <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6, margin: 0 }}>
                {document.description}
              </p>
            </div>
          )}

          {/* Archivo */}
          <div
            style={{
              background: 'var(--gray-50)',
              border: '1px solid var(--gray-200)',
              borderRadius: 8,
              padding: '14px 16px',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ color: 'var(--navy-lt)' }}>
              <Icons.File />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>
                {document.fileName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                {formatFileSize(document.fileSize)} ·{' '}
                {document.mimeType.includes('pdf')
                  ? 'PDF'
                  : document.mimeType.includes('word') ||
                    document.mimeType.includes('openxmlformats')
                  ? 'Word'
                  : 'Imagen'}
              </div>
            </div>
          </div>

          {/* Notas */}
          {document.notes && (
            <div
              style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 8,
                padding: '12px 14px',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: '#B45309',
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                📝 NOTAS INTERNAS
              </div>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                {document.notes}
              </p>
            </div>
          )}

          {/* Acciones */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              paddingTop: 16,
              borderTop: '1px solid var(--gray-200)',
            }}
          >
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {document.status !== 'RESPONDIDO' && (
              <Button variant="success" icon={<Icons.Check />} onClick={handleMarkResponded}>
                Marcar Respondido
              </Button>
            )}
            <Button
              variant="danger"
              icon={<Icons.Trash />}
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

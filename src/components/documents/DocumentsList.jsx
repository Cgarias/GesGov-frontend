import { useState } from 'react';
import { Card, StatusBadge, Loading, ErrorMessage, Icons } from '../common';
import { getDaysRemaining, formatDate } from '../../utils/dateUtils';
import { DOCUMENT_STATUS } from '../../constants/documentStatus';

/**
 * Vista de lista de documentos con búsqueda y filtros
 */
export function DocumentsList({ documents, loading, error, onViewDetail, onRetry }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  if (loading) {
    return <Loading message="Cargando documentos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  // Filtrar documentos
  const filtered = documents.filter((doc) => {
    const matchesSearch =
      !search ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.radicado?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'TODOS' || doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* Barra de búsqueda y filtros */}
      <Card style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Búsqueda */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <span
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--gray-400)',
              }}
            >
              <Icons.Search />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título o radicado..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 34px',
                borderRadius: 8,
                border: '1.5px solid var(--gray-200)',
                fontSize: 14,
                color: 'var(--gray-700)',
                outline: 'none',
                background: 'var(--gray-50)',
              }}
            />
          </div>

          {/* Filtro por estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 12px',
              borderRadius: 8,
              border: '1.5px solid var(--gray-200)',
              fontSize: 13,
              color: 'var(--gray-700)',
              background: 'var(--gray-50)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="TODOS">Todos los estados</option>
            {Object.values(DOCUMENT_STATUS).map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-400)' }}>
          Mostrando <strong style={{ color: 'var(--navy)' }}>{filtered.length}</strong> de{' '}
          {documents.length} documentos
        </div>
      </Card>

      {/* Lista de documentos */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--gray-400)',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No se encontraron documentos</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {search || statusFilter !== 'TODOS'
              ? 'Ajusta los filtros para ver más resultados'
              : 'Aún no hay documentos registrados'}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
            gap: 16,
          }}
        >
          {filtered.map((doc, i) => {
            const days = getDaysRemaining(doc.responseDeadline);

            return (
              <Card
                key={doc._id}
                animate
                onClick={() => onViewDetail(doc)}
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  animationDelay: `${i * 0.06}s`,
                  transition: 'transform .2s, box-shadow .2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12,
                  }}
                >
                  <code
                    style={{
                      fontSize: 11,
                      color: 'var(--navy-lt)',
                      fontWeight: 700,
                      background: '#EFF6FF',
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {doc.radicado || 'SIN-RAD'}
                  </code>
                </div>

                <h4
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--navy)',
                    marginBottom: 6,
                    lineHeight: 1.4,
                  }}
                >
                  {doc.title}
                </h4>

                {doc.description && (
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--gray-500)',
                      marginBottom: 14,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {doc.description}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                  }}
                >
                  <StatusBadge status={doc.status} />
                  {doc.responseDeadline && (
                    <span
                      style={{
                        fontSize: 11,
                        color:
                          days < 0
                            ? '#B91C1C'
                            : days <= 3
                            ? '#B45309'
                            : 'var(--gray-400)',
                        fontWeight: 600,
                      }}
                    >
                      📅{' '}
                      {days < 0
                        ? `Vencido ${Math.abs(days)}d`
                        : days === 0
                        ? 'Vence hoy'
                        : `${days}d restantes`}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: '1px solid var(--gray-100)',
                    fontSize: 11,
                    color: 'var(--gray-400)',
                  }}
                >
                  Radicado el {formatDate(doc.createdAt)}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

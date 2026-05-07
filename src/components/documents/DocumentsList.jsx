import { useState } from 'react';
import { Search, Inbox, Calendar, Eye } from 'lucide-react';
import { StatusBadge, Loading, ErrorMessage } from '../common';
import { getDaysRemaining, formatDate } from '../../utils/dateUtils';
import { DOCUMENT_STATUS } from '../../constants/documentStatus';

export function DocumentsList({ documents, loading, error, onViewDetail, onRetry }) {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  if (loading) return <Loading message="Cargando documentos..." />;
  if (error)   return <ErrorMessage message={error} onRetry={onRetry} />;

  const filtered = documents.filter((doc) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      doc.title.toLowerCase().includes(q) ||
      doc.radicado?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'TODOS' || doc.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div style={{ padding: '24px 28px' }}>

      {/* Barra de filtros */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          marginBottom: 20,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* Búsqueda */}
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: 11,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-4)',
              pointerEvents: 'none',
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o radicado..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: 8,
              border: '1.5px solid var(--border)',
              fontSize: 13.5,
              color: 'var(--text-1)',
              outline: 'none',
              background: 'var(--surface-2)',
              fontFamily: "'Inter', sans-serif",
              transition: 'border-color .15s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Filtro estado */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1.5px solid var(--border)',
            fontSize: 13.5,
            color: 'var(--text-2)',
            background: 'var(--surface-2)',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <option value="TODOS">Todos los estados</option>
          {Object.values(DOCUMENT_STATUS).map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>

        <span style={{ fontSize: 13, color: 'var(--text-4)', marginLeft: 'auto' }}>
          <strong style={{ color: 'var(--text-1)' }}>{filtered.length}</strong> de {documents.length}
        </span>
      </div>

      {/* Lista vacía */}
      {filtered.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 20px',
            color: 'var(--text-4)',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--surface-3)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Inbox size={24} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>
              No se encontraron documentos
            </p>
            <p style={{ fontSize: 13 }}>
              {search || statusFilter !== 'TODOS'
                ? 'Ajusta los filtros para ver más resultados'
                : 'Aún no hay documentos registrados en el sistema'}
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 14,
          }}
        >
          {filtered.map((doc, i) => {
            const days = getDaysRemaining(doc.responseDeadline);
            const isUrgent = days !== null && days <= 3;
            const isOverdue = days !== null && days < 0;

            return (
              <div
                key={doc._id}
                onClick={() => onViewDetail(doc)}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${isOverdue ? 'var(--danger-border)' : isUrgent ? 'var(--warning-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 20px',
                  cursor: 'pointer',
                  animation: `fadeUp .35s ease ${i * 0.04}s both`,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform .18s, box-shadow .18s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Cabecera */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {doc.radicado && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--primary)',
                        background: 'var(--primary-bg)',
                        border: '1px solid var(--primary-border)',
                        padding: '2px 8px',
                        borderRadius: 99,
                        letterSpacing: '.02em',
                      }}
                    >
                      {doc.radicado}
                    </span>
                  )}
                  <Eye size={14} style={{ color: 'var(--text-4)', marginLeft: 'auto' }} />
                </div>

                {/* Título */}
                <h4
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text-1)',
                    lineHeight: 1.4,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    margin: 0,
                  }}
                >
                  {doc.title}
                </h4>

                {/* Descripción */}
                {doc.description && (
                  <p
                    style={{
                      fontSize: 12.5,
                      color: 'var(--text-3)',
                      lineHeight: 1.5,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {doc.description}
                  </p>
                )}

                {/* Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 10,
                    borderTop: '1px solid var(--border)',
                    marginTop: 'auto',
                  }}
                >
                  <StatusBadge status={doc.status} />

                  {doc.responseDeadline && (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: isOverdue
                          ? '#DC2626'
                          : isUrgent
                          ? '#D97706'
                          : 'var(--text-4)',
                      }}
                    >
                      <Calendar size={12} />
                      {isOverdue
                        ? `Vencido ${Math.abs(days)}d`
                        : days === 0
                        ? 'Vence hoy'
                        : `${days}d restantes`}
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 11, color: 'var(--text-4)' }}>
                  Radicado el {formatDate(doc.createdAt)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

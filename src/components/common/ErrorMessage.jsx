/**
 * Componente para mostrar mensajes de error
 */
export function ErrorMessage({ message, onRetry }) {
  return (
    <div
      style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: 'var(--gray-500)',
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <h3 style={{ color: 'var(--navy)', marginBottom: 8, fontSize: 18 }}>
        Error al cargar datos
      </h3>
      <p style={{ fontSize: 14, marginBottom: 20 }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '10px 24px',
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

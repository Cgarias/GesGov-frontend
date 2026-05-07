/**
 * Componente de carga
 */
export function Loading({ message = 'Cargando...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        color: 'var(--gray-400)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '4px solid var(--gray-200)',
          borderTop: '4px solid var(--navy)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: 16,
        }}
      />
      <p style={{ fontSize: 14 }}>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Componente Card reutilizable
 */
export function Card({ children, style = {}, animate = false, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid var(--gray-200)',
        boxShadow: 'var(--shadow-sm)',
        animation: animate ? 'fadeUp .4s ease both' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

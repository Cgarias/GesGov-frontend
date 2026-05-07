/**
 * Componente Card reutilizable
 */
export function Card({ children, style = {}, animate, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        animation: animate ? 'fadeUp .35s ease both' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

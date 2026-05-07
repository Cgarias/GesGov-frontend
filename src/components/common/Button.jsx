/**
 * Componente Button reutilizable con variantes modernas
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  style = {},
  icon,
  type = 'button',
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    borderRadius: 'var(--radius)',
    transition: 'all .18s',
    opacity: disabled ? 0.55 : 1,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '-.01em',
    whiteSpace: 'nowrap',
  };

  const sizes = {
    sm: { padding: '6px 14px', fontSize: 13 },
    md: { padding: '9px 18px', fontSize: 14 },
    lg: { padding: '11px 24px', fontSize: 15 },
  };

  const variants = {
    primary: {
      background: 'var(--primary)',
      color: '#fff',
      boxShadow: '0 1px 3px rgba(37,99,235,.3)',
    },
    accent: {
      background: 'var(--accent)',
      color: '#fff',
      boxShadow: '0 1px 3px rgba(245,158,11,.3)',
    },
    // Mantener 'gold' como alias de accent para compatibilidad
    gold: {
      background: 'var(--accent)',
      color: '#fff',
      boxShadow: '0 1px 3px rgba(245,158,11,.3)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-2)',
      border: '1.5px solid var(--border-2)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-3)',
    },
    danger: {
      background: 'var(--danger-bg)',
      color: '#DC2626',
      border: '1px solid var(--danger-border)',
    },
    success: {
      background: 'var(--success-bg)',
      color: '#059669',
      border: '1px solid var(--success-border)',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {icon && icon}
      {children}
    </button>
  );
}

/**
 * Componente Button reutilizable con variantes
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
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    borderRadius: 8,
    transition: 'all .18s',
    opacity: disabled ? 0.6 : 1,
    fontFamily: "'Source Sans 3', sans-serif",
  };

  const sizeStyles = {
    sm: { padding: '6px 14px', fontSize: 13 },
    md: { padding: '9px 20px', fontSize: 14 },
    lg: { padding: '12px 28px', fontSize: 15 },
  };

  const variantStyles = {
    primary: { background: 'var(--navy)', color: '#fff' },
    gold: { background: 'var(--gold)', color: 'var(--navy)' },
    outline: {
      background: 'transparent',
      color: 'var(--navy)',
      border: '1.5px solid var(--navy-lt)',
    },
    ghost: { background: 'transparent', color: 'var(--gray-600)' },
    danger: {
      background: '#FEF2F2',
      color: '#B91C1C',
      border: '1px solid #FECACA',
    },
    success: {
      background: '#F0FDF4',
      color: '#15803D',
      border: '1px solid #BBF7D0',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
    >
      {icon && icon}
      {children}
    </button>
  );
}

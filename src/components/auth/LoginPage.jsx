import { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ─── Estilos estáticos (fuera del componente para evitar re-renders) ──────────
const INPUT_BASE = {
  width: '100%',
  padding: '10px 13px 10px 40px',
  borderRadius: 10,
  border: '1.5px solid var(--border)',
  fontSize: 14,
  color: 'var(--text-1)',
  outline: 'none',
  background: 'var(--surface)',
  fontFamily: "'Inter', sans-serif",
  transition: 'border-color .15s, box-shadow .15s',
};

const FEATURES = [
  'Control de tiempos de respuesta',
  'Seguimiento de documentos',
  'Alertas automáticas de vencimiento',
];

const DEMO_CREDS = [
  { label: 'Correo',     value: 'admin@alcaldia.gov.co' },
  { label: 'Contraseña', value: 'Admin1234!' },
];

const CIRCLES = [
  { size: 320, top: -80,   right: -80, opacity: 0.06 },
  { size: 200, bottom: 40, left: -60,  opacity: 0.08 },
  { size: 140, top: '40%', right: 40,  opacity: 0.05 },
];

// ─── Componente Field (fuera de LoginPage para que React no lo re-monte) ──────
function Field({ id, label, IconComponent, error, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-2)',
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <IconComponent
          size={16}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: error ? '#DC2626' : 'var(--text-4)',
            pointerEvents: 'none',
          }}
        />
        {children}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: '#DC2626', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

// ─── Página de Login ──────────────────────────────────────────────────────────
export function LoginPage() {
  const { login, loading, error } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [fieldErr, setFieldErr] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim())                    errs.email    = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email    = 'Correo no válido';
    if (!password)                        errs.password = 'La contraseña es requerida';
    setFieldErr(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try { await login(email.trim(), password); } catch { /* error en contexto */ }
  };

  const onFocus = (e, hasErr) => {
    if (!hasErr) e.target.style.borderColor = 'var(--primary)';
    e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,.1)';
  };
  const onBlur = (e, hasErr) => {
    e.target.style.borderColor = hasErr ? '#DC2626' : 'var(--border)';
    e.target.style.boxShadow   = 'none';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--surface-2)' }}>

      {/* ── Panel izquierdo decorativo ── */}
      <div
        className="login-panel"
        style={{
          flex: '0 0 45%',
          background: 'linear-gradient(145deg, #0F172A 0%, #1E3A8A 50%, #2563EB 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {CIRCLES.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: c.size, height: c.size,
              borderRadius: '50%',
              border: `1px solid rgba(255,255,255,${c.opacity * 2})`,
              background: `rgba(255,255,255,${c.opacity})`,
              top: c.top, bottom: c.bottom, left: c.left, right: c.right,
              pointerEvents: 'none',
            }}
          />
        ))}

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 360 }}>
          <div
            style={{
              width: 72, height: 72, borderRadius: 20,
              background: 'rgba(255,255,255,.1)',
              border: '1px solid rgba(255,255,255,.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Building2 size={34} color="#fff" />
          </div>

          <h1 style={{ color: '#fff', fontSize: 26, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, letterSpacing: '-.03em', marginBottom: 10 }}>
            Alcaldía Municipal
          </h1>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, lineHeight: 1.6, marginBottom: 40 }}>
            Sistema de Gestión de Tiempo de Respuesta Documental
          </p>

          {FEATURES.map((feat) => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textAlign: 'left' }}>
              <div
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'rgba(96,165,250,.25)',
                  border: '1px solid rgba(96,165,250,.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="10" height="10" fill="none" stroke="#60A5FA" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
              <span style={{ color: 'rgba(255,255,255,.75)', fontSize: 13 }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel derecho: formulario ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400, animation: 'fadeUp .4s ease both' }}>

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-.03em', marginBottom: 6 }}>
              Iniciar Sesión
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-3)' }}>
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          {/* Error global del contexto */}
          {error && (
            <div
              style={{
                background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
                borderRadius: 10, padding: '12px 14px', marginBottom: 20,
                display: 'flex', alignItems: 'flex-start', gap: 10,
                animation: 'fadeIn .2s ease',
              }}
            >
              <AlertCircle size={16} style={{ color: '#DC2626', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: '#DC2626', margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Campo correo */}
            <Field id="email" label="Correo electrónico" IconComponent={Mail} error={fieldErr.email}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErr((p) => ({ ...p, email: '' })); }}
                placeholder="usuario@alcaldia.gov.co"
                autoComplete="email"
                style={{ ...INPUT_BASE, borderColor: fieldErr.email ? '#DC2626' : 'var(--border)' }}
                onFocus={(e) => onFocus(e, !!fieldErr.email)}
                onBlur={(e)  => onBlur(e,  !!fieldErr.email)}
              />
            </Field>

            {/* Campo contraseña */}
            <Field id="password" label="Contraseña" IconComponent={Lock} error={fieldErr.password}>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErr((p) => ({ ...p, password: '' })); }}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ ...INPUT_BASE, paddingRight: 42, borderColor: fieldErr.password ? '#DC2626' : 'var(--border)' }}
                onFocus={(e) => onFocus(e, !!fieldErr.password)}
                onBlur={(e)  => onBlur(e,  !!fieldErr.password)}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={{
                  position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-4)', display: 'flex', alignItems: 'center', padding: 2,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </Field>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px 20px', borderRadius: 10, border: 'none',
                background: loading ? 'var(--border-2)' : 'var(--primary)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: "'Inter', sans-serif", letterSpacing: '-.01em',
                transition: 'background .18s',
                boxShadow: loading ? 'none' : '0 2px 8px rgba(37,99,235,.3)',
                marginTop: 4,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--primary-dk)'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = loading ? 'var(--border-2)' : 'var(--primary)'; }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Verificando...
                </>
              ) : (
                <><LogIn size={16} /> Ingresar al Sistema</>
              )}
            </button>
          </form>

          {/* Credenciales de demo */}
          <div style={{ marginTop: 28, padding: '14px 16px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
              Credenciales de acceso inicial
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {DEMO_CREDS.map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-4)', minWidth: 80 }}>{label}:</span>
                  <code style={{ color: 'var(--primary)', fontWeight: 600, background: 'var(--primary-bg)', padding: '1px 7px', borderRadius: 5, fontSize: 12 }}>
                    {value}
                  </code>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-4)', marginTop: 24 }}>
            © {new Date().getFullYear()} Alcaldía Municipal · Sistema GesGov
          </p>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .login-panel { display: none !important; } }`}</style>
    </div>
  );
}

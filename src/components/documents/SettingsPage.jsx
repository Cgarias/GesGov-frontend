import { useState } from 'react';
import { User, Bell, Shield, Palette, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '../common';
import { useAuth } from '../../context/AuthContext';

const Section = ({ title, icon: Icon, children }) => (
  <div
    style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: 18,
      animation: 'fadeUp .35s ease both',
    }}
  >
    <div
      style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        background: 'var(--surface-2)',
      }}
    >
      <Icon size={16} style={{ color: 'var(--primary)' }} />
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--text-1)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {title}
      </span>
    </div>
    <div style={{ padding: '20px' }}>{children}</div>
  </div>
);

const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label
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
    {children}
    {hint && (
      <p style={{ fontSize: 11.5, color: 'var(--text-4)', marginTop: 4 }}>{hint}</p>
    )}
  </div>
);

const inputSt = {
  width: '100%',
  padding: '9px 13px',
  borderRadius: 9,
  border: '1.5px solid var(--border)',
  fontSize: 14,
  color: 'var(--text-1)',
  outline: 'none',
  background: 'var(--surface)',
  fontFamily: "'Inter', sans-serif",
  transition: 'border-color .15s',
};

const Toggle = ({ checked, onChange, label }) => (
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      padding: '10px 0',
      borderBottom: '1px solid var(--border)',
    }}
  >
    <span style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{label}</span>
    <div
      onClick={onChange}
      style={{
        width: 40,
        height: 22,
        borderRadius: 99,
        background: checked ? 'var(--primary)' : 'var(--border-2)',
        position: 'relative',
        transition: 'background .2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
          transition: 'left .2s',
        }}
      />
    </div>
  </label>
);

export function SettingsPage() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name:     user?.name     || '',
    email:    user?.email    || '',
    role:     user?.role     || '',
    position: user?.position || '',
    phone:    user?.phone    || '',
  });

  const [notifications, setNotifications] = useState({
    vencidos: true,
    porVencer: true,
    nuevos: false,
    email: true,
  });

  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser({ name: profile.name, position: profile.position, phone: profile.phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: 720 }}>

      {/* Perfil de usuario */}
      <Section title="Perfil de Usuario" icon={User}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'center' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dk) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(37,99,235,.3)',
            }}
          >
            {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {profile.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>
              {profile.role} · {profile.email}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Nombre completo">
            <input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              style={inputSt}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </Field>
          <Field label="Correo electrónico">
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              style={inputSt}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </Field>
          <Field label="Cargo / Rol">
            <input
              value={profile.role}
              onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
              style={inputSt}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </Field>
          <Field label="Teléfono">
            <input
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              style={inputSt}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </Field>
        </div>
      </Section>

      {/* Seguridad */}
      <Section title="Seguridad" icon={Shield}>
        <Field label="Contraseña actual" hint="Mínimo 8 caracteres">
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              style={{ ...inputSt, paddingRight: 40 }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-4)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Nueva contraseña">
            <input
              type="password"
              placeholder="••••••••"
              style={inputSt}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </Field>
          <Field label="Confirmar contraseña">
            <input
              type="password"
              placeholder="••••••••"
              style={inputSt}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </Field>
        </div>
      </Section>

      {/* Notificaciones */}
      <Section title="Notificaciones" icon={Bell}>
        <Toggle
          label="Alertar cuando un documento esté vencido"
          checked={notifications.vencidos}
          onChange={() => setNotifications((n) => ({ ...n, vencidos: !n.vencidos }))}
        />
        <Toggle
          label="Alertar cuando un documento esté por vencer (≤ 3 días)"
          checked={notifications.porVencer}
          onChange={() => setNotifications((n) => ({ ...n, porVencer: !n.porVencer }))}
        />
        <Toggle
          label="Notificar al radicar nuevos documentos"
          checked={notifications.nuevos}
          onChange={() => setNotifications((n) => ({ ...n, nuevos: !n.nuevos }))}
        />
        <Toggle
          label="Recibir resumen diario por correo"
          checked={notifications.email}
          onChange={() => setNotifications((n) => ({ ...n, email: !n.email }))}
        />
      </Section>

      {/* Apariencia */}
      <Section title="Apariencia" icon={Palette}>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>
          Personaliza la apariencia del sistema.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Claro', 'Oscuro', 'Sistema'].map((t) => (
            <button
              key={t}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: t === 'Claro' ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                background: t === 'Claro' ? 'var(--primary-bg)' : 'var(--surface)',
                color: t === 'Claro' ? 'var(--primary)' : 'var(--text-3)',
                fontSize: 13,
                fontWeight: t === 'Claro' ? 600 : 400,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </Section>

      {/* Guardar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        {saved && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'var(--success)',
              fontWeight: 600,
              animation: 'fadeIn .2s ease',
            }}
          >
            ✓ Cambios guardados
          </span>
        )}
        <Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}

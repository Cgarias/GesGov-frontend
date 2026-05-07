import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Send } from 'lucide-react';
import { Button } from '../common';
import { formatFileSize, getTodayISO } from '../../utils/dateUtils';

const inputStyle = {
  width: '100%',
  padding: '9px 13px',
  borderRadius: 9,
  border: '1.5px solid var(--border)',
  fontSize: 14,
  color: 'var(--text-1)',
  outline: 'none',
  background: 'var(--surface)',
  transition: 'border-color .15s',
  fontFamily: "'Inter', sans-serif",
};

const FieldGroup = ({ label, children, required, hint }) => (
  <div style={{ marginBottom: 18 }}>
    <label
      style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--text-2)',
        marginBottom: 6,
        letterSpacing: '-.01em',
      }}
    >
      {label}
      {required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
    </label>
    {children}
    {hint && (
      <p style={{ fontSize: 11.5, color: 'var(--text-4)', marginTop: 4 }}>{hint}</p>
    )}
  </div>
);

export function UploadForm({ onSubmit, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    responseDeadline: '',
    description: '',
    notes: '',
  });
  const [file, setFile]           = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const fileRef = useRef();

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('El archivo no puede superar 10 MB');
      return;
    }
    setFile(selectedFile);
  };

  const handleFileChange = (e) => handleFileSelect(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !file) {
      alert('Por favor completa el Título y selecciona un Archivo');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ ...form, file });
      setForm({ title: '', responseDeadline: '', description: '', notes: '' });
      setFile(null);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onSuccess?.(); }, 2500);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        err.message ||
        'Error desconocido';
      alert('Error al radicar: ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Pantalla de éxito ── */
  if (success) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 420,
          animation: 'scaleIn .35s ease',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--success-bg)',
            border: '2px solid var(--success-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success)',
            marginBottom: 4,
          }}
        >
          <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        <h3 style={{ fontSize: 18, color: 'var(--text-1)' }}>
          Documento radicado exitosamente
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
          El sistema ha registrado el documento. Redirigiendo...
        </p>
      </div>
    );
  }

  const isValid = form.title.trim() && file;

  return (
    <div style={{ padding: '24px 28px', maxWidth: 780 }}>
      {/* Encabezado de sección — sin duplicar el título del Topbar */}
      <div
        style={{
          marginBottom: 22,
          paddingBottom: 18,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
          Complete los campos obligatorios (<span style={{ color: 'var(--danger)' }}>*</span>) para
          registrar el documento en el sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 26px',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeUp .35s ease both',
          }}
        >
          {/* Título */}
          <FieldGroup label="Título del documento" required hint="Mínimo 3 caracteres, máximo 150">
            <input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Nombre o asunto del documento"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </FieldGroup>

          {/* Fecha límite — ARRIBA de descripción */}
          <FieldGroup label="Fecha límite de respuesta">
            <input
              type="date"
              min={getTodayISO()}
              value={form.responseDeadline}
              onChange={(e) => handleChange('responseDeadline', e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </FieldGroup>

          {/* Descripción */}
          <FieldGroup label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Descripción breve del contenido del documento"
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </FieldGroup>

          {/* Notas */}
          <FieldGroup label="Notas internas">
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
              placeholder="Observaciones o instrucciones adicionales..."
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--border)')}
            />
          </FieldGroup>

          {/* Zona de archivo */}
          <FieldGroup label="Archivo adjunto" required>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? 'var(--primary)' : file ? 'var(--success)' : 'var(--border-2)'}`,
                borderRadius: 10,
                padding: '28px 20px',
                textAlign: 'center',
                background: dragOver
                  ? 'var(--primary-bg)'
                  : file
                  ? 'var(--success-bg)'
                  : 'var(--surface-2)',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 9,
                      background: 'var(--success-bg)',
                      border: '1px solid var(--success-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--success)',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    style={{
                      marginLeft: 8,
                      background: 'var(--danger-bg)',
                      color: '#DC2626',
                      border: '1px solid var(--danger-border)',
                      padding: '4px 10px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <X size={12} /> Quitar
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'var(--surface-3)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-4)',
                      margin: '0 auto 12px',
                    }}
                  >
                    <UploadCloud size={22} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)' }}>
                    Arrastra el archivo aquí o haz clic para seleccionar
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 6 }}>
                    PDF, Word, Excel, PNG, JPG — Máx. 10 MB
                  </div>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </FieldGroup>

          {/* Botón submit */}
          <div style={{ marginTop: 8 }}>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || !isValid}
              icon={<Send size={15} />}
              style={{ width: '100%', justifyContent: 'center', padding: '11px 20px' }}
            >
              {submitting ? 'Radicando...' : 'Radicar Documento'}
            </Button>
            {!isValid && (
              <p style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 8, textAlign: 'center' }}>
                Completa el título y selecciona un archivo para continuar
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

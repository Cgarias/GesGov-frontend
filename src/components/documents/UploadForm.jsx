import { useState, useRef } from 'react';
import { Card, Button, Icons } from '../common';
import { DebugPanel } from '../common/DebugPanel';
import { formatFileSize, getTodayISO } from '../../utils/dateUtils';
import { DEPENDENCIAS } from '../../constants/documentStatus';

/**
 * Componente para agrupar campos del formulario
 */
const FieldGroup = ({ label, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label
      style={{
        display: 'block',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--gray-600)',
        marginBottom: 6,
      }}
    >
      {label} {required && <span style={{ color: '#B91C1C' }}>*</span>}
    </label>
    {children}
  </div>
);

/**
 * Formulario para radicar nuevos documentos
 */
export function UploadForm({ onSubmit, onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    responseDeadline: '',
    notes: '',
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar tamaño (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert('El archivo no puede superar 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !file) {
      alert('Por favor completa los campos obligatorios: Título y Archivo');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        file,
      };
      
      const result = await onSubmit(payload);
      
      // Reset form
      setForm({
        title: '',
        description: '',
        responseDeadline: '',
        notes: '',
      });
      setFile(null);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 2500);
    } catch (error) {
      console.error('Error creating document:', error);
      
      let errorMessage = 'Error desconocido';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert('Error al crear el documento: ' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 400,
          animation: 'scaleIn .4s ease',
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
        <h3 style={{ color: 'var(--navy)', marginBottom: 8 }}>
          Documento radicado exitosamente
        </h3>
        <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>
          El sistema ha registrado el documento correctamente.
        </p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1.5px solid var(--gray-200)',
    fontSize: 14,
    color: 'var(--gray-700)',
    outline: 'none',
    background: '#fff',
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 860 }}>
      {/* Debug Panel - solo en desarrollo */}
      <DebugPanel form={form} file={file} submitting={submitting} />
      
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, marginBottom: 4 }}>Radicar Nuevo Documento</h2>
        <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>
          Complete todos los campos obligatorios (*) para registrar el documento en el sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card style={{ padding: '24px' }} animate>
          <FieldGroup label="Título" required>
            <input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Nombre o asunto del documento"
              style={inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              placeholder="Descripción breve del contenido"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </FieldGroup>

          <FieldGroup label="Fecha límite de respuesta">
            <input
              type="date"
              min={getTodayISO()}
              value={form.responseDeadline}
              onChange={(e) => handleChange('responseDeadline', e.target.value)}
              style={inputStyle}
            />
          </FieldGroup>

          <FieldGroup label="Notas internas">
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
              placeholder="Observaciones o instrucciones adicionales..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </FieldGroup>

          <FieldGroup label="Archivo" required>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${file ? 'var(--gold)' : 'var(--gray-300)'}`,
                borderRadius: 10,
                padding: '36px 20px',
                textAlign: 'center',
                background: file ? '#FFFBEB' : 'var(--gray-50)',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              {file ? (
                <>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📎</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                    {formatFileSize(file.size)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    style={{
                      marginTop: 10,
                      background: '#FEF2F2',
                      color: '#B91C1C',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    Quitar archivo
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 40, marginBottom: 10, color: 'var(--gray-300)' }}>
                    ☁
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--gray-500)', fontWeight: 600 }}>
                    Arrastre el archivo aquí o haga clic
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-300)', marginTop: 8 }}>
                    PDF, Word, Excel, PNG, JPG — Máx. 10MB
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

          <Button
            type="submit"
            variant="gold"
            disabled={submitting || !form.title || !file}
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            icon={<Icons.Upload />}
          >
            {submitting ? 'Radicando...' : 'Radicar Documento'}
          </Button>

          {(!form.title || !file) && (
            <p
              style={{
                fontSize: 11,
                color: 'var(--gray-400)',
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Complete los campos obligatorios para continuar
            </p>
          )}
        </Card>
      </form>
    </div>
  );
}

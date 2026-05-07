import { useState, useEffect } from 'react';

/**
 * Panel de depuración para mostrar el estado en tiempo real
 * Solo se muestra en desarrollo
 */
export function DebugPanel({ form, file, submitting }) {
  const [visible, setVisible] = useState(false);

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <>
      {/* Botón flotante para mostrar/ocultar */}
      <button
        onClick={() => setVisible(!visible)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: '#1E3A5F',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
        }}
        title="Toggle Debug Panel"
      >
        🐛
      </button>

      {/* Panel de depuración */}
      {visible && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 400,
            maxHeight: 600,
            background: 'white',
            border: '2px solid #1E3A5F',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 9998,
            overflow: 'hidden',
            fontFamily: 'monospace',
            fontSize: 12,
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#1E3A5F',
              color: 'white',
              padding: '12px 16px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>🐛 Debug Panel</span>
            <button
              onClick={() => setVisible(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              padding: 16,
              maxHeight: 500,
              overflowY: 'auto',
            }}
          >
            {/* Form State */}
            <Section title="📝 Form State">
              <KeyValue label="Title" value={form?.title || '(empty)'} />
              <KeyValue label="Description" value={form?.description || '(empty)'} />
              <KeyValue
                label="Response Deadline"
                value={form?.responseDeadline || '(empty)'}
              />
              <KeyValue label="Notes" value={form?.notes || '(empty)'} />
            </Section>

            {/* File State */}
            <Section title="📎 File State">
              {file ? (
                <>
                  <KeyValue label="Name" value={file.name} />
                  <KeyValue label="Size" value={formatBytes(file.size)} />
                  <KeyValue label="Type" value={file.type} />
                </>
              ) : (
                <div style={{ color: '#999', fontStyle: 'italic' }}>No file selected</div>
              )}
            </Section>

            {/* Validation State */}
            <Section title="✅ Validation">
              <KeyValue
                label="Title Valid"
                value={form?.title ? '✅ Yes' : '❌ No'}
                color={form?.title ? 'green' : 'red'}
              />
              <KeyValue
                label="File Valid"
                value={file ? '✅ Yes' : '❌ No'}
                color={file ? 'green' : 'red'}
              />
              <KeyValue
                label="Form Valid"
                value={form?.title && file ? '✅ Yes' : '❌ No'}
                color={form?.title && file ? 'green' : 'red'}
              />
            </Section>

            {/* Submit State */}
            <Section title="🚀 Submit State">
              <KeyValue
                label="Submitting"
                value={submitting ? '⏳ Yes' : '✅ No'}
                color={submitting ? 'orange' : 'green'}
              />
              <KeyValue
                label="Button Disabled"
                value={submitting || !form?.title || !file ? '🔒 Yes' : '✅ No'}
                color={submitting || !form?.title || !file ? 'red' : 'green'}
              />
            </Section>

            {/* Environment */}
            <Section title="🌍 Environment">
              <KeyValue label="API URL" value={import.meta.env.VITE_API_URL} />
              <KeyValue label="Mode" value={import.meta.env.MODE} />
            </Section>

            {/* Instructions */}
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: '#FFF9E6',
                border: '1px solid #FFE066',
                borderRadius: 8,
                fontSize: 11,
              }}
            >
              <strong>💡 Tip:</strong> Open the browser console (F12) to see detailed logs
              when you submit the form.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
          color: '#1E3A5F',
          fontSize: 13,
        }}
      >
        {title}
      </div>
      <div
        style={{
          background: '#F9FAFB',
          padding: 12,
          borderRadius: 6,
          border: '1px solid #E5E7EB',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function KeyValue({ label, value, color }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6,
        fontSize: 11,
      }}
    >
      <span style={{ color: '#6B7280' }}>{label}:</span>
      <span style={{ fontWeight: 'bold', color: color || '#111' }}>{value}</span>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

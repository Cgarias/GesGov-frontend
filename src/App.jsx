import { useState, useEffect } from 'react';
import { Sidebar, Topbar } from './components/layout';
import {
  Dashboard,
  DocumentsList,
  UploadForm,
  DocumentDetailModal,
} from './components/documents';
import { Card } from './components/common';
import { useDocuments } from './hooks/useDocuments';
import { injectGlobalStyles } from './styles/globalStyles';

const PAGE_META = {
  dashboard: {
    title: 'Panel Principal',
    subtitle: 'Resumen ejecutivo del sistema de gestión documental',
  },
  documents: {
    title: 'Gestión de Documentos',
    subtitle: 'Consulta y administra todos los documentos radicados',
  },
  upload: {
    title: 'Radicar Documento',
    subtitle: 'Registro de nuevos documentos al sistema',
  },
  reports: {
    title: 'Reportes',
    subtitle: 'Indicadores y estadísticas de gestión',
  },
  settings: {
    title: 'Configuración',
    subtitle: 'Administración del sistema',
  },
};

/**
 * Componente principal de la aplicación
 */
export default function App() {
  const [page, setPage] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Hook personalizado para gestionar documentos
  const {
    documents,
    stats,
    loading,
    error,
    fetchAll,
    createDocument,
    markAsResponded,
    removeDocument,
  } = useDocuments();

  // Inyectar estilos globales
  useEffect(() => {
    return injectGlobalStyles();
  }, []);

  const meta = PAGE_META[page] || PAGE_META.dashboard;

  const handleCreateDocument = async (payload) => {
    await createDocument(payload);
  };

  const handleUploadSuccess = () => {
    setPage('documents');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Sidebar
        active={page}
        onNav={setPage}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        stats={stats}
      />

      {/* Contenido principal */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Topbar */}
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onNew={page !== 'upload' ? () => setPage('upload') : null}
          stats={stats}
        />

        {/* Contenido */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--gray-50)' }}>
          {page === 'dashboard' && (
            <Dashboard
              stats={stats}
              loading={loading}
              error={error}
              onNav={setPage}
              onRetry={fetchAll}
            />
          )}

          {page === 'documents' && (
            <DocumentsList
              documents={documents}
              loading={loading}
              error={error}
              onViewDetail={setSelectedDocument}
              onRetry={fetchAll}
            />
          )}

          {page === 'upload' && (
            <UploadForm
              onSubmit={handleCreateDocument}
              onSuccess={handleUploadSuccess}
            />
          )}

          {page === 'reports' && (
            <div style={{ padding: '28px 32px' }}>
              <Card style={{ padding: '40px', textAlign: 'center' }} animate>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <h3 style={{ marginBottom: 8 }}>Reportes</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>
                  Sección en desarrollo. Aquí se mostrarán estadísticas e indicadores.
                </p>
              </Card>
            </div>
          )}

          {page === 'settings' && (
            <div style={{ padding: '28px 32px' }}>
              <Card style={{ padding: '40px', textAlign: 'center' }} animate>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
                <h3 style={{ marginBottom: 8 }}>Configuración del Sistema</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>
                  Esta sección está en desarrollo.
                </p>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Modal de detalle */}
      {selectedDocument && (
        <DocumentDetailModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onMarkResponded={markAsResponded}
          onDelete={removeDocument}
        />
      )}
    </div>
  );
}

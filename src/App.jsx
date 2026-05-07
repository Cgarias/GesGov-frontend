import { useState, useEffect } from 'react';
import { Sidebar, Topbar } from './components/layout';
import {
  Dashboard,
  DocumentsList,
  UploadForm,
  DocumentDetailModal,
  SettingsPage,
} from './components/documents';
import { LoginPage }    from './components/auth/LoginPage';
import { useDocuments } from './hooks/useDocuments';
import { useAuth }      from './context/AuthContext';
import { injectGlobalStyles } from './styles/globalStyles';

const PAGE_META = {
  dashboard: { title: 'Panel Principal',       subtitle: 'Resumen ejecutivo del sistema de gestión documental' },
  documents: { title: 'Gestión de Documentos', subtitle: 'Consulta y administra todos los documentos radicados' },
  upload:    { title: 'Radicar Documento',      subtitle: 'Registro de nuevos documentos al sistema' },
  settings:  { title: 'Configuración',          subtitle: 'Ajustes de usuario y preferencias del sistema' },
};

// ── Vista principal (solo se monta cuando hay sesión activa) ─────────────────
// Al estar en un componente separado, useDocuments solo corre cuando el usuario
// ya está autenticado y el token está en localStorage.
function AuthenticatedApp() {
  const [page, setPage]                         = useState('dashboard');
  const [collapsed, setCollapsed]               = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const {
    documents, stats, loading, error,
    fetchAll, createDocument, markAsResponded, removeDocument,
  } = useDocuments();

  const meta = PAGE_META[page] || PAGE_META.dashboard;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        active={page}
        onNav={setPage}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        stats={stats}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onNew={page !== 'upload' ? () => setPage('upload') : null}
          stats={stats}
        />

        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--surface-2)' }}>
          {page === 'dashboard' && (
            <Dashboard stats={stats} loading={loading} error={error} onNav={setPage} onRetry={fetchAll} />
          )}
          {page === 'documents' && (
            <DocumentsList
              documents={documents} loading={loading} error={error}
              onViewDetail={setSelectedDocument} onRetry={fetchAll}
            />
          )}
          {page === 'upload' && (
            <UploadForm onSubmit={createDocument} onSuccess={() => setPage('documents')} />
          )}
          {page === 'settings' && <SettingsPage />}
        </main>
      </div>

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

// ── Raíz de la aplicación ────────────────────────────────────────────────────
export default function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    return injectGlobalStyles();
  }, []);

  // Si no hay sesión → pantalla de login (useDocuments NO se monta)
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Sesión activa → app completa con datos
  return <AuthenticatedApp />;
}

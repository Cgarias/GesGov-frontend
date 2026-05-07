import { useState, useEffect, useCallback } from 'react';
import { documentsApi } from '../api/documents.api';

/**
 * Hook personalizado para gestionar documentos
 * Maneja el estado, carga de datos y operaciones CRUD
 */
export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cargar todos los documentos y estadísticas
   */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [docsData, statsData] = await Promise.all([
        documentsApi.getAll(),
        documentsApi.getStats(),
      ]);
      
      setDocuments(docsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Error al cargar documentos');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear un nuevo documento
   */
  const createDocument = useCallback(async (payload) => {
    try {
      const newDoc = await documentsApi.create(payload);
      setDocuments((prev) => [newDoc, ...prev]);
      await fetchAll(); // Recargar para actualizar stats
      return newDoc;
    } catch (err) {
      console.error('Error creating document:', err);
      throw err;
    }
  }, [fetchAll]);

  /**
   * Actualizar un documento
   */
  const updateDocument = useCallback(async (id, payload) => {
    try {
      const updated = await documentsApi.update(id, payload);
      setDocuments((prev) =>
        prev.map((doc) => (doc._id === id ? updated : doc))
      );
      return updated;
    } catch (err) {
      console.error('Error updating document:', err);
      throw err;
    }
  }, []);

  /**
   * Marcar documento como respondido
   */
  const markAsResponded = useCallback(async (id) => {
    try {
      const updated = await documentsApi.markAsResponded(id);
      setDocuments((prev) =>
        prev.map((doc) => (doc._id === id ? updated : doc))
      );
      await fetchAll(); // Recargar stats
      return updated;
    } catch (err) {
      console.error('Error marking as responded:', err);
      throw err;
    }
  }, [fetchAll]);

  /**
   * Eliminar un documento
   */
  const removeDocument = useCallback(async (id) => {
    try {
      await documentsApi.remove(id);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      await fetchAll(); // Recargar stats
    } catch (err) {
      console.error('Error removing document:', err);
      throw err;
    }
  }, [fetchAll]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    documents,
    stats,
    loading,
    error,
    fetchAll,
    createDocument,
    updateDocument,
    markAsResponded,
    removeDocument,
  };
}

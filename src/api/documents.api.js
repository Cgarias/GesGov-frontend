import api from './axios.config';

export const documentsApi = {
  /**
   * Obtener todos los documentos
   */
  getAll: async () => {
    const { data } = await api.get('/documents');
    return data;
  },

  /**
   * Obtener un documento por ID
   */
  getById: async (id) => {
    const { data } = await api.get(`/documents/${id}`);
    return data;
  },

  /**
   * Obtener estadísticas de documentos
   */
  getStats: async () => {
    const { data } = await api.get('/documents/stats');
    return data;
  },

  /**
   * Crear un nuevo documento con archivo
   */
  create: async (payload) => {
    const formData = new FormData();
    
    formData.append('file', payload.file);
    formData.append('title', payload.title);
    
    if (payload.description) {
      formData.append('description', payload.description);
    }
    
    if (payload.responseDeadline) {
      formData.append('responseDeadline', payload.responseDeadline);
    }
    
    if (payload.notes) {
      formData.append('notes', payload.notes);
    }

    const { data } = await api.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },

  /**
   * Actualizar un documento
   */
  update: async (id, payload) => {
    const { data } = await api.patch(`/documents/${id}`, payload);
    return data;
  },

  /**
   * Marcar documento como respondido
   */
  markAsResponded: async (id) => {
    const { data } = await api.patch(`/documents/${id}`, {
      status: 'RESPONDIDO',
    });
    return data;
  },

  /**
   * Eliminar un documento
   */
  remove: async (id) => {
    await api.delete(`/documents/${id}`);
  },
};

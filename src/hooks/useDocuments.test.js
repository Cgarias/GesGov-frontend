import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDocuments } from './useDocuments';
import { documentsApi } from '../api/documents.api';

vi.mock('../api/documents.api');

describe('useDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('initial state and fetchAll', () => {
    it('should initialize with loading state', () => {
      documentsApi.getAll.mockResolvedValue([]);
      documentsApi.getStats.mockResolvedValue({});

      const { result } = renderHook(() => useDocuments());

      expect(result.current.documents).toEqual([]);
      expect(result.current.stats).toEqual({});
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should fetch documents and stats on mount', async () => {
      const mockDocs = [
        { _id: '1', title: 'Doc 1' },
        { _id: '2', title: 'Doc 2' },
      ];
      const mockStats = { PENDIENTE: 2 };

      documentsApi.getAll.mockResolvedValue(mockDocs);
      documentsApi.getStats.mockResolvedValue(mockStats);

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.documents).toEqual(mockDocs);
      expect(result.current.stats).toEqual(mockStats);
      expect(documentsApi.getAll).toHaveBeenCalled();
      expect(documentsApi.getStats).toHaveBeenCalled();
    });

    it('should handle fetch error (non-401)', async () => {
      const mockError = new Error('Network error');
      documentsApi.getAll.mockRejectedValue(mockError);
      documentsApi.getStats.mockRejectedValue(mockError);

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.documents).toEqual([]);
    });

    it('should not set error for 401 status (handled by interceptor)', async () => {
      const mockError = { response: { status: 401 }, message: 'Unauthorized' };
      documentsApi.getAll.mockRejectedValue(mockError);
      documentsApi.getStats.mockRejectedValue(mockError);

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeNull();
    });

    it('should handle error without message', async () => {
      const mockError = {};
      documentsApi.getAll.mockRejectedValue(mockError);
      documentsApi.getStats.mockRejectedValue(mockError);

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Error al cargar documentos');
    });
  });

  describe('createDocument', () => {
    it('should create a new document and refetch', async () => {
      const existingDocs = [{ _id: '1', title: 'Existing Doc' }];
      const newDoc = { _id: '2', title: 'New Doc' };
      const payload = { title: 'New Doc', file: new File([''], 'test.pdf') };
      const updatedStats = { PENDIENTE: 2 };

      // Initial load
      documentsApi.getAll.mockResolvedValueOnce(existingDocs);
      documentsApi.getStats.mockResolvedValueOnce({});

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // After create, fetchAll is called
      documentsApi.create.mockResolvedValue(newDoc);
      documentsApi.getAll.mockResolvedValue([newDoc, ...existingDocs]);
      documentsApi.getStats.mockResolvedValue(updatedStats);

      const createdDoc = await result.current.createDocument(payload);

      expect(createdDoc).toEqual(newDoc);
      expect(documentsApi.create).toHaveBeenCalledWith(payload);

      await waitFor(() => {
        expect(result.current.documents).toContainEqual(newDoc);
      });
    });

    it('should throw error when create fails', async () => {
      documentsApi.getAll.mockResolvedValue([]);
      documentsApi.getStats.mockResolvedValue({});
      documentsApi.create.mockRejectedValue(new Error('Create failed'));

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(result.current.createDocument({})).rejects.toThrow('Create failed');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateDocument', () => {
    it('should update an existing document in state', async () => {
      const docs = [
        { _id: '1', title: 'Doc 1' },
        { _id: '2', title: 'Doc 2' },
      ];
      const updatedDoc = { _id: '1', title: 'Updated Doc 1' };

      documentsApi.getAll.mockResolvedValue(docs);
      documentsApi.getStats.mockResolvedValue({});
      documentsApi.update.mockResolvedValue(updatedDoc);

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const updated = await result.current.updateDocument('1', { title: 'Updated Doc 1' });

      expect(updated).toEqual(updatedDoc);
      expect(documentsApi.update).toHaveBeenCalledWith('1', { title: 'Updated Doc 1' });

      await waitFor(() => {
        expect(result.current.documents.find((d) => d._id === '1').title).toBe('Updated Doc 1');
      });
    });

    it('should throw error when update fails', async () => {
      documentsApi.getAll.mockResolvedValue([]);
      documentsApi.getStats.mockResolvedValue({});
      documentsApi.update.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(result.current.updateDocument('1', {})).rejects.toThrow('Update failed');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('markAsResponded', () => {
    it('should mark document as responded and refetch', async () => {
      const docs = [{ _id: '1', title: 'Doc 1', status: 'PENDIENTE' }];
      const respondedDoc = { _id: '1', title: 'Doc 1', status: 'RESPONDIDO' };
      const updatedStats = { RESPONDIDO: 1 };

      // Initial fetch
      documentsApi.getAll.mockResolvedValueOnce(docs);
      documentsApi.getStats.mockResolvedValueOnce({});

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // markAsResponded calls fetchAll afterwards
      documentsApi.markAsResponded.mockResolvedValue(respondedDoc);
      documentsApi.getAll.mockResolvedValue([respondedDoc]);
      documentsApi.getStats.mockResolvedValue(updatedStats);

      const updated = await result.current.markAsResponded('1');

      expect(updated).toEqual(respondedDoc);
      expect(documentsApi.markAsResponded).toHaveBeenCalledWith('1');

      // After fetchAll completes, documents should reflect the API response
      await waitFor(() => {
        expect(result.current.documents.find((d) => d._id === '1').status).toBe('RESPONDIDO');
      });
    });

    it('should throw error when mark as responded fails', async () => {
      documentsApi.getAll.mockResolvedValue([]);
      documentsApi.getStats.mockResolvedValue({});
      documentsApi.markAsResponded.mockRejectedValue(new Error('Mark failed'));

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(result.current.markAsResponded('1')).rejects.toThrow('Mark failed');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('removeDocument', () => {
    it('should remove a document and refetch', async () => {
      const docs = [
        { _id: '1', title: 'Doc 1' },
        { _id: '2', title: 'Doc 2' },
      ];

      // Initial fetch
      documentsApi.getAll.mockResolvedValueOnce(docs);
      documentsApi.getStats.mockResolvedValueOnce({});

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.documents).toHaveLength(2);

      // removeDocument calls fetchAll afterwards → API returns only doc 2
      documentsApi.remove.mockResolvedValue(undefined);
      documentsApi.getAll.mockResolvedValue([{ _id: '2', title: 'Doc 2' }]);
      documentsApi.getStats.mockResolvedValue({});

      await result.current.removeDocument('1');

      expect(documentsApi.remove).toHaveBeenCalledWith('1');

      await waitFor(() => {
        expect(result.current.documents.find((d) => d._id === '1')).toBeUndefined();
      });
    });

    it('should throw error when remove fails', async () => {
      documentsApi.getAll.mockResolvedValue([]);
      documentsApi.getStats.mockResolvedValue({});
      documentsApi.remove.mockRejectedValue(new Error('Remove failed'));

      const { result } = renderHook(() => useDocuments());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(result.current.removeDocument('1')).rejects.toThrow('Remove failed');
      expect(console.error).toHaveBeenCalled();
    });
  });
});

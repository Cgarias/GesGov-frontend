import { describe, it, expect, vi, beforeEach } from 'vitest';
import { documentsApi } from './documents.api';
import api from './axios.config';

vi.mock('./axios.config', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('documentsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all documents', async () => {
      const mockDocuments = {
        data: [
          { id: '1', title: 'Doc 1' },
          { id: '2', title: 'Doc 2' },
        ],
      };

      api.get.mockResolvedValue(mockDocuments);

      const result = await documentsApi.getAll();

      expect(api.get).toHaveBeenCalledWith('/documents');
      expect(result).toEqual(mockDocuments.data);
    });

    it('should handle error when fetching documents', async () => {
      api.get.mockRejectedValue(new Error('Network error'));

      await expect(documentsApi.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('should fetch document by ID', async () => {
      const mockDocument = {
        data: { id: '123', title: 'Test Doc' },
      };

      api.get.mockResolvedValue(mockDocument);

      const result = await documentsApi.getById('123');

      expect(api.get).toHaveBeenCalledWith('/documents/123');
      expect(result).toEqual(mockDocument.data);
    });

    it('should handle not found error', async () => {
      api.get.mockRejectedValue(new Error('Document not found'));

      await expect(documentsApi.getById('999')).rejects.toThrow('Document not found');
    });
  });

  describe('getStats', () => {
    it('should fetch document statistics', async () => {
      const mockStats = {
        data: {
          PENDIENTE: 5,
          EN_PROCESO: 3,
          RESPONDIDO: 2,
        },
      };

      api.get.mockResolvedValue(mockStats);

      const result = await documentsApi.getStats();

      expect(api.get).toHaveBeenCalledWith('/documents/stats');
      expect(result).toEqual(mockStats.data);
    });
  });

  describe('create', () => {
    it('should create document with all fields', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const payload = {
        file: mockFile,
        title: 'New Document',
        description: 'Test description',
        responseDeadline: '2026-12-31',
        notes: 'Test notes',
      };

      const mockResponse = {
        data: { id: '456', ...payload },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await documentsApi.create(payload);

      expect(api.post).toHaveBeenCalledWith(
        '/documents',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should create document with only required fields', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const payload = {
        file: mockFile,
        title: 'Minimal Document',
      };

      const mockResponse = {
        data: { id: '789', title: payload.title },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await documentsApi.create(payload);

      expect(api.post).toHaveBeenCalled();
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle upload error', async () => {
      const mockFile = new File(['content'], 'test.pdf');
      const payload = { file: mockFile, title: 'Test' };

      api.post.mockRejectedValue(new Error('Upload failed'));

      await expect(documentsApi.create(payload)).rejects.toThrow('Upload failed');
    });
  });

  describe('update', () => {
    it('should update document with payload', async () => {
      const updatePayload = {
        title: 'Updated Title',
        description: 'Updated description',
      };

      const mockResponse = {
        data: { id: '123', ...updatePayload },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await documentsApi.update('123', updatePayload);

      expect(api.patch).toHaveBeenCalledWith('/documents/123', updatePayload);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle update error', async () => {
      api.patch.mockRejectedValue(new Error('Update failed'));

      await expect(documentsApi.update('123', {})).rejects.toThrow('Update failed');
    });
  });

  describe('markAsResponded', () => {
    it('should mark document as responded', async () => {
      const mockResponse = {
        data: { id: '123', status: 'RESPONDIDO' },
      };

      api.patch.mockResolvedValue(mockResponse);

      const result = await documentsApi.markAsResponded('123');

      expect(api.patch).toHaveBeenCalledWith('/documents/123', {
        status: 'RESPONDIDO',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('remove', () => {
    it('should delete document by ID', async () => {
      api.delete.mockResolvedValue({});

      await documentsApi.remove('123');

      expect(api.delete).toHaveBeenCalledWith('/documents/123');
    });

    it('should handle delete error', async () => {
      api.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(documentsApi.remove('123')).rejects.toThrow('Delete failed');
    });
  });
});

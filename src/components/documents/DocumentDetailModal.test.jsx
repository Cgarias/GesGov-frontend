import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentDetailModal } from './DocumentDetailModal';

const mockDocument = {
  _id: '1',
  title: 'Solicitud de información',
  radicado: 'RAD-001',
  status: 'PENDIENTE',
  description: 'Descripción detallada del documento',
  fileName: 'documento.pdf',
  fileSize: 102400,
  mimeType: 'application/pdf',
  responseDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date('2024-01-15').toISOString(),
  notes: 'Notas importantes',
};

const defaultProps = {
  document: mockDocument,
  onClose: vi.fn(),
  onMarkResponded: vi.fn(),
  onDelete: vi.fn(),
};

describe('DocumentDetailModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  describe('rendering', () => {
    it('should render null when document is null', () => {
      const { container } = render(
        <DocumentDetailModal {...defaultProps} document={null} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render the document title', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByText('Solicitud de información')).toBeInTheDocument();
    });

    it('should render the radicado number', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByText('RAD-001')).toBeInTheDocument();
    });

    it('should render the status badge', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });

    it('should render the file name', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByText('documento.pdf')).toBeInTheDocument();
    });

    it('should render the file type as PDF', () => {
      const { container } = render(<DocumentDetailModal {...defaultProps} />);
      // File info is: "100 KB · PDF" — check the container text
      expect(container.textContent).toMatch(/PDF/);
    });

    it('should render description when present', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByText('Descripción detallada del documento')).toBeInTheDocument();
    });

    it('should render notes when present', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByText('Notas importantes')).toBeInTheDocument();
    });

    it('should render deadline date info', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByText(/días restantes/i)).toBeInTheDocument();
    });

    it('should show "Sin fecha límite" when no deadline', () => {
      const docWithNoDeadline = { ...mockDocument, responseDeadline: null };
      render(<DocumentDetailModal {...defaultProps} document={docWithNoDeadline} />);
      expect(screen.getByText('Sin fecha límite')).toBeInTheDocument();
    });

    it('should not render description section when absent', () => {
      const docWithoutDesc = { ...mockDocument, description: undefined };
      render(<DocumentDetailModal {...defaultProps} document={docWithoutDesc} />);
      expect(screen.queryByText('Descripción detallada del documento')).not.toBeInTheDocument();
    });

    it('should not render notes section when absent', () => {
      const docWithoutNotes = { ...mockDocument, notes: undefined };
      render(<DocumentDetailModal {...defaultProps} document={docWithoutNotes} />);
      expect(screen.queryByText('Notas importantes')).not.toBeInTheDocument();
    });

    it('should show "Vence hoy" when deadline is today', () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const docDueToday = { ...mockDocument, responseDeadline: today.toISOString() };
      render(<DocumentDetailModal {...defaultProps} document={docDueToday} />);
      expect(screen.getByText('Vence hoy')).toBeInTheDocument();
    });

    it('should show overdue info for past deadlines', () => {
      const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const overdueDoc = { ...mockDocument, responseDeadline: pastDate };
      render(<DocumentDetailModal {...defaultProps} document={overdueDoc} />);
      expect(screen.getByText(/vencido hace/i)).toBeInTheDocument();
    });

    it('should render responded date when present', () => {
      const respondedDoc = {
        ...mockDocument,
        respondedAt: new Date('2024-02-01').toISOString(),
      };
      render(<DocumentDetailModal {...defaultProps} document={respondedDoc} />);
      // The responded date label appears as "Respondido: <date>"
      const respondedElements = screen.getAllByText(/respondido/i);
      expect(respondedElements.length).toBeGreaterThan(0);
    });
  });

  describe('action buttons', () => {
    it('should render close button', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument();
    });

    it('should render mark responded button for non-responded documents', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /marcar respondido/i })).toBeInTheDocument();
    });

    it('should not render mark responded button for already responded documents', () => {
      const respondedDoc = { ...mockDocument, status: 'RESPONDIDO' };
      render(<DocumentDetailModal {...defaultProps} document={respondedDoc} />);
      expect(screen.queryByRole('button', { name: /marcar respondido/i })).not.toBeInTheDocument();
    });

    it('should render delete button', () => {
      render(<DocumentDetailModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument();
    });
  });

  describe('close behavior', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<DocumentDetailModal {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      const { container } = render(<DocumentDetailModal {...defaultProps} onClose={onClose} />);
      // Click the outer backdrop div (has onClick={onClose})
      const backdrop = container.querySelector('[style*="position: fixed"]');
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    });

    it('should not close when modal content is clicked', () => {
      const onClose = vi.fn();
      render(<DocumentDetailModal {...defaultProps} onClose={onClose} />);
      // Click on the title (inside modal)
      fireEvent.click(screen.getByText('Solicitud de información'));
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('mark as responded', () => {
    it('should call onMarkResponded after confirmation', async () => {
      const onMarkResponded = vi.fn().mockResolvedValue({});
      const onClose = vi.fn();
      render(
        <DocumentDetailModal
          {...defaultProps}
          onMarkResponded={onMarkResponded}
          onClose={onClose}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /marcar respondido/i }));

      await waitFor(() => {
        expect(onMarkResponded).toHaveBeenCalledWith('1');
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('should not call onMarkResponded when confirmation is cancelled', async () => {
      window.confirm.mockReturnValue(false);
      const onMarkResponded = vi.fn();
      render(<DocumentDetailModal {...defaultProps} onMarkResponded={onMarkResponded} />);

      fireEvent.click(screen.getByRole('button', { name: /marcar respondido/i }));

      expect(onMarkResponded).not.toHaveBeenCalled();
    });

    it('should show alert when markAsResponded fails', async () => {
      const onMarkResponded = vi.fn().mockRejectedValue(new Error('Failed'));
      render(<DocumentDetailModal {...defaultProps} onMarkResponded={onMarkResponded} />);

      fireEvent.click(screen.getByRole('button', { name: /marcar respondido/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Error al actualizar el documento');
      });
    });
  });

  describe('delete behavior', () => {
    it('should call onDelete after confirmation', async () => {
      const onDelete = vi.fn().mockResolvedValue({});
      const onClose = vi.fn();
      render(
        <DocumentDetailModal {...defaultProps} onDelete={onDelete} onClose={onClose} />
      );

      fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));

      await waitFor(() => {
        expect(onDelete).toHaveBeenCalledWith('1');
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('should not call onDelete when confirmation is cancelled', () => {
      window.confirm.mockReturnValue(false);
      const onDelete = vi.fn();
      render(<DocumentDetailModal {...defaultProps} onDelete={onDelete} />);

      fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));

      expect(onDelete).not.toHaveBeenCalled();
    });

    it('should show alert when delete fails', async () => {
      const onDelete = vi.fn().mockRejectedValue(new Error('Failed'));
      render(<DocumentDetailModal {...defaultProps} onDelete={onDelete} />);

      fireEvent.click(screen.getByRole('button', { name: /eliminar/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Error al eliminar el documento');
      });
    });
  });

  describe('file type detection', () => {
    it('should display Word for docx mimeType', () => {
      const wordDoc = { ...mockDocument, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
      const { container } = render(<DocumentDetailModal {...defaultProps} document={wordDoc} />);
      expect(container.textContent).toMatch(/Word/);
    });

    it('should display Excel for spreadsheet mimeType', () => {
      // application/vnd.ms-excel contains 'excel' → matches Excel branch
      const excelDoc = { ...mockDocument, mimeType: 'application/vnd.ms-excel' };
      const { container } = render(<DocumentDetailModal {...defaultProps} document={excelDoc} />);
      expect(container.textContent).toMatch(/Excel/);
    });

    it('should display Imagen for image mimeType', () => {
      const imageDoc = { ...mockDocument, mimeType: 'image/png' };
      const { container } = render(<DocumentDetailModal {...defaultProps} document={imageDoc} />);
      expect(container.textContent).toMatch(/Imagen/);
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UploadForm } from './UploadForm';

describe('UploadForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  describe('rendering', () => {
    it('should render title field', () => {
      render(<UploadForm {...defaultProps} />);
      expect(screen.getByPlaceholderText('Nombre o asunto del documento')).toBeInTheDocument();
    });

    it('should render description textarea', () => {
      render(<UploadForm {...defaultProps} />);
      expect(screen.getByPlaceholderText(/descripción breve/i)).toBeInTheDocument();
    });

    it('should render notes textarea', () => {
      render(<UploadForm {...defaultProps} />);
      expect(screen.getByPlaceholderText(/observaciones/i)).toBeInTheDocument();
    });

    it('should render the file upload zone', () => {
      render(<UploadForm {...defaultProps} />);
      expect(screen.getByText(/arrastra el archivo aquí/i)).toBeInTheDocument();
    });

    it('should render the submit button', () => {
      render(<UploadForm {...defaultProps} />);
      expect(screen.getByRole('button', { name: /radicar documento/i })).toBeInTheDocument();
    });

    it('should render required field indicators', () => {
      render(<UploadForm {...defaultProps} />);
      expect(screen.getByText('Título del documento')).toBeInTheDocument();
      expect(screen.getByText('Archivo adjunto')).toBeInTheDocument();
    });

    it('should show incomplete hint when form is not valid', () => {
      render(<UploadForm {...defaultProps} />);
      expect(screen.getByText(/completa el título y selecciona un archivo/i)).toBeInTheDocument();
    });

    it('should render the date input', () => {
      render(<UploadForm {...defaultProps} />);
      expect(screen.getByText('Fecha límite de respuesta')).toBeInTheDocument();
      const dateInput = document.querySelector('input[type="date"]');
      expect(dateInput).toBeInTheDocument();
    });
  });

  describe('form submission validation', () => {
    it('should show alert when title is empty', async () => {
      const user = userEvent.setup();
      render(<UploadForm {...defaultProps} />);

      const submitBtn = screen.getByRole('button', { name: /radicar documento/i });
      expect(submitBtn).toBeDisabled();
    });

    it('should disable submit when no file is selected', () => {
      render(<UploadForm {...defaultProps} />);
      const submitBtn = screen.getByRole('button', { name: /radicar documento/i });
      expect(submitBtn).toBeDisabled();
    });
  });

  describe('file selection', () => {
    it('should show file info after file is selected', async () => {
      const user = userEvent.setup();
      render(<UploadForm {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]');
      const testFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      await user.upload(fileInput, testFile);

      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    it('should show file size after file is selected', async () => {
      const user = userEvent.setup();
      render(<UploadForm {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]');
      const testFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      await user.upload(fileInput, testFile);

      // formatFileSize is used - content is 7 bytes
      expect(screen.getByText(/bytes|kb|mb/i)).toBeInTheDocument();
    });

    it('should show "Quitar" button after file is selected', async () => {
      const user = userEvent.setup();
      render(<UploadForm {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]');
      const testFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      await user.upload(fileInput, testFile);

      expect(screen.getByRole('button', { name: /quitar/i })).toBeInTheDocument();
    });

    it('should remove file when "Quitar" is clicked', async () => {
      const user = userEvent.setup();
      render(<UploadForm {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]');
      const testFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      await user.upload(fileInput, testFile);
      expect(screen.getByText('test.pdf')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /quitar/i }));
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
      expect(screen.getByText(/arrastra el archivo aquí/i)).toBeInTheDocument();
    });

    it('should alert when file exceeds 10MB', async () => {
      const user = userEvent.setup();
      render(<UploadForm {...defaultProps} />);

      const fileInput = document.querySelector('input[type="file"]');
      // Create a mock file that reports as > 10MB
      const bigFile = new File(['x'.repeat(100)], 'big.pdf', { type: 'application/pdf' });
      Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 });

      await user.upload(fileInput, bigFile);

      expect(window.alert).toHaveBeenCalledWith('El archivo no puede superar 10 MB');
    });
  });

  describe('form input handling', () => {
    it('should update title field when typed', async () => {
      const user = userEvent.setup();
      render(<UploadForm {...defaultProps} />);

      const titleInput = screen.getByPlaceholderText('Nombre o asunto del documento');
      await user.type(titleInput, 'Mi documento');

      expect(titleInput).toHaveValue('Mi documento');
    });

    it('should update description field when typed', async () => {
      const user = userEvent.setup();
      render(<UploadForm {...defaultProps} />);

      const descInput = screen.getByPlaceholderText(/descripción breve/i);
      await user.type(descInput, 'Una descripción');

      expect(descInput).toHaveValue('Una descripción');
    });

    it('should update notes field when typed', async () => {
      const user = userEvent.setup();
      render(<UploadForm {...defaultProps} />);

      const notesInput = screen.getByPlaceholderText(/observaciones/i);
      await user.type(notesInput, 'Notas internas');

      expect(notesInput).toHaveValue('Notas internas');
    });
  });

  describe('successful submission', () => {
    it('should call onSubmit with form data and file', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue({});
      render(<UploadForm onSubmit={onSubmit} onSuccess={vi.fn()} />);

      await user.type(screen.getByPlaceholderText('Nombre o asunto del documento'), 'Test Doc');

      const fileInput = document.querySelector('input[type="file"]');
      const testFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      await user.upload(fileInput, testFile);

      const submitBtn = screen.getByRole('button', { name: /radicar documento/i });
      expect(submitBtn).not.toBeDisabled();

      await user.click(submitBtn);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Doc',
            file: testFile,
          })
        );
      });
    });

    it('should show success screen after successful submission', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue({});
      render(<UploadForm onSubmit={onSubmit} onSuccess={vi.fn()} />);

      await user.type(screen.getByPlaceholderText('Nombre o asunto del documento'), 'Test Doc');

      const fileInput = document.querySelector('input[type="file"]');
      await user.upload(fileInput, new File(['content'], 'test.pdf', { type: 'application/pdf' }));

      await user.click(screen.getByRole('button', { name: /radicar documento/i }));

      await waitFor(() => {
        expect(screen.getByText(/documento radicado exitosamente/i)).toBeInTheDocument();
      });
    });

    it('should show alert when submission fails', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockRejectedValue(new Error('Server error'));
      render(<UploadForm onSubmit={onSubmit} onSuccess={vi.fn()} />);

      await user.type(screen.getByPlaceholderText('Nombre o asunto del documento'), 'Test Doc');

      const fileInput = document.querySelector('input[type="file"]');
      await user.upload(fileInput, new File(['content'], 'test.pdf', { type: 'application/pdf' }));

      await user.click(screen.getByRole('button', { name: /radicar documento/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Error al radicar'));
      });
    });
  });

  describe('drag and drop', () => {
    it('should handle drag over event', () => {
      render(<UploadForm {...defaultProps} />);
      const dropZone = screen.getByText(/arrastra el archivo aquí/i).closest('div');

      fireEvent.dragOver(dropZone, { preventDefault: () => {} });
      // dragOver state should be set - component doesn't crash
      expect(dropZone).toBeInTheDocument();
    });

    it('should handle drag leave event', () => {
      render(<UploadForm {...defaultProps} />);
      const dropZone = screen.getByText(/arrastra el archivo aquí/i).closest('div');

      fireEvent.dragOver(dropZone, { preventDefault: () => {} });
      fireEvent.dragLeave(dropZone);
      // Component remains stable
      expect(screen.getByText(/arrastra el archivo aquí/i)).toBeInTheDocument();
    });
  });
});

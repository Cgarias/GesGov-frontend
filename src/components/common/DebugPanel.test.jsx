import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DebugPanel } from './DebugPanel';

// In test env, import.meta.env.PROD is false, so the panel renders
describe('DebugPanel', () => {
  const defaultProps = {
    form: { title: '', description: '', responseDeadline: '', notes: '' },
    file: null,
    submitting: false,
  };

  describe('rendering', () => {
    it('should render the debug toggle button', () => {
      render(<DebugPanel {...defaultProps} />);
      const btn = screen.getByTitle('Toggle Debug Panel');
      expect(btn).toBeInTheDocument();
    });

    it('should not show the panel by default', () => {
      render(<DebugPanel {...defaultProps} />);
      expect(screen.queryByText('🐛 Debug Panel')).not.toBeInTheDocument();
    });
  });

  describe('toggle behavior', () => {
    it('should show the panel when toggle button is clicked', async () => {
      const user = userEvent.setup();
      render(<DebugPanel {...defaultProps} />);

      await user.click(screen.getByTitle('Toggle Debug Panel'));

      expect(screen.getByText('🐛 Debug Panel')).toBeInTheDocument();
    });

    it('should hide the panel when toggle button is clicked twice', async () => {
      const user = userEvent.setup();
      render(<DebugPanel {...defaultProps} />);

      await user.click(screen.getByTitle('Toggle Debug Panel'));
      expect(screen.getByText('🐛 Debug Panel')).toBeInTheDocument();

      await user.click(screen.getByTitle('Toggle Debug Panel'));
      expect(screen.queryByText('🐛 Debug Panel')).not.toBeInTheDocument();
    });

    it('should close the panel when the × button inside is clicked', async () => {
      const user = userEvent.setup();
      render(<DebugPanel {...defaultProps} />);

      await user.click(screen.getByTitle('Toggle Debug Panel'));
      expect(screen.getByText('🐛 Debug Panel')).toBeInTheDocument();

      await user.click(screen.getByText('×'));
      expect(screen.queryByText('🐛 Debug Panel')).not.toBeInTheDocument();
    });
  });

  describe('panel content - empty form', () => {
    it('should show "(empty)" for empty title', async () => {
      const user = userEvent.setup();
      render(<DebugPanel {...defaultProps} />);
      await user.click(screen.getByTitle('Toggle Debug Panel'));

      // All 4 form fields are empty, so (empty) appears multiple times
      const emptyElements = screen.getAllByText('(empty)');
      expect(emptyElements.length).toBeGreaterThan(0);
    });

    it('should show "No file selected" when no file', async () => {
      const user = userEvent.setup();
      render(<DebugPanel {...defaultProps} />);
      await user.click(screen.getByTitle('Toggle Debug Panel'));

      expect(screen.getByText('No file selected')).toBeInTheDocument();
    });

    it('should show validation as invalid when title is empty', async () => {
      const user = userEvent.setup();
      render(<DebugPanel {...defaultProps} />);
      await user.click(screen.getByTitle('Toggle Debug Panel'));

      const invalidItems = screen.getAllByText('❌ No');
      expect(invalidItems.length).toBeGreaterThan(0);
    });
  });

  describe('panel content - with data', () => {
    it('should show title value when form has title', async () => {
      const user = userEvent.setup();
      render(
        <DebugPanel
          form={{ title: 'Test Document', description: '', responseDeadline: '', notes: '' }}
          file={null}
          submitting={false}
        />
      );
      await user.click(screen.getByTitle('Toggle Debug Panel'));

      expect(screen.getByText('Test Document')).toBeInTheDocument();
    });

    it('should show file info when file is selected', async () => {
      const user = userEvent.setup();
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      render(
        <DebugPanel
          form={{ title: 'Doc', description: '', responseDeadline: '', notes: '' }}
          file={mockFile}
          submitting={false}
        />
      );
      await user.click(screen.getByTitle('Toggle Debug Panel'));

      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    it('should show submitting state', async () => {
      const user = userEvent.setup();
      render(<DebugPanel {...defaultProps} submitting={true} />);
      await user.click(screen.getByTitle('Toggle Debug Panel'));

      expect(screen.getByText('⏳ Yes')).toBeInTheDocument();
    });

    it('should show all section headings', async () => {
      const user = userEvent.setup();
      render(<DebugPanel {...defaultProps} />);
      await user.click(screen.getByTitle('Toggle Debug Panel'));

      expect(screen.getByText('📝 Form State')).toBeInTheDocument();
      expect(screen.getByText('📎 File State')).toBeInTheDocument();
      expect(screen.getByText('✅ Validation')).toBeInTheDocument();
      expect(screen.getByText('🚀 Submit State')).toBeInTheDocument();
      expect(screen.getByText('🌍 Environment')).toBeInTheDocument();
    });
  });
});

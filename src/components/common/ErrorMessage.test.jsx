import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByText('Ocurrió un error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const handleRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={handleRetry} />);

    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error" />);

    expect(screen.queryByRole('button', { name: /reintentar/i })).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    render(<ErrorMessage message="Error" onRetry={handleRetry} />);

    await user.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('should render with different error messages', () => {
    const { rerender } = render(<ErrorMessage message="Network error" />);
    expect(screen.getByText('Network error')).toBeInTheDocument();

    rerender(<ErrorMessage message="Server error" />);
    expect(screen.getByText('Server error')).toBeInTheDocument();
  });

  it('should display error icon', () => {
    const { container } = render(<ErrorMessage message="Error" />);
    // Icon is rendered via lucide-react, just check the structure
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

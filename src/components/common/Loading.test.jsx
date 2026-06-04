import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('should render default loading message', () => {
    render(<Loading />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('should render custom loading message', () => {
    render(<Loading message="Procesando datos..." />);
    expect(screen.getByText('Procesando datos...')).toBeInTheDocument();
  });

  it('should render spinner element', () => {
    const { container } = render(<Loading />);
    // The spinner is the first nested div
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThanOrEqual(2); // Container + spinner
  });

  it('should render with different custom messages', () => {
    const { rerender } = render(<Loading message="Cargando documentos..." />);
    expect(screen.getByText('Cargando documentos...')).toBeInTheDocument();

    rerender(<Loading message="Guardando cambios..." />);
    expect(screen.getByText('Guardando cambios...')).toBeInTheDocument();
  });

  it('should include spin animation keyframes', () => {
    const { container } = render(<Loading />);
    const style = container.querySelector('style');
    expect(style).toBeInTheDocument();
    expect(style.textContent).toContain('@keyframes spin');
    expect(style.textContent).toContain('transform: rotate(360deg)');
  });
});

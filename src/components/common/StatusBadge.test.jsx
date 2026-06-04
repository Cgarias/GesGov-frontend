import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('should render PENDIENTE status with correct label', () => {
    render(<StatusBadge status="PENDIENTE" />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('should render EN_PROCESO status with correct label', () => {
    render(<StatusBadge status="EN_PROCESO" />);
    expect(screen.getByText('En Proceso')).toBeInTheDocument();
  });

  it('should render POR_VENCER status with correct label', () => {
    render(<StatusBadge status="POR_VENCER" />);
    expect(screen.getByText('Por Vencer')).toBeInTheDocument();
  });

  it('should render VENCIDO status with correct label', () => {
    render(<StatusBadge status="VENCIDO" />);
    expect(screen.getByText('Vencido')).toBeInTheDocument();
  });

  it('should render RESPONDIDO status with correct label', () => {
    render(<StatusBadge status="RESPONDIDO" />);
    expect(screen.getByText('Respondido')).toBeInTheDocument();
  });

  it('should fall back to PENDIENTE for unknown status', () => {
    render(<StatusBadge status="UNKNOWN_STATUS" />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('should fall back to PENDIENTE when status is undefined', () => {
    render(<StatusBadge />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('should render as an inline span element', () => {
    const { container } = render(<StatusBadge status="RESPONDIDO" />);
    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
  });

  it('should render the dot indicator alongside the label', () => {
    const { container } = render(<StatusBadge status="VENCIDO" />);
    const spans = container.querySelectorAll('span');
    // outer badge span + inner dot span
    expect(spans.length).toBeGreaterThanOrEqual(2);
  });
});

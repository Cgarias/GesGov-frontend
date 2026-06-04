import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should render with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render with primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="accent">Accent</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Accent');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Outline');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Ghost');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Danger');

    rerender(<Button variant="success">Success</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Success');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Small');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Medium');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Large');
  });

  it('should render with icon', () => {
    const icon = <span data-testid="test-icon">📁</span>;
    render(<Button icon={icon}>With Icon</Button>);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('With Icon');
  });

  it('should have correct type attribute', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<Button type="button">Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

    rerender(<Button>Default</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red', color: 'white' };
    render(<Button style={customStyle}>Custom</Button>);

    const button = screen.getByRole('button');
    expect(button.style.backgroundColor).toBe('red');
    expect(button.style.color).toBe('white');
  });

  it('should have disabled attribute when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should support gold variant as alias for accent', () => {
    render(<Button variant="gold">Gold</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Gold');
  });
});

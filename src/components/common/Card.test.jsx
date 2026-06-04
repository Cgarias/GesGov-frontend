import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  it('should render children', () => {
    render(<Card><div>Card content</div></Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply custom styles', () => {
    const customStyle = { padding: '20px', margin: '10px' };
    render(<Card style={customStyle}><div>Content</div></Card>);

    const card = screen.getByText('Content').parentElement;
    expect(card.style.padding).toBe('20px');
    expect(card.style.margin).toBe('10px');
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}><div>Clickable</div></Card>);

    await user.click(screen.getByText('Clickable').parentElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should call onMouseEnter when mouse enters', async () => {
    const user = userEvent.setup();
    const handleMouseEnter = vi.fn();
    render(<Card onMouseEnter={handleMouseEnter}><div>Hoverable</div></Card>);

    const card = screen.getByText('Hoverable').parentElement;
    await user.hover(card);

    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
  });

  it('should call onMouseLeave when mouse leaves', async () => {
    const user = userEvent.setup();
    const handleMouseLeave = vi.fn();
    render(<Card onMouseLeave={handleMouseLeave}><div>Hoverable</div></Card>);

    const card = screen.getByText('Hoverable').parentElement;
    await user.hover(card);
    await user.unhover(card);

    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('should have animation when animate prop is true', () => {
    render(<Card animate><div>Animated</div></Card>);

    const card = screen.getByText('Animated').parentElement;
    expect(card.style.animation).toContain('fadeUp');
  });

  it('should not have animation when animate prop is false', () => {
    render(<Card><div>Not animated</div></Card>);

    const card = screen.getByText('Not animated').parentElement;
    expect(card.style.animation).toBeFalsy();
  });

  it('should render multiple children', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
        <button>Action</button>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

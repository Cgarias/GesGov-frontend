import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icons } from './Icons';

describe('Icons', () => {
  const iconNames = [
    'Dashboard', 'Documents', 'Upload', 'Reports', 'Settings',
    'Bell', 'Search', 'Plus', 'Close', 'Check', 'Trash',
    'Eye', 'Calendar', 'File', 'Menu', 'Alert', 'Office',
  ];

  it('should export an Icons object', () => {
    expect(typeof Icons).toBe('object');
  });

  it('should have all expected icon components', () => {
    iconNames.forEach((name) => {
      expect(typeof Icons[name]).toBe('function');
    });
  });

  iconNames.forEach((name) => {
    it(`should render ${name} icon as an SVG element`, () => {
      const IconComponent = Icons[name];
      const { container } = render(<IconComponent />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});

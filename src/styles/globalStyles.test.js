import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { GLOBAL_CSS, injectGlobalStyles } from './globalStyles';

describe('globalStyles', () => {
  describe('GLOBAL_CSS', () => {
    it('should be a non-empty string', () => {
      expect(typeof GLOBAL_CSS).toBe('string');
      expect(GLOBAL_CSS.length).toBeGreaterThan(0);
    });

    it('should define CSS custom properties for primary color', () => {
      expect(GLOBAL_CSS).toContain('--primary');
    });

    it('should define sidebar variables', () => {
      expect(GLOBAL_CSS).toContain('--sidebar-bg');
      expect(GLOBAL_CSS).toContain('--sidebar-w');
    });

    it('should define surface variables', () => {
      expect(GLOBAL_CSS).toContain('--surface');
    });

    it('should define shadow variables', () => {
      expect(GLOBAL_CSS).toContain('--shadow-sm');
    });

    it('should include keyframe animations', () => {
      expect(GLOBAL_CSS).toContain('@keyframes fadeUp');
      expect(GLOBAL_CSS).toContain('@keyframes fadeIn');
      expect(GLOBAL_CSS).toContain('@keyframes scaleIn');
    });

    it('should include font imports', () => {
      expect(GLOBAL_CSS).toContain('Inter');
    });
  });

  describe('injectGlobalStyles', () => {
    let cleanup;

    afterEach(() => {
      if (cleanup) cleanup();
      const el = document.getElementById('gesgov-global');
      if (el) document.head.removeChild(el);
    });

    it('should inject a style element into the document head', () => {
      cleanup = injectGlobalStyles();
      const style = document.getElementById('gesgov-global');
      expect(style).not.toBeNull();
      expect(style.tagName).toBe('STYLE');
    });

    it('should inject the global CSS content', () => {
      cleanup = injectGlobalStyles();
      const style = document.getElementById('gesgov-global');
      expect(style.textContent).toContain('--primary');
    });

    it('should return a cleanup function', () => {
      cleanup = injectGlobalStyles();
      expect(typeof cleanup).toBe('function');
    });

    it('should remove the style element when cleanup is called', () => {
      const removeStyle = injectGlobalStyles();
      expect(document.getElementById('gesgov-global')).not.toBeNull();

      removeStyle();
      cleanup = null; // already cleaned up

      expect(document.getElementById('gesgov-global')).toBeNull();
    });

    it('should handle cleanup gracefully when element no longer exists', () => {
      const removeStyle = injectGlobalStyles();
      // Manually remove the element before calling cleanup
      const el = document.getElementById('gesgov-global');
      if (el) document.head.removeChild(el);
      cleanup = null;

      // Should not throw
      expect(() => removeStyle()).not.toThrow();
    });
  });
});

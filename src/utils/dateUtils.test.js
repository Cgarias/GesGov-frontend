import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getDaysRemaining,
  formatDate,
  formatFileSize,
  getDaysLabel,
  getTodayISO,
} from './dateUtils';

describe('dateUtils', () => {
  describe('getDaysRemaining', () => {
    beforeEach(() => {
      // Mock current date to 2026-01-01
      vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    });

    it('should return null for undefined deadline', () => {
      expect(getDaysRemaining(null)).toBeNull();
      expect(getDaysRemaining(undefined)).toBeNull();
    });

    it('should calculate positive days for future deadline', () => {
      const futureDate = '2026-01-10';
      const days = getDaysRemaining(futureDate);
      expect(days).toBeGreaterThan(0);
      expect(days).toBeLessThanOrEqual(10);
    });

    it('should calculate negative days for past deadline', () => {
      const pastDate = '2025-12-25';
      const days = getDaysRemaining(pastDate);
      expect(days).toBeLessThan(0);
    });

    it('should return 0 for today', () => {
      const today = '2026-01-01';
      const days = getDaysRemaining(today);
      expect(days).toBe(0); // Same day
    });
  });

  describe('formatDate', () => {
    it('should return dash for null or undefined', () => {
      expect(formatDate(null)).toBe('—');
      expect(formatDate(undefined)).toBe('—');
      expect(formatDate('')).toBe('—');
    });

    it('should format date in Spanish locale', () => {
      const date = '2026-03-15';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}/); // day
      expect(formatted).toMatch(/[a-z]{3}/i); // month abbreviation
      expect(formatted).toMatch(/2026/); // year
    });

    it('should handle ISO date strings', () => {
      const isoDate = '2026-12-31T23:59:59.000Z';
      const formatted = formatDate(isoDate);
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });
  });

  describe('formatFileSize', () => {
    it('should return "0 KB" for null or undefined', () => {
      expect(formatFileSize(null)).toBe('0 KB');
      expect(formatFileSize(undefined)).toBe('0 KB');
      expect(formatFileSize(0)).toBe('0 KB');
    });

    it('should format bytes to KB for small files', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
      expect(formatFileSize(512)).toBe('1 KB'); // Rounded
    });

    it('should format bytes to MB for large files', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
      expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB');
    });

    it('should handle edge cases', () => {
      expect(formatFileSize(1)).toBe('0 KB');
      expect(formatFileSize(500)).toBe('0 KB');
      expect(formatFileSize(1500)).toBe('1 KB');
    });
  });

  describe('getDaysLabel', () => {
    it('should return "Sin fecha límite" for null', () => {
      expect(getDaysLabel(null)).toBe('Sin fecha límite');
    });

    it('should return "Vence hoy" for 0 days', () => {
      expect(getDaysLabel(0)).toBe('Vence hoy');
    });

    it('should return "Vence mañana" for 1 day', () => {
      expect(getDaysLabel(1)).toBe('Vence mañana');
    });

    it('should return days remaining for positive days > 1', () => {
      expect(getDaysLabel(5)).toBe('5 días restantes');
      expect(getDaysLabel(10)).toBe('10 días restantes');
      expect(getDaysLabel(30)).toBe('30 días restantes');
    });

    it('should return "Vencido hace X día(s)" for negative days', () => {
      expect(getDaysLabel(-1)).toBe('Vencido hace 1 día(s)');
      expect(getDaysLabel(-5)).toBe('Vencido hace 5 día(s)');
      expect(getDaysLabel(-30)).toBe('Vencido hace 30 día(s)');
    });
  });

  describe('getTodayISO', () => {
    it('should return today date in ISO format', () => {
      const today = getTodayISO();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return correct date parts', () => {
      const today = getTodayISO();
      const [year, month, day] = today.split('-');
      expect(parseInt(year)).toBeGreaterThan(2000);
      expect(parseInt(month)).toBeGreaterThanOrEqual(1);
      expect(parseInt(month)).toBeLessThanOrEqual(12);
      expect(parseInt(day)).toBeGreaterThanOrEqual(1);
      expect(parseInt(day)).toBeLessThanOrEqual(31);
    });

    it('should not include time component', () => {
      const today = getTodayISO();
      expect(today).not.toContain('T');
      expect(today).not.toContain(':');
    });
  });
});

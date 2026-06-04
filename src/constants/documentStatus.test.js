import { describe, it, expect } from 'vitest';
import {
  DOCUMENT_STATUS,
  STATUS_CONFIG,
  PRIORIDAD_CONFIG,
  DEPENDENCIAS,
} from './documentStatus';

describe('documentStatus constants', () => {
  describe('DOCUMENT_STATUS', () => {
    it('should have all required status values', () => {
      expect(DOCUMENT_STATUS.PENDIENTE).toBe('PENDIENTE');
      expect(DOCUMENT_STATUS.EN_PROCESO).toBe('EN_PROCESO');
      expect(DOCUMENT_STATUS.POR_VENCER).toBe('POR_VENCER');
      expect(DOCUMENT_STATUS.VENCIDO).toBe('VENCIDO');
      expect(DOCUMENT_STATUS.RESPONDIDO).toBe('RESPONDIDO');
    });

    it('should have exactly 5 statuses', () => {
      expect(Object.keys(DOCUMENT_STATUS)).toHaveLength(5);
    });

    it('each status key should match its value', () => {
      Object.entries(DOCUMENT_STATUS).forEach(([key, value]) => {
        expect(key).toBe(value);
      });
    });
  });

  describe('STATUS_CONFIG', () => {
    it('should have config for every DOCUMENT_STATUS value', () => {
      Object.values(DOCUMENT_STATUS).forEach((status) => {
        expect(STATUS_CONFIG[status]).toBeDefined();
      });
    });

    it('each STATUS_CONFIG entry should have required fields', () => {
      Object.entries(STATUS_CONFIG).forEach(([, cfg]) => {
        expect(cfg).toHaveProperty('label');
        expect(cfg).toHaveProperty('bg');
        expect(cfg).toHaveProperty('text');
        expect(cfg).toHaveProperty('dot');
        expect(cfg).toHaveProperty('border');
        expect(typeof cfg.label).toBe('string');
        expect(cfg.label.length).toBeGreaterThan(0);
      });
    });

    it('PENDIENTE config should have correct label', () => {
      expect(STATUS_CONFIG.PENDIENTE.label).toBe('Pendiente');
    });

    it('EN_PROCESO config should have correct label', () => {
      expect(STATUS_CONFIG.EN_PROCESO.label).toBe('En Proceso');
    });

    it('POR_VENCER config should have correct label', () => {
      expect(STATUS_CONFIG.POR_VENCER.label).toBe('Por Vencer');
    });

    it('VENCIDO config should have correct label', () => {
      expect(STATUS_CONFIG.VENCIDO.label).toBe('Vencido');
    });

    it('RESPONDIDO config should have correct label', () => {
      expect(STATUS_CONFIG.RESPONDIDO.label).toBe('Respondido');
    });
  });

  describe('PRIORIDAD_CONFIG', () => {
    it('should have Alta, Media and Baja priorities', () => {
      expect(PRIORIDAD_CONFIG.Alta).toBeDefined();
      expect(PRIORIDAD_CONFIG.Media).toBeDefined();
      expect(PRIORIDAD_CONFIG.Baja).toBeDefined();
    });

    it('each priority should have bg and text', () => {
      Object.entries(PRIORIDAD_CONFIG).forEach(([, cfg]) => {
        expect(cfg).toHaveProperty('bg');
        expect(cfg).toHaveProperty('text');
      });
    });
  });

  describe('DEPENDENCIAS', () => {
    it('should be an array', () => {
      expect(Array.isArray(DEPENDENCIAS)).toBe(true);
    });

    it('should have at least one entry', () => {
      expect(DEPENDENCIAS.length).toBeGreaterThan(0);
    });

    it('first entry should be "Todas las dependencias"', () => {
      expect(DEPENDENCIAS[0]).toBe('Todas las dependencias');
    });

    it('all entries should be non-empty strings', () => {
      DEPENDENCIAS.forEach((dep) => {
        expect(typeof dep).toBe('string');
        expect(dep.length).toBeGreaterThan(0);
      });
    });
  });
});

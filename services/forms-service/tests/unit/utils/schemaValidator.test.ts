import { describe, it, expect } from 'vitest';
import { OPTION_VALUES } from '../../../src/utils/schemaValidator';

describe('Schema Validator Constants', () => {
  describe('OPTION_VALUES', () => {
    it('should contain the correct option values', () => {
      expect(OPTION_VALUES).toContain('yes');
      expect(OPTION_VALUES).toContain('partial');
      expect(OPTION_VALUES).toContain('no');
      expect(OPTION_VALUES).toContain('na');
      expect(OPTION_VALUES.length).toBe(4);
    });
  });
});

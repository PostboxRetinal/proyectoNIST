import { describe, it, expect } from 'vitest';
import { CompanyService } from '../../../src/services/companyService';
import { VALID_BUSINESS_TYPES, VALID_EMPLOYEE_RANGES } from '../../../src/constants/businessTypes';

describe('CompanyService Validation Functions', () => {
  describe('isValidBusinessType', () => {
    it('should return true for all valid business types', () => {
      VALID_BUSINESS_TYPES.forEach(type => {
        expect(CompanyService.isValidBusinessType(type)).toBe(true);
      });
    });
    
    it('should return false for invalid business types', () => {
      expect(CompanyService.isValidBusinessType('not-a-real-type')).toBe(false);
      expect(CompanyService.isValidBusinessType('')).toBe(false);
    });
  });
  
  describe('isValidEmployeeRange', () => {
    it('should return true for all valid employee ranges', () => {
      VALID_EMPLOYEE_RANGES.forEach(range => {
        expect(CompanyService.isValidEmployeeRange(range)).toBe(true);
      });
    });
    
    it('should return false for invalid employee ranges', () => {
      expect(CompanyService.isValidEmployeeRange('not-a-real-range')).toBe(false);
      expect(CompanyService.isValidEmployeeRange('')).toBe(false);
    });
  });
});

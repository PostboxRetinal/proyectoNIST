import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CompanyService } from '../../../src/services/companyService';
import {
  DuplicateNITError,
  CompanyNotFoundError,
  InvalidBusinessTypeError,
  InvalidEmployeeRangeError
} from '../../../src/utils/companyErrors';
import { CompanyData } from '../../../src/schemas/companySchemas';
import { VALID_BUSINESS_TYPES, VALID_EMPLOYEE_RANGES } from '../../../src/constants/businessTypes';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(() => 'mocked-doc-reference'),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

vi.mock('../../../src/firebase/firebase', () => ({
  db: {},
}));

describe('CompanyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('isValidBusinessType', () => {
    it('should return true for valid business types', () => {
      // Test each valid business type from constants
      VALID_BUSINESS_TYPES.forEach((type) => {
        expect(CompanyService.isValidBusinessType(type)).toBe(true);
      });
    });

    it('should return false for invalid business types', () => {
      expect(CompanyService.isValidBusinessType('invalid-type')).toBe(false);
    });
  });

  describe('isValidEmployeeRange', () => {
    it('should return true for valid employee ranges', () => {
      // Test each valid employee range from constants
      VALID_EMPLOYEE_RANGES.forEach((range) => {
        expect(CompanyService.isValidEmployeeRange(range)).toBe(true);
      });
    });

    it('should return false for invalid employee ranges', () => {
      expect(CompanyService.isValidEmployeeRange('invalid-range')).toBe(false);
    });
  });

  describe('nitExists', () => {
    it('should return true if company with NIT exists', async () => {
      // Mock getDocs to return some documents
      const mockQuerySnapshot = {
        empty: false,
        docs: [{ id: 'company1' }]
      };
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);

      const result = await CompanyService.nitExists('123456789');
      
      expect(result).toBe(true);
    });

    it('should return false if company with NIT does not exist', async () => {
      // Mock getDocs to return empty query snapshot
      const mockQuerySnapshot = {
        empty: true,
        docs: []
      };
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue(mockQuerySnapshot as any);

      const result = await CompanyService.nitExists('123456789');
      
      expect(result).toBe(false);
    });
  });

  describe('createCompany', () => {
    it('should create a company successfully', async () => {
      // Mock dependencies
      const { setDoc } = await import('firebase/firestore');
      vi.mocked(setDoc).mockResolvedValue(undefined);
      
      // Mock nitExists to return false (NIT doesn't exist)
      vi.spyOn(CompanyService, 'nitExists').mockResolvedValue(false);
      
      // Mock validation methods to return true
      vi.spyOn(CompanyService, 'isValidBusinessType').mockReturnValue(true);
      vi.spyOn(CompanyService, 'isValidEmployeeRange').mockReturnValue(true);
      
      const companyData: CompanyData = {
        companyName: 'Test Company',
        nit: '123456789',
        businessType: 'Construcción',
        employeeRange: 'Menos de 50',
        address: 'Test Address',
        email: 'test@example.com',
        phone: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await CompanyService.createCompany(companyData);
      
      // Verify that setDoc was called
      expect(setDoc).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expect.objectContaining({
        success: true,
        companyId: 'test-id'
      }));
    });

    it('should throw DuplicateNITError if NIT already exists', async () => {
      // Mock nitExists to return true (NIT exists)
      vi.spyOn(CompanyService, 'nitExists').mockResolvedValue(true);
      
      const companyData: CompanyData = {
        nit: '123456789',
        companyName: 'Test Company',
        email: 'john@example.com',
        phone: '1234567890',
        address: 'Test Address',
        businessType: 'Tecnología',
        employeeRange: 'Menos de 50',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await expect(CompanyService.createCompany(companyData)).rejects.toThrow(DuplicateNITError);
    });

    it('should throw InvalidBusinessTypeError for invalid business type', async () => {
      // Mock nitExists to return false (NIT doesn't exist)
      vi.spyOn(CompanyService, 'nitExists').mockResolvedValue(false);
      
      // Make isValidBusinessType return false
      vi.spyOn(CompanyService, 'isValidBusinessType').mockReturnValue(false);
      
      const companyData: CompanyData = {
        nit: '123456789',
        companyName: 'Test Company',
        email: 'john@example.com',
        phone: '1234567890',
        address: 'Test Address',
        businessType: 'invalid-type' as any, // Invalid business type
        employeeRange: 'Menos de 50',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await expect(CompanyService.createCompany(companyData)).rejects.toThrow(InvalidBusinessTypeError);
    });

    it('should throw InvalidEmployeeRangeError for invalid employee range', async () => {
      // Mock nitExists to return false (NIT doesn't exist)
      vi.spyOn(CompanyService, 'nitExists').mockResolvedValue(false);
      
      // Make isValidBusinessType return true but isValidEmployeeRange return false
      vi.spyOn(CompanyService, 'isValidBusinessType').mockReturnValue(true);
      vi.spyOn(CompanyService, 'isValidEmployeeRange').mockReturnValue(false);
      
      const companyData: CompanyData = {
        nit: '123456789',
        companyName: 'Test Company',
        email: 'john@example.com',
        phone: '1234567890',
        address: 'Test Address',
        businessType: 'Tecnología',
        employeeRange: 'invalid-range' as any, // Invalid employee range
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await expect(CompanyService.createCompany(companyData)).rejects.toThrow(InvalidEmployeeRangeError);
    });
  });

  // Add more tests for other methods (getCompanyById, updateCompany, deleteCompany, etc.)
});

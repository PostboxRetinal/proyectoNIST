/**
 * Test helpers for company-service tests
 * Contains factory functions to create test data consistently
 */

import { CompanyData } from '../../src/schemas/companySchemas';
import { BusinessType, EmployeeRange } from '../../src/constants/businessTypes';

/**
 * Creates a simple valid company object for testing
 * @param overrides - Properties to override in the default company object
 * @returns A valid CompanyData object for testing
 */
export function createTestCompany(overrides = {}): CompanyData {
	const defaultCompany: CompanyData = {
		nit: 'test-company-id',
		companyName: 'Test Company',
		email: 'testing@outlook.com',
		businessType: 'Otro' as BusinessType,
		employeeRange: 'Más de 500' as EmployeeRange,
		address: 'CRA 3#4-5',
		phone: '1234567890',
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return { ...defaultCompany, ...overrides };
}

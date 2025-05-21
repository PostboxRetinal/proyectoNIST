/**
 * Test helpers for user-service tests
 * Contains factory functions to create test data consistently
 */

import { UserData } from '../../../src/schemas/userSchema';
import { Role } from '../../../src/constants/roles';

/**
 * Creates a simple valid user object for testing
 * @param overrides - Properties to override in the default user object
 * @returns A valid UserData object for testing
 */
export function createTestUser(overrides = {}): UserData {
  const defaultUser: UserData = {
    uid: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'admin' as Role,
    companyId: 'test-company-id'
  };
  
  return { ...defaultUser, ...overrides };
}

/**
 * Creates user registration data for testing
 * @param overrides - Properties to override in the default registration data
 * @returns A valid user registration object for testing
 */
export function createTestUserRegistration(overrides = {}) {
  const defaultRegistration = {
    email: 'new@example.com',
    password: 'password123',
    name: 'New User',
    role: 'user' as Role,
    companyId: 'test-company-id'
  };
  
  return { ...defaultRegistration, ...overrides };
}

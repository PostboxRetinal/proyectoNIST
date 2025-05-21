import { describe, it, expect } from 'vitest';
import { UserService } from '../../../src/services/userService';
import { VALID_ROLES } from '../../../src/constants/roles';

describe('UserService Validation Functions', () => {
  describe('isValidRole', () => {
    it('should return true for all valid roles', () => {
      VALID_ROLES.forEach(role => {
        expect(UserService.isValidRole(role)).toBe(true);
      });
    });
    
    it('should return false for invalid roles', () => {
      expect(UserService.isValidRole('not-a-real-role')).toBe(false);
      expect(UserService.isValidRole('')).toBe(false);
    });
  });
});

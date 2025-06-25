import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService, InvalidRoleError } from '../../../src/services/userService';
import { VALID_ROLES } from '../../../src/constants/roles';
import { UserData } from '../../../src/schemas/userSchema';

// Mock Firebase Auth and Firestore
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => 'mocked-doc-reference'),
  setDoc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));

vi.mock('../../../src/firebase/firebase', () => ({
  auth: {},
  db: {},
}));

vi.mock('../../../src/utils/firebaseErrors', () => ({
  logFirebaseError: vi.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  describe('isValidRole', () => {
    it('should return true for valid roles', () => {
      // Test each valid role from constants
      VALID_ROLES.forEach((role) => {
        expect(UserService.isValidRole(role)).toBe(true);
      });
    });

    it('should return false for invalid roles', () => {
      expect(UserService.isValidRole('invalid-role')).toBe(false);
    });
  });
  
  describe('getUserData', () => {
    it('should return user data if user exists', async () => {
      // Create mock user data
      const mockUserData = {
        uid: 'test-uid',
        email: 'test@example.com',
        role: 'admin',
        name: 'Test User'
      };
      
      // Mock getDoc to return user data
      const { getDoc } = await import('firebase/firestore');
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => true,
        data: () => mockUserData
      } as any);
      
      const result = await UserService.getUserData('test-uid');
      
      expect(result).toEqual(mockUserData);
    });
    
    it('should throw an error if user is not found', async () => {
      // Mock getDoc to return no data
      const { getDoc } = await import('firebase/firestore');
      vi.mocked(getDoc).mockResolvedValue({
        exists: () => false
      } as any);
      
      await expect(UserService.getUserData('non-existent-uid')).rejects.toThrow(
        'No se encontró ningún usuario con el ID: non-existent-uid'
      );
    });
  });
  
  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      // Mock auth and firestore functions
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { setDoc } = await import('firebase/firestore');
      
      const mockUserCredential = {
        user: {
          uid: 'new-user-uid'
        }
      };
      
      vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(mockUserCredential as any);
      vi.mocked(setDoc).mockResolvedValue(undefined);
      
      // Mock isValidRole
      vi.spyOn(UserService, 'isValidRole').mockReturnValue(true);
      
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        role: 'user',
        companyId: 'company-id'
      };
      
      const result = await UserService.registerUser(userData);
      
      // Check that auth and firestore methods were called
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        userData.email,
        userData.password
      );
      
      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          uid: 'new-user-uid',
          email: userData.email,
          name: userData.name,
          role: userData.role
        })
      );
      
      expect(result).toEqual({
        success: true,
        uid: 'new-user-uid',
        message: expect.stringContaining('registrado exitosamente')
      });
    });
    
    it('should throw InvalidRoleError for invalid roles', async () => {
      // Mock isValidRole to return false
      vi.spyOn(UserService, 'isValidRole').mockReturnValue(false);
      
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        role: 'invalid-role',
        companyId: 'company-id'
      };
      
      await expect(UserService.registerUser(userData)).rejects.toThrow(InvalidRoleError);
    });
    
    it('should handle Firebase auth errors', async () => {
      // Mock createUserWithEmailAndPassword to throw an error
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(
        new Error('Firebase auth error')
      );
      
      // Mock isValidRole to return true
      vi.spyOn(UserService, 'isValidRole').mockReturnValue(true);
      
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        role: 'user',
        companyId: 'company-id'
      };
      
      await expect(UserService.registerUser(userData)).rejects.toThrow();
    });
  });
  
  describe('loginUser', () => {
    it('should login a user successfully and return user data', async () => {
      // Mock Firebase auth and firestore
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const mockCredential = {
        user: {
          uid: 'user-uid'
        }
      };
      vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockCredential as any);
      
      // Mock getUserData to return user info
      const mockUserData = {
        uid: 'user-uid',
        email: 'user@example.com',
        name: 'Test User',
        role: 'user'
      };
      vi.spyOn(UserService, 'getUserData').mockResolvedValue(mockUserData as any);
      
      const result = await UserService.loginUser('user@example.com', 'password');
      
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'user@example.com',
        'password'
      );
      
      expect(result).toEqual({
        success: true,
        user: mockUserData,
        message: expect.stringContaining('iniciada correctamente')
      });
    });
    
    it('should handle invalid credentials', async () => {
      // Mock Firebase auth to throw an error
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
        new Error('Invalid credentials')
      );
      
      await expect(UserService.loginUser('wrong@example.com', 'wrong')).rejects.toThrow();
    });
  });
  
  // Add more tests for other UserService methods (sendPasswordReset, deleteUser, etc.)
});

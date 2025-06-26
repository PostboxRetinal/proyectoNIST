import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as firebaseAuth from 'firebase/auth';
import * as firestore from 'firebase/firestore';
import { UserService, InvalidRoleError } from '../../../src/services/userService';
import { VALID_ROLES } from '../../../src/constants/roles';
import { UserData } from '../../../src/schemas/userSchema';

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      
      // Mock doc and getDoc functions
      const docSpy = vi.spyOn(firestore, 'doc');
      const getDocSpy = vi.spyOn(firestore, 'getDoc');
      
      docSpy.mockReturnValue({ id: 'mock-doc' } as any);
      getDocSpy.mockResolvedValue({
        exists: () => true,
        data: () => mockUserData
      } as any);
      
      const result = await UserService.getUserData('test-uid');
      
      expect(docSpy).toHaveBeenCalledWith(expect.anything(), 'users', 'test-uid');
      expect(getDocSpy).toHaveBeenCalledWith({ id: 'mock-doc' });
      expect(result).toEqual(expect.objectContaining({
        id: 'test-uid',
        email: 'test@example.com',
        role: 'admin'
      }));
    });
    
    it('should throw an error if user is not found', async () => {
      // Mock doc and getDoc functions  
      const docSpy = vi.spyOn(firestore, 'doc');
      const getDocSpy = vi.spyOn(firestore, 'getDoc');
      
      docSpy.mockReturnValue({ id: 'mock-doc' } as any);
      getDocSpy.mockResolvedValue({
        exists: () => false
      } as any);
      
      await expect(UserService.getUserData('non-existent-uid')).rejects.toThrow(
        'No se encontró ningún usuario con el ID: non-existent-uid'
      );
    });
  });
  
  describe('createUser', () => {
    it('should register a user successfully', async () => {
      // Mock auth and firestore functions
      const createUserWithEmailAndPasswordSpy = vi.spyOn(firebaseAuth, 'createUserWithEmailAndPassword');
      const docSpy = vi.spyOn(firestore, 'doc');
      const setDocSpy = vi.spyOn(firestore, 'setDoc');
      
      const mockUserCredential = {
        user: {
          uid: 'new-user-uid'
        }
      };
      
      createUserWithEmailAndPasswordSpy.mockResolvedValue(mockUserCredential as any);
      docSpy.mockReturnValue({ id: 'mock-doc' } as any);
      setDocSpy.mockResolvedValue(undefined);
      
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        role: 'admin'
      };
      
      const result = await UserService.createUser(userData.email, userData.password, userData.role);
      
      // Check that auth and firestore methods were called
      expect(createUserWithEmailAndPasswordSpy).toHaveBeenCalledWith(
        expect.anything(),
        userData.email,
        userData.password
      );
      
      expect(docSpy).toHaveBeenCalledWith(expect.anything(), 'users', 'new-user-uid');
      expect(setDocSpy).toHaveBeenCalledWith(
        { id: 'mock-doc' },
        expect.objectContaining({
          id: 'new-user-uid',
          email: userData.email,
          role: userData.role
        })
      );
      
      expect(result).toEqual(expect.objectContaining({
        uid: 'new-user-uid'
      }));
    });
    
    it('should throw InvalidRoleError for invalid roles', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        role: 'invalid-role'
      };

      await expect(UserService.createUser(userData.email, userData.password, userData.role)).rejects.toThrow(InvalidRoleError);
    });
    
    it('should handle Firebase auth errors', async () => {
      // Mock createUserWithEmailAndPassword to throw an error
      const createUserWithEmailAndPasswordSpy = vi.spyOn(firebaseAuth, 'createUserWithEmailAndPassword');
      createUserWithEmailAndPasswordSpy.mockRejectedValue(
        new Error('Firebase auth error')
      );
      
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        role: 'admin'
      };

      await expect(UserService.createUser(userData.email, userData.password, userData.role)).rejects.toThrow();
    });
  });
  
  describe('loginUser', () => {
    it('should login a user successfully and return user data', async () => {
      // Mock Firebase auth
      const signInWithEmailAndPasswordSpy = vi.spyOn(firebaseAuth, 'signInWithEmailAndPassword');
      const mockCredential = {
        user: {
          uid: 'user-uid'
        }
      };
      signInWithEmailAndPasswordSpy.mockResolvedValue(mockCredential as any);
      
      const result = await UserService.loginUser('user@example.com', 'password');
      
      expect(signInWithEmailAndPasswordSpy).toHaveBeenCalledWith(
        expect.anything(),
        'user@example.com',
        'password'
      );
      
      expect(result).toEqual(expect.objectContaining({
        uid: 'user-uid'
      }));
    });
    
    it('should handle invalid credentials', async () => {
      // Mock Firebase auth to throw an error
      const signInWithEmailAndPasswordSpy = vi.spyOn(firebaseAuth, 'signInWithEmailAndPassword');
      signInWithEmailAndPasswordSpy.mockRejectedValue(
        new Error('Invalid credentials')
      );
      
      await expect(UserService.loginUser('wrong@example.com', 'wrong')).rejects.toThrow();
    });
  });
  
  // Add more tests for other UserService methods (sendPasswordReset, deleteUser, etc.)
});
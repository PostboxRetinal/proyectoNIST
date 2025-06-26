import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Elysia } from 'elysia';
import { registerUserRoutes } from '../../../src/routes/userRoutes';
import { UserService, InvalidRoleError } from '../../../src/services/userService';

describe('User Routes', () => {
  let app: Elysia;

  beforeEach(() => {
    // Clear all mocks and restore original implementations
    vi.clearAllMocks();
    app = new Elysia();
    registerUserRoutes(app);
  });

  afterEach(() => {
    // Ensure cleanup after each test
    vi.restoreAllMocks();
  });

  describe('POST /newUser', () => {
    it('should register a user successfully', async () => {
      // Mock successful user registration
      const mockUser = {
        uid: 'test-uid'
      };
      
      const createUserSpy = vi.spyOn(UserService, 'createUser').mockResolvedValue(mockUser as any);

      const response = await app.handle(
        new Request('http://localhost/newUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            role: 'admin'
          }),
        })
      );

      expect(response.status).toBe(200);
      const responseData = await response.json();
      
      expect(createUserSpy).toHaveBeenCalledWith('test@example.com', 'password123', 'admin');
      expect(responseData).toEqual({
        success: true,
        message: 'Usuario creado exitosamente',
        userId: 'test-uid',
        role: 'admin'
      });
    });

    it('should handle invalid role error', async () => {
      // Mock createUser to throw InvalidRoleError
      const createUserSpy = vi.spyOn(UserService, 'createUser').mockRejectedValue(
        new InvalidRoleError('invalid-role')
      );

      const response = await app.handle(
        new Request('http://localhost/newUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
            role: 'invalid-role'
          }),
        })
      );

      expect(response.status).toBe(400);
      const responseData = await response.json();
      
      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('invalid-role');
    });
  });

  describe('POST /login', () => {
    it('should login a user successfully', async () => {
      // Mock successful login
      const mockUser = {
        uid: 'test-uid'
      };
      
      const mockUserData = {
        id: 'test-uid',
        email: 'test@example.com',
        role: 'admin'
      };
      
      const loginUserSpy = vi.spyOn(UserService, 'loginUser').mockResolvedValue(mockUser as any);
      const getUserDataSpy = vi.spyOn(UserService, 'getUserData').mockResolvedValue(mockUserData as any);

      const response = await app.handle(
        new Request('http://localhost/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          }),
        })
      );

      expect(response.status).toBe(200);
      const responseData = await response.json();
      
      expect(loginUserSpy).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(getUserDataSpy).toHaveBeenCalledWith('test-uid');
      expect(responseData).toEqual({
        success: true,
        message: 'Inicio de sesión exitoso',
        userId: 'test-uid',
        role: 'admin'
      });
    });

    it('should handle authentication errors', async () => {
      // Mock loginUser to throw an error
      const loginUserSpy = vi.spyOn(UserService, 'loginUser').mockRejectedValue(
        new Error('Invalid email or password')
      );

      const response = await app.handle(
        new Request('http://localhost/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'wrong@example.com',
            password: 'wrongpassword'
          }),
        })
      );

      expect(response.status).toBe(400);
      const responseData = await response.json();
      
      expect(responseData.success).toBe(false);
    });
  });

  describe('GET /getUsers', () => {
    it('should return user data', async () => {
      // Mock user data
      const mockUsers = [
        {
          id: 'test-uid-1',
          email: 'test1@example.com',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'test-uid-2',
          email: 'test2@example.com',
          role: 'gestor',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      const getAllUsersSpy = vi.spyOn(UserService, 'getAllUsers').mockResolvedValue(mockUsers as any);

      const response = await app.handle(
        new Request('http://localhost/getUsers', {
          method: 'GET',
        })
      );

      expect(response.status).toBe(200);
      const responseData = await response.json();
      
      expect(getAllUsersSpy).toHaveBeenCalled();
      expect(responseData.success).toBe(true);
      expect(responseData.users).toHaveLength(2);
    });

    it('should handle errors when getting users', async () => {
      // Mock getAllUsers to throw an error
      const getAllUsersSpy = vi.spyOn(UserService, 'getAllUsers').mockRejectedValue(
        new Error('Database error')
      );

      const response = await app.handle(
        new Request('http://localhost/getUsers', {
          method: 'GET',
        })
      );

      expect(response.status).toBe(500);
      const responseData = await response.json();
      
      expect(responseData.success).toBe(false);
    });
  });
});

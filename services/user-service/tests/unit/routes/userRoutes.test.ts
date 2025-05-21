import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Elysia } from 'elysia';
import { registerUserRoutes } from '../../../src/routes/userRoutes';
import { UserService, InvalidRoleError } from '../../../src/services/userService';

// Mock UserService
vi.mock('../../../src/services/userService', () => ({
  UserService: {
    registerUser: vi.fn(),
    loginUser: vi.fn(),
    getUserData: vi.fn(),
    getAllUsers: vi.fn(),
    deleteUser: vi.fn(),
    sendPasswordReset: vi.fn(),
    isValidRole: vi.fn(),
  },
  InvalidRoleError: class InvalidRoleError extends Error {
    code: string;
    constructor(role: string) {
      super(`Invalid role: ${role}`);
      this.name = 'InvalidRoleError';
      this.code = 'auth/invalid-role';
    }
  }
}));

describe('User Routes', () => {
  let app: Elysia;

  beforeEach(() => {
    vi.clearAllMocks();
    app = new Elysia();
    registerUserRoutes(app);
  });

  describe('POST /register', () => {
    it('should register a user successfully', async () => {
      // Mock successful user registration
      const mockRegistrationResult = {
        success: true,
        uid: 'test-uid',
        message: 'Usuario registrado exitosamente'
      };
      
      vi.mocked(UserService.registerUser).mockResolvedValue(mockRegistrationResult);

      // Find the handler
      const handlers = app.routes
        .filter(route => route.path === '/register' && route.method === 'POST')
        .map(route => route.handler);

      expect(handlers).toHaveLength(1);

      if (handlers.length > 0) {
        const handler = handlers[0];
        
        // Mock request object
        const mockUserData = {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          role: 'user',
          companyId: 'company-id'
        };
        
        const mockRequest = {
          body: mockUserData,
          error: vi.fn().mockImplementation((status, body) => {
            return { status, body };
          })
        };

        // Execute handler
        const response = await handler(mockRequest as any);

        // Verify UserService was called with correct data
        expect(UserService.registerUser).toHaveBeenCalledWith(mockUserData);
        
        // Check response structure
        expect(response).toEqual(mockRegistrationResult);
      }
    });

    it('should handle invalid role error', async () => {
      // Mock registerUser to throw InvalidRoleError
      vi.mocked(UserService.registerUser).mockRejectedValue(
        new InvalidRoleError('invalid-role')
      );

      // Find the handler
      const handlers = app.routes
        .filter(route => route.path === '/register' && route.method === 'POST')
        .map(route => route.handler);

      if (handlers.length > 0) {
        const handler = handlers[0];
        
        const mockRequest = {
          body: {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            role: 'invalid-role',
            companyId: 'company-id'
          },
          error: vi.fn().mockImplementation((status, body) => {
            return { status, body };
          })
        };

        // Execute handler
        await handler(mockRequest as any);

        // Verify error was called with 400
        expect(mockRequest.error).toHaveBeenCalledWith(400, expect.objectContaining({
          success: false,
          error: expect.stringContaining('rol')
        }));
      }
    });
  });

  describe('POST /login', () => {
    it('should login a user successfully', async () => {
      // Mock successful login
      const mockLoginResult = {
        success: true,
        user: {
          uid: 'test-uid',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        },
        message: 'Sesión iniciada correctamente'
      };
      
      vi.mocked(UserService.loginUser).mockResolvedValue(mockLoginResult);

      // Find the handler
      const handlers = app.routes
        .filter(route => route.path === '/login' && route.method === 'POST')
        .map(route => route.handler);

      expect(handlers).toHaveLength(1);

      if (handlers.length > 0) {
        const handler = handlers[0];
        
        // Mock request object
        const mockRequest = {
          body: {
            email: 'test@example.com',
            password: 'password123'
          },
          error: vi.fn().mockImplementation((status, body) => {
            return { status, body };
          })
        };

        // Execute handler
        const response = await handler(mockRequest as any);

        // Verify UserService was called with correct credentials
        expect(UserService.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
        
        // Check response structure
        expect(response).toEqual(mockLoginResult);
      }
    });

    it('should handle authentication errors', async () => {
      // Mock loginUser to throw an error
      vi.mocked(UserService.loginUser).mockRejectedValue(
        new Error('Invalid email or password')
      );

      // Find the handler
      const handlers = app.routes
        .filter(route => route.path === '/login' && route.method === 'POST')
        .map(route => route.handler);

      if (handlers.length > 0) {
        const handler = handlers[0];
        
        const mockRequest = {
          body: {
            email: 'wrong@example.com',
            password: 'wrongpassword'
          },
          error: vi.fn().mockImplementation((status, body) => {
            return { status, body };
          })
        };

        // Execute handler
        await handler(mockRequest as any);

        // Verify error was called
        expect(mockRequest.error).toHaveBeenCalled();
      }
    });
  });

  describe('GET /user/:id', () => {
    it('should return user data by ID', async () => {
      // Mock user data
      const mockUserData = {
        uid: 'test-uid',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      };
      
      // Mock successful user retrieval
      vi.mocked(UserService.getUserData).mockResolvedValue(mockUserData);

      // Find the handler
      const handlers = app.routes
        .filter(route => route.path === '/user/:id' && route.method === 'GET')
        .map(route => route.handler);

      expect(handlers).toHaveLength(1);

      if (handlers.length > 0) {
        const handler = handlers[0];
        
        // Mock request object with params
        const mockRequest = {
          params: {
            id: 'test-uid'
          },
          error: vi.fn().mockImplementation((status, body) => {
            return { status, body };
          })
        };

        // Execute handler
        const response = await handler(mockRequest as any);

        // Verify UserService was called with correct ID
        expect(UserService.getUserData).toHaveBeenCalledWith('test-uid');
        
        // Check response
        expect(response).toEqual({
          success: true,
          user: mockUserData
        });
      }
    });

    it('should handle user not found error', async () => {
      // Mock getUserData to throw an error
      vi.mocked(UserService.getUserData).mockRejectedValue(
        new Error('No se encontró ningún usuario con el ID: non-existent-id')
      );

      // Find the handler
      const handlers = app.routes
        .filter(route => route.path === '/user/:id' && route.method === 'GET')
        .map(route => route.handler);

      if (handlers.length > 0) {
        const handler = handlers[0];
        
        // Mock request
        const mockRequest = {
          params: {
            id: 'non-existent-id'
          },
          error: vi.fn().mockImplementation((status, body) => {
            return { status, body };
          })
        };

        // Execute handler
        await handler(mockRequest as any);

        // Verify error was called
        expect(mockRequest.error).toHaveBeenCalledWith(404, expect.objectContaining({
          success: false,
          error: expect.stringContaining('No se encontró')
        }));
      }
    });
  });
  
  // Add more tests for other routes (getAllUsers, deleteUser, resetPassword)
});

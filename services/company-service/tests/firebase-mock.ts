// Mock file to completely replace the Firebase modules in tests
import { vi } from 'vitest';

// Create mock functions
const mockApp = {};
const mockAuth = {};
const mockDb = {};

// Mock firebase/app
export const initializeApp = vi.fn(() => mockApp);
export const getApps = vi.fn(() => []);
export const getApp = vi.fn(() => mockApp);

// Mock firebase/auth  
export const getAuth = vi.fn(() => mockAuth);

// Mock firebase/firestore
export const getFirestore = vi.fn(() => mockDb);
export const collection = vi.fn();
export const doc = vi.fn();
export const getDocs = vi.fn();
export const setDoc = vi.fn();
export const query = vi.fn();
export const where = vi.fn();
export const getDoc = vi.fn();
export const updateDoc = vi.fn();
export const deleteDoc = vi.fn();

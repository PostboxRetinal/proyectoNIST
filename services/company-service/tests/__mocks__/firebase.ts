import { vi } from 'vitest';

// Mock Firebase modules
export const initializeApp = vi.fn().mockReturnValue({});
export const getApps = vi.fn().mockReturnValue([]);
export const getApp = vi.fn().mockReturnValue({});

export const getAuth = vi.fn(() => ({}));

export const getFirestore = vi.fn(() => ({}));
export const collection = vi.fn();
export const doc = vi.fn();
export const getDocs = vi.fn();
export const setDoc = vi.fn();
export const query = vi.fn();
export const where = vi.fn();
export const getDoc = vi.fn();
export const updateDoc = vi.fn();
export const deleteDoc = vi.fn();

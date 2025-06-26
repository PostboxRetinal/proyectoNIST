// services/company-service/tests/setup.ts (NUEVO ARCHIVO)

import { vi } from 'vitest';

/**
 * ARCHIVO DE CONFIGURACIÓN GLOBAL PARA PRUEBAS
 *
 * Se carga ANTES que todos los tests gracias a la opción `setupFiles` en `vitest.config.ts`.
 * Su propósito es preparar un entorno de pruebas simulado (mocked).
 */

// Set test environment variables first
process.env.NODE_ENV = 'test';
process.env.VITEST = 'true';
process.env.TEST = 'true';

// 1. Mock para el entorno de Bun CON variables de Firebase necesarias
if (typeof global.Bun === 'undefined') {
    // @ts-expect-error Bun is not available in the test environment, so we mock it
    global.Bun = {
        env: {
            ...process.env,
            FIREBASE_API_KEY: 'test-api-key',
            FIREBASE_AUTH_DOMAIN: 'test-project.firebaseapp.com',
            FIREBASE_PROJECT_ID: 'test-project',
            FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
            FIREBASE_MESSAGING_SENDER_ID: '123456789',
            FIREBASE_APP_ID: '1:123456789:web:abcdef123456',
            FIREBASE_MEASUREMENT_ID: 'G-ABCDEF123456',
        },
    };
}

// Set Node.js environment variables as fallback
process.env.FIREBASE_API_KEY = 'test-api-key';
process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
process.env.FIREBASE_PROJECT_ID = 'test-project';
process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
process.env.FIREBASE_MESSAGING_SENDER_ID = '123456789';
process.env.FIREBASE_APP_ID = '1:123456789:web:abcdef123456';
process.env.FIREBASE_MEASUREMENT_ID = 'G-ABCDEF123456';

// 2. Mock Firebase modules using vi.mock at the top level
vi.mock('firebase/app', () => ({
	initializeApp: vi.fn().mockReturnValue({}),
	getApps: vi.fn().mockReturnValue([]),
	getApp: vi.fn().mockReturnValue({}),
}));

vi.mock('firebase/auth', () => ({
	getAuth: vi.fn(() => ({}))
}));

vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({ id: 'mock-collection' })),
    doc: vi.fn(() => ({ id: 'mock-doc' })),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    query: vi.fn(() => ({ id: 'mock-query' })),
    where: vi.fn(() => ({ id: 'mock-where' })),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
}));

console.log('✅ Entorno de pruebas de Firebase simulado globalmente.');

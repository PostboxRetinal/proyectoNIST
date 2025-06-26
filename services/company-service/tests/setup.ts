// services/company-service/tests/setup.ts (NUEVO ARCHIVO)

import { vi } from 'vitest';

/**
 * ARCHIVO DE CONFIGURACIÓN GLOBAL PARA PRUEBAS
 *
 * Se carga ANTES que todos los tests gracias a la opción `setupFiles` en `vitest.config.ts`.
 * Su propósito es preparar un entorno de pruebas simulado (mocked).
 */

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

// 2. Mockeamos las librerías CORE de Firebase para prevenir la inicialización real.
// Esto previene el error 'auth/invalid-api-key' de forma definitiva.
vi.mock('firebase/app', () => ({
	initializeApp: vi.fn().mockReturnValue({}),
	getApps: vi.fn().mockReturnValue([]),
	getApp: vi.fn().mockReturnValue({}),
}));

vi.mock('firebase/auth', () => ({
	getAuth: vi.fn(() => ({}))
}));

// 3. Mockeamos la LIBRERÍA 'firebase/firestore' para controlar sus funciones.
vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
}));

// 4. Mock the Firebase configuration file directly to prevent validation errors
vi.mock('../src/firebase/firebase.ts', () => ({
    auth: {},
    db: {},
    validateFirebaseConfig: vi.fn(),
}));

console.log('✅ Entorno de pruebas de Firebase simulado globalmente.');

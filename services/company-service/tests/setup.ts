// services/company-service/tests/setup.ts (NUEVO ARCHIVO)

import { vi } from 'vitest';

/**
 * ARCHIVO DE CONFIGURACIÓN GLOBAL PARA PRUEBAS
 *
 * Se carga ANTES que todos los tests gracias a la opción `setupFiles` en `vitest.config.ts`.
 * Su propósito es preparar un entorno de pruebas simulado (mocked).
 */

// 1. Mockeamos las librerías CORE de Firebase para prevenir la inicialización real.
// Esto previene el error 'auth/invalid-api-key' de forma definitiva.
vi.mock('firebase/app', () => ({
	initializeApp: vi.fn().mockReturnValue({}),
	getApps: vi.fn().mockReturnValue([]),
	getApp: vi.fn().mockReturnValue({}),
}));

vi.mock('firebase/auth', () => ({
	getAuth: vi.fn(() => ({}))
}));

// 2. Mockeamos la LIBRERÍA 'firebase/firestore' para controlar sus funciones.
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

// 3. Mock para el entorno de Bun
if (typeof global.Bun === 'undefined') {
    // @ts-expect-error Bun is not available in the test environment, so we mock it
    global.Bun = {
        env: process.env,
    };
}

console.log('✅ Entorno de pruebas de Firebase simulado globalmente.');

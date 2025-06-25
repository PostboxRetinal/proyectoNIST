// services/company-service/tests/setup.ts (NUEVO ARCHIVO)

import { vi } from 'vitest';

/**
 * ARCHIVO DE CONFIGURACIÓN GLOBAL PARA PRUEBAS
 *
 * Se carga ANTES que todos los tests gracias a la bandera --preload.
 * Su propósito es preparar un entorno de pruebas simulado (mocked).
 */

// 1. Mockeamos NUESTRO PROPIO módulo de firebase para evitar la inicialización real.
// ESTO ES LO MÁS IMPORTANTE PARA PREVENIR EL ERROR 'auth/invalid-api-key'.
vi.mock('../src/firebase/firebase', () => ({
	db: {}, // Un objeto vacío para la base de datos
	auth: {}, // Un objeto vacío para la autenticación
}));

// 2. Mockeamos la LIBRERÍA 'firebase/firestore' para controlar sus funciones.
// NO usamos vi.mocked, usamos vi.fn() para crear funciones simuladas vacías.
vi.mock('firebase/firestore', () => ({
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

console.log('✅ Entorno de pruebas de Firebase simulado globalmente.');

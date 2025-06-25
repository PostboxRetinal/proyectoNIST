import { vi } from 'vitest';
import * as firestore from 'firebase/firestore';

/*
 * ARCHIVO DE CONFIGURACIÓN GLOBAL PARA PRUEBAS
 * Este archivo se carga ANTES que todos los tests.
 * Usamos vi.spyOn para interceptar y simular (mock) las funciones de Firestore
 * de forma global, evitando dependencias circulares.
 */

// Damos una implementación por defecto para que las funciones no fallen.
// En las pruebas específicas, podemos sobreescribir este comportamiento.
vi.spyOn(firestore, 'getDocs').mockResolvedValue({
	empty: true,
	docs: [],
} as any);
vi.spyOn(firestore, 'setDoc').mockResolvedValue(undefined);
vi.spyOn(firestore, 'getDoc').mockResolvedValue({
	exists: () => false,
	data: () => ({}),
} as any);
vi.spyOn(firestore, 'updateDoc').mockResolvedValue(undefined);
vi.spyOn(firestore, 'deleteDoc').mockResolvedValue(undefined);

// Las funciones que se encadenan (como query, where, etc.) se mockean para que no fallen.
vi.spyOn(firestore, 'collection').mockImplementation(() => ({} as any));
vi.spyOn(firestore, 'query').mockImplementation(() => ({} as any));
vi.spyOn(firestore, 'where').mockImplementation(() => ({} as any));
vi.spyOn(firestore, 'doc').mockImplementation(() => ({} as any));

console.log('✅ Mocks globales de Firestore cargados para las pruebas.');
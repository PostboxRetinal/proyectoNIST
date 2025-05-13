import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase, utilizando variables de entorno
const firebaseConfig = {
	apiKey: Bun.env.FIREBASE_API_KEY,
	authDomain: Bun.env.FIREBASE_AUTH_DOMAIN,
	projectId: Bun.env.FIREBASE_PROJECT_ID,
	storageBucket: Bun.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: Bun.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: Bun.env.FIREBASE_APP_ID,
	measurementId: Bun.env.FIREBASE_MEASUREMENT_ID, 
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Exportar auth para autenticación
export const db = getFirestore(app); // Exportar db para Firestore

// Función para validar la configuración de Firebase
export function validateFirebaseConfig() {
	// Valida que todas las variables estén presentes
	for (const [key, value] of Object.entries(firebaseConfig)) {
		if (!value) {
			throw new Error(`Missing Firebase var: ${key}`);
		}
	}
	console.log(`Valid Firebase config for forms-manager service 😎`);
}

// Ejecutar validación al inicializar
validateFirebaseConfig();

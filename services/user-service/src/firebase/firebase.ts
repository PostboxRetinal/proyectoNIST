// firebase.ts
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
  measurementId: Bun.env.FIREBASE_MEASUREMENT_ID, // Si tienes este ID
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Exportar auth para autenticación
export const db = getFirestore(app); // Exportar db para Firestore

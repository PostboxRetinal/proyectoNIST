// ...existing code from previous backend
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
	apiKey: Bun.env.FIREBASE_API_KEY,
	authDomain: Bun.env.FIREBASE_AUTH_DOMAIN,
	projectId: Bun.env.FIREBASE_PROJECT_ID,
	storageBucket: Bun.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: Bun.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: Bun.env.FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

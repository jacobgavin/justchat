import { initializeApp, getApp } from "firebase/app";

const createFirebaseApp = (config = {}) => {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
};

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

export const app = createFirebaseApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

//@ts-ignore
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
  signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase, ref, set } from 'firebase/database';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { Platform } from 'react-native';

import * as schema from './classes';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DB_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const functions = getFunctions(app);

const auth = initializeAuth(app, {
  persistence:
    Platform.OS === 'web'
      ? browserLocalPersistence
      : getReactNativePersistence(ReactNativeAsyncStorage),
});

if (__DEV__) {
  connectDatabaseEmulator(db, '127.0.0.1', 9000);
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
}

export { app, auth, db, functions };

export function writeUserData(name: string, email: string, phone_number: string) {
  const db = getDatabase();
  const emailparts = email.split('.');
  const filteredemail = emailparts[0] + ':' + emailparts[1];
  const postListRef = ref(db, 'housemates/' + filteredemail);
  const user = new schema.Housemate(email, name, email, phone_number);
  set(postListRef, {
    name: user.name,
    email: user.email,
    phone_number: user.phone_number,
    houses: user.house_ids,
  });
}

export async function createUser(
  name: string,
  phone_number: string,
  email: string,
  password: string,
) {
  return createUserWithEmailAndPassword(auth, email, password).then(() => {
    writeUserData(name, email, phone_number);
  });
}

export function userSignIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function userSignOut() {
  return signOut(auth);
}

export function getCurrentUser() {
  const user = auth.currentUser;
  return user;
}

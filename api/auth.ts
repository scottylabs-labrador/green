import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

import { auth, functions } from './firebase';

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getUserIdFromEmail(email: string) {
  return email.split('.').join(':');
}

export function getEmailFromUserId(userId: string) {
  return userId.split(':').join('.');
}

export async function createUser(
  name: string,
  phoneNumber: string,
  email: string,
  password: string,
) {
  await createUserWithEmailAndPassword(auth, email, password);
  const fn = httpsCallable<{
    userId: string, 
    name: string, 
    email: string, 
    phoneNumber: string,
    houses: string[]
  }, null>(functions, 'writeUser');

  const userId = getUserIdFromEmail(email);
  const houses: string[] = [];
  await fn({ userId, name, email, phoneNumber, houses });
}

export async function updateUser(
  userId: string, 
  name: string,
) {
  const fn = httpsCallable<{
    userId: string, 
    name: string, 
  }, null>(functions, 'updateUser');

  await fn({ userId, name });
}

export async function updateUserColor(
  userId: string,
  houseId: string, 
  color: string,
) {
  const fn = httpsCallable<{
    userId: string,
    houseId: string, 
    color: string,
  }, null>(functions, 'updateUserColor');

  await fn({ userId, houseId, color });
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

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';

import { auth, db, functions } from './firebase';

export async function createUser(
  name: string,
  phoneNumber: string,
  email: string,
  password: string,
) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const fn = httpsCallable<{
    userId: string, 
    name: string, 
    email: string, 
    phoneNumber: string,
    houses: string[]
  }, null>(functions, 'writeUser');

  const userId = user.uid;
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

export async function getUserName(userId: string) {
  const housemateRef = ref(db, `housemates/${userId}/name`);
  const snap = await get(housemateRef);
  if (snap.exists()) {
    return snap.val();
  }

  throw new Error('No user found');
}

export async function getUserEmail(userId: string) {
  const fn = httpsCallable<{
    userId: string,
  }, {email: string}>(functions, 'getUserEmail');

  const result = await fn({ userId });
  return result.data.email;
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

import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';

import { auth, db, functions } from './firebase';

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  if (!email || !password || !name) {
    throw new Error('Please fill missing fields.');
  }

  // check password is minimum length
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  let user;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    user = userCredential.user;

    await sendEmailVerification(user);

    await updateProfile(user, {
      displayName: name
    });
  } catch (err) {
    console.error("Signup error:", err);
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          throw new Error('The email address is already in use by another account.');
        case 'auth/invalid-email':
          throw new Error('The email address is not valid.');
        case 'auth/operation-not-allowed':
          throw new Error('Email/password accounts are not enabled.');
        case 'auth/weak-password':
          throw new Error('The password is too weak.');
        case 'auth/too-many-requests':
          throw new Error('Too many requests. Please try again later.');
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your connection and try again.');
        default:
          throw new Error('An unexpected error occurred. Please try again later.');
      }
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }

  const fn = httpsCallable<{
    userId: string, 
    name: string, 
    email: string, 
    houses: string[]
  }, null>(functions, 'writeUser');

  const userId = user.uid;
  const houses: string[] = [];

  try {
    await fn({ userId, name, email, houses });
  } catch (err) {
    console.error("Error creating user:", err);
    throw new Error('Failed to create user data. Please try again.');
  }
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

export async function userSignIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (err) {
    console.log('Login error:', err);
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'auth/user-not-found':
          throw new Error('No user found with this email.');
        case 'auth/wrong-password':
          throw new Error('Incorrect password. Please try again.');
        case 'auth/invalid-email':
          throw new Error('The email address is not valid.');
        case 'auth/email-already-in-use':
          throw new Error('The email address is already in use by another account.');
        case 'auth/network-request-failed':
          throw new Error('Network error. Please check your connection and try again.');
        default:
          throw new Error('An unexpected error occurred. Please try again later.');
      }
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
}

export function userSignOut() {
  try {
    signOut(auth);
  } catch (err) {
    console.error("Error when signing out:", err);
    throw new Error('An unexpected error occurred. Please try again later.')
  }
}

export async function userPasswordResetEmail(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    console.error("Send password reset email error:", err);
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'auth/invalid-email':
          return;
        case 'auth/user-not-found':
          return;
        case 'auth/missing-email':
          throw new Error('Please enter your email address');
        default:
          throw new Error('An unexpected error occurred. Please try again later.');
      }
    } else {
      throw new Error('An unexpected error occurred. Please try again later.');
    }
  }
}

export async function userVerifyEmail(user: User) {
  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.error("Send email verification error:", err);
    throw new Error('An unexpected error occurred. Please try again later.');
  }
}
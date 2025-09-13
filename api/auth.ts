import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

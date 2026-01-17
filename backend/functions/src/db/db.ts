import * as admin from 'firebase-admin';

export function setTyped<T>(path: string, value: T): Promise<void> {
  const db = admin.database();
  return db.ref(path).set(value);
}

export function pushTyped<T>(path: string, value: T): Promise<admin.database.Reference> {
  const db = admin.database();
  const ref = db.ref(path).push();
  return ref.set(value).then(() => ref);
}

export function updateTyped<T extends object>(path: string, value: Partial<T>) {
  const db = admin.database();
  return db.ref(path).update(value);
}

export async function exists(path: string): Promise<boolean> {
  const db = admin.database();
  const snapshot = await db.ref(path).get();
  return snapshot.exists();
}

export async function get(path: string) {
  const db = admin.database();
  const snapshot = await db.ref(path).get();
  
  if (!snapshot.exists()) {
    throw new Error(`Cannot access path ${path}`);
  }

  return snapshot.val();
}

export function remove(path: string): Promise<void> {
  const db = admin.database();
  return db.ref(path).remove();
}

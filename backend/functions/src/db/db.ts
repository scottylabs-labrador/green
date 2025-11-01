import * as admin from 'firebase-admin';
import { DataSnapshot } from 'firebase-admin/database';

export function setTyped<T>(path: string, value: T): Promise<void> {
  const db = admin.database();
  return db.ref(path).set(value);
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
  return snapshot.val();
}

export async function deleteData(path: string): Promise<void> {
  const db = admin.database();
  await db.ref(path).remove();
}

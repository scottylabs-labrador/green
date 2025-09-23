import * as admin from "firebase-admin";

export function setTyped<T>(path: string, value: T): Promise<void> {
  const db = admin.database();
  return db.ref(path).set(value);
}

export function updateTyped<T extends object>(path: string, value: Partial<T>) {
  const db = admin.database();
  return db.ref(path).update(value);
}

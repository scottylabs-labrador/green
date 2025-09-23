import {
  get as fbGet,
  getDatabase,
  ref
} from "firebase/database";

export async function getTyped<T>(path: string): Promise<T | null> {
  const db = getDatabase();
  const r = ref(db, path);
  const snap = await fbGet(r);
  if (!snap.exists()) return null;
  return snap.val() as T;
}

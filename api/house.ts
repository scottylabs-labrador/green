import * as Crypto from 'expo-crypto';
import { get, ref, set, update } from 'firebase/database';
import * as schema from './classes';
import { db } from './firebase';

export async function createInviteCode(houseId: string): Promise<string> {
  const randomBytes = Crypto.getRandomBytes(4);
  const token = Array.from(randomBytes)
    .map(b => b.toString(36).padStart(2, '0'))
    .join('');

  const now = Date.now();
  const expiresAt = now + 1000 * 60 * 60 * 24;

  await set(ref(db, `invites/${token}`), {
    houseId,
    createdAt: now,
    expiresAt,
  });

  return token;
}

export async function getHouseIdFromInvite(inviteToken: string): Promise<string> {
  const inviteRef = ref(db, `invites/${inviteToken}`);
  const snap = await get(inviteRef);

  if (!snap.exists()) throw new Error('Invalid or expired invite');
  const invite = snap.val();

  if (invite.expiresAt < Date.now()) throw new Error('Invite expired');

  const houseId = invite.houseId;
  return houseId;
}

export async function joinHouseWithInvite(houseId: string, userId: string, color: string) {// 1. Get current user name
  const nameSnap = await get(ref(db, `housemates/${userId}/name`));
  const name = nameSnap.exists() ? nameSnap.val() : 'Unknown';
  
  const housesRef = ref(db, `housemates/${userId}/houses`);
  const housesSnap = await get(housesRef);
  let houses = housesSnap.exists() ? housesSnap.val() : [];
  
  if (!houses.includes(houseId)) {
    houses.push(houseId);
  }
  
  await update(ref(db), {
    [`houses/${houseId}/members/${userId}`]: {
      name,
      color,
    },
    [`housemates/${userId}/houses`]: houses
  });
}

export async function getHouseNameFromId(houseId: string) {
  const houseRef = ref(db, `house/${houseId}/name`);
  const snap = await get(houseRef);

  if (snap.exists()) {
    return snap.val()
  }

  return ""
}

export function writeHouseData(name: string, housecode: string, groceryListId: string) {
  const house = new schema.House(name);
  const postListRef = ref(db, 'houses/' + housecode);
  set(postListRef, {
    name: house.name,
    members: house.members,
    grocerylist: groceryListId,
  });
  return postListRef;
}

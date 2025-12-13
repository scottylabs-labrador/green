import { House } from '@db/types';
import { get, onValue, ref } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';

import { db, functions } from './firebase';

export async function createInviteCode(houseId: string) {
  const existingInviteRef = ref(db, `houses/${houseId}/invite`);
  const existingInviteSnap = await get(existingInviteRef);

  // Generate new invite if none has been generated
  if (!existingInviteSnap.exists) {
    const fn = httpsCallable<{ houseId: string }, { token: string }>(functions, 'createInviteCode');
    const result = await fn({ houseId });
    return result.data.token;
  }

  const existingInvite = existingInviteSnap.val();
  const inviteRef = ref(db, `invites/${existingInvite}`);
  const inviteSnap = await get(inviteRef);

  // Generate new invite if last has expired
  if (!inviteSnap.exists() || inviteSnap.val().expiresAt < Date.now()) {
    const fn = httpsCallable<{ houseId: string }, { token: string }>(functions, 'createInviteCode');
    const result = await fn({ houseId });
    return result.data.token;
  }

  return existingInvite;
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

export async function joinHouse(houseId: string, userId: string, color: string) {
  const fn = httpsCallable<{ 
    houseId: string, 
    userId: string, 
    color: string
  }, null>(functions, 'joinHouse');

  await fn({ houseId, userId, color });
}

export async function getHouseId(userId: string) {
  const housemateRef = ref(db, `housemates/${userId}/houses`);
  const snap = await get(housemateRef);

  if (snap.exists()) {
    const houses: string[] = snap.val();
    if (houses.length > 0) return houses[0]; // Return the first house ID
  }

  throw new Error('No house found');
}

export async function getHouseIds(userId: string) {
  const housemateRef = ref(db, `housemates/${userId}/houses`);
  const snap = await get(housemateRef);

  if (snap.exists()) {
    const houses: string[] = snap.val();
    if (houses.length > 0) return houses;
  }

  throw new Error('No houses found');
}

export async function getHouseNameFromId(houseId: string) {
  const houseRef = ref(db, `houses/${houseId}/name`);
  const snap = await get(houseRef);

  if (snap.exists()) {
    return snap.val();
  }

  throw new Error('No house found');
}

export async function getHouseNameFromServer(houseId: string) {
  const fn = httpsCallable<{ houseId: string }, { houseName: string }>(functions, 'getHouseNameFromServer');
  const result = await fn({ houseId });
  return result.data.houseName;
}

export function listenForHouseInfo(houseId: string, callback: (house: House) => void) {
  const houseRef = ref(db, `houses/${houseId}`);

  const unsubscribe = onValue(houseRef, snapshot => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    } else {
      console.log("no house found for id:", houseId);
      throw new Error('No house found');
    }
  });

  return unsubscribe;
}

export async function writeHouse(name: string, houseId: string, groceryListId: string) {
  const fn = httpsCallable<{ 
    name: string, 
    houseId: string, 
    groceryListId: string,
  }, null>(functions, 'writeHouse');

  await fn({ name, houseId, groceryListId });
}

export async function updateHouseName(name: string, houseId: string) {
  const fn = httpsCallable<{ 
    name: string, 
    houseId: string, 
  }, null>(functions, 'updateHouseName');

  await fn({ name, houseId });
}

export async function updateOwner(houseId: string, newOwnerId: string) {
  const fn = httpsCallable<{ 
    houseId: string, 
    newOwnerId: string, 
  }, null>(functions, 'updateOwner');

  await fn({ houseId, newOwnerId });
}

export async function removeMember(houseId: string, userId: string) {
  const fn = httpsCallable<{ 
    houseId: string, 
    userId: string, 
  }, null>(functions, 'removeMember');

  await fn({ houseId, userId });
}

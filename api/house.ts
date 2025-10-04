import { get, ref } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';

import { db, functions } from './firebase';

export async function createInviteCode(houseId: string) {
  const fn = httpsCallable<{ houseId: string }, { token: string }>(functions, 'createInviteCode');

  const result = await fn({ houseId });
  return result.data.token;
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

export async function joinHouseWithInvite(houseId: string, userId: string, color: string) {
  const nameSnap = await get(ref(db, `housemates/${userId}/name`));
  const name = nameSnap.exists() ? nameSnap.val() : 'Unknown';

  const housesRef = ref(db, `housemates/${userId}/houses`);
  const housesSnap = await get(housesRef);
  let houses = housesSnap.exists() ? housesSnap.val() : [];

  if (!houses.includes(houseId)) {
    houses.push(houseId);
  }

  const fn = httpsCallable<{ 
    houseId: string, 
    userId: string, 
    color: string, 
    houses: string[], 
    name: string 
  }, null>(functions, 'joinHouseWithInvite');

  await fn({ houseId, userId, color, houses, name });
}

export async function getHouseNameFromId(houseId: string) {
  const houseRef = ref(db, `house/${houseId}/name`);
  const snap = await get(houseRef);

  if (snap.exists()) {
    return snap.val();
  }

  return '';
}

export async function writeHouse(name: string, houseId: string, groceryListId: string) {
  // const house = new schema.House(name);
  // const postListRef = ref(db, 'houses/' + housecode);
  // await set(postListRef, {
  //   name: house.name,
  //   members: house.members,
  //   grocerylist: groceryListId,
  // });
  // return postListRef;
  const fn = httpsCallable<{ 
    name: string, 
    houseId: string, 
    groceryListId: string,
  }, null>(functions, 'writeHouse');

  await fn({ name, houseId, groceryListId });
}

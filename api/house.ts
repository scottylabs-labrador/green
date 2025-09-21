import { get, ref, set, update } from 'firebase/database';
import { httpsCallable } from "firebase/functions";
import { Platform } from "react-native";
import * as schema from './classes';
import { auth, db, functions } from "./firebase";

export async function createInviteCode(houseId: string) {
  if (Platform.OS === "web") {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const idToken = await user.getIdToken(true);

    const res = await fetch(
      "http://localhost:5001/green-2c431/us-central1/createInviteCode",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ houseId }),
      }
    );

    if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
    const data = await res.json();
    return data.token as string;
  } else {
    // Mobile: call emulator via onCall
    const fn = httpsCallable<{ houseId: string }, { token: string }>(
      functions,
      "createInviteCodeCallable"
    );
    const result = await fn({ houseId });
    return result.data.token;
  }
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

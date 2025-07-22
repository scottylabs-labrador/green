import { ref, get, update, set } from 'firebase/database';
import { db } from './firebase';
import * as Crypto from 'expo-crypto';

export async function createInviteLink(houseId: string): Promise<string> {
  const randomBytes = Crypto.getRandomBytes(16);
  const token = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');

  const now = Date.now();
  const expiresAt = now + 1000 * 60 * 60 * 24; // expires in 24 hours

  await set(ref(db, `invites/${token}`), {
    houseId,
    createdAt: now,
    expiresAt,
    usedBy: null
  });

  return `green://join?invite=${token}`;
}

export async function joinGroupWithInvite(inviteToken: string, userId: string): Promise<string> {
  const inviteRef = ref(db, `invites/${inviteToken}`);
  const snap = await get(inviteRef);

  if (!snap.exists()) throw new Error("Invalid or expired invite");
  const invite = snap.val();

  if (invite.expiresAt < Date.now()) throw new Error("Invite expired");
  if (invite.usedBy) throw new Error("Already used");

  const groupId = invite.groupId;

  await update(ref(db), {
    [`groups/${groupId}/members/${userId}`]: true,
    [`users/${userId}/groups/${groupId}`]: true,
    [`invites/${inviteToken}/usedBy`]: userId,
  });

  return groupId;
}
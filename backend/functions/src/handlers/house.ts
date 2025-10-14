import * as crypto from 'crypto';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';

import { setTyped, updateTyped } from '../db/db';
import type { House, Invite, Member } from '../db/types';

export const createInviteCode = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ houseId: string }>) => {
    const { houseId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }

    const randomBytes = crypto.randomBytes(4);
    const token = Array.from(randomBytes)
      .map(b => b.toString(36).padStart(2, '0'))
      .join('');

    const now = Date.now();
    const expiresAt = now + 1000 * 60 * 60 * 24; // expires in a day

    const invite: Invite = {
      houseId,
      createdAt: now,
      expiresAt,
    };
    await setTyped<Invite>(`invites/${token}`, invite);

    return { token };
  },
);

export const deleteExpiredInviteCodes = onSchedule('every 24 hours', async () => {
  const now = Date.now();
  const db = admin.database();``

  const itemsRef = db.ref(`invites`);

  const snapshot = await itemsRef.orderByChild('expiresAt').endAt(now).once('value');

  const updates: Record<string, null> = {};
  if (snapshot.exists()) {
    snapshot.forEach((child) => {
      updates[child.key] = null;
    })
  }

  if (Object.keys(updates).length > 0) {
    await itemsRef.update(updates);
  }
});

export const joinHouseWithInvite = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ houseId: string, userId: string, color: string, houses: string[], name: string }>) => {
    const { houseId, userId, color, houses, name } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'userId is required');
    }
    if (!color) {
      throw new functions.https.HttpsError('invalid-argument', 'color is required');
    }
    if (!houses) {
      throw new functions.https.HttpsError('invalid-argument', 'houses is required');
    }
    if (!name) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required');
    }

    const user: Member = {
      name: name,
      color: color,
    }

    await updateTyped<Member>(`houses/${houseId}/members/${userId}`, user);
    await updateTyped<string[]>(`housemates/${userId}/houses`, houses);
    
    return null;
  },
)

export const writeHouse = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ name: string, houseId: string, groceryListId: string }>) => {
    const { name, houseId, groceryListId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!name) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required');
    }
    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    if (!groceryListId) {
      throw new functions.https.HttpsError('invalid-argument', 'groceryListId is required');
    }

    const house: House = {
      name: name, 
      members: {},
      grocerylist: groceryListId, 
      receipts: {}
    }
    await setTyped<House>(`houses/${houseId}`, house);
    
    return null;
  },
)

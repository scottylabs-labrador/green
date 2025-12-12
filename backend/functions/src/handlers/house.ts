import * as crypto from 'crypto';

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';

import { get, remove, setTyped, updateTyped } from '../db/db';
import type { House, Invite, Member } from '../db/types';
import { isValidHexColor, userInHouse } from '../validation/verify';

export const createInviteCode = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ houseId: string }>) => {
    const { houseId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    if (!(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('permission-denied', 'You must be a member of the house to create an invite code');
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
    await setTyped<string>(`houses/${houseId}/invite`, token);

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

export const joinHouse = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ houseId: string, userId: string, color: string }>) => {
    const { houseId, userId, color } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!userId || userId !== request.auth.uid) {
      throw new functions.https.HttpsError('invalid-argument', 'userId is required and must match authenticated user');
    }

    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }

    if (!color || !isValidHexColor(color)) {
      throw new functions.https.HttpsError('invalid-argument', 'color is required');
    }

    let name: string;

    try {
      name = await get(`housemates/${userId}/name`);
      if (!name) {
        throw new functions.https.HttpsError('invalid-argument', 'User name not found');
      }
    } catch {
      throw new functions.https.HttpsError('invalid-argument', 'User name not found');
    }

    let houses: string[];

    try {
      const housesRef = await get(`housemates/${userId}/houses`);
      houses = housesRef ? housesRef : [];
      if (!houses.includes(houseId)) {
        houses.push(houseId);
      }
    } catch {
      houses = [houseId];
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

    if (!name || name.trim().length === 0 || name.length > 30) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required and must be between 1 and 30 characters');
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
      receipts: {}, 
      invite: '',
      owner: request.auth.uid,
    }
    await setTyped<House>(`houses/${houseId}`, house);
    
    return null;
  },
)

export const updateHouseName = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ name: string, houseId: string }>) => {
    const { name, houseId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!name || name.trim().length === 0 || name.length > 30) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required and must be between 1 and 30 characters');
    }
    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    if (!(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('permission-denied', 'You must be a member of the house to update the house name');
    }

    const groceryListId = await get(`houses/${houseId}/grocerylist`);

    await setTyped<string>(`houses/${houseId}/name`, name);
    await setTyped<string>(`grocerylists/${groceryListId}/name`, name);
    
    return null;
  },
)

export const getHouseNameFromServer = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ houseId: string }>) => {
    const { houseId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }
    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }

    try {
      const houseName = await get(`houses/${houseId}/name`);
      return { houseName };
    } catch (err) {
      console.error('Error getting house name:', err);
      throw new functions.https.HttpsError('not-found', 'No house found');
    }
  },
);

export const updateOwner = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ houseId: string, newOwnerId: string }>) => {
    const { houseId, newOwnerId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    if (!newOwnerId || !(await userInHouse(newOwnerId, houseId))) {
      throw new functions.https.HttpsError('invalid-argument', 'newOwnerId is required');
    }

    let currentOwnerId: string;

    try {
      currentOwnerId = await get(`houses/${houseId}/owner`);
    } catch (err) {
      console.error('Error getting house owner:', err);
      throw new functions.https.HttpsError('internal', 'Internal error occurred');
    }

    if (currentOwnerId !== request.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Only the current owner can transfer ownership');
    }
    await setTyped<string>(`houses/${houseId}/owner`, newOwnerId);
    
    return null;
  },
);

export const removeMember = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ houseId: string, userId: string }>) => {
    const { houseId, userId } = request.data;
    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    let ownerId: string;

    try {
      ownerId = await get(`houses/${houseId}/owner`);
    } catch (err) {
      console.error('Error getting house owner:', err);
      ownerId = '';
    }
    
    if (ownerId === userId) {
      throw new functions.https.HttpsError('invalid-argument', 'House owner cannot leave the house');
    }

    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'userId is required');
    }
    if (userId !== request.auth.uid && ownerId !== request.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'You can only remove yourself from a house');
    }

    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    await remove(`houses/${houseId}/members/${userId}`);
    
    let houses: string[];
    try {
      const housesRef = await get(`housemates/${userId}/houses`);
      houses = housesRef ? housesRef : [];
      houses = houses.filter(hId => hId !== houseId);
    } catch (err) {
      console.error('Error getting user houses:', err);
      houses = [];
    }

    await setTyped<string[]>(`housemates/${userId}/houses`, houses);
    
    return null;
  },
);

export const deleteHouse = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ houseId: string }>) => {
    const { houseId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }

    try {
      const ownerId = await get(`houses/${houseId}/owner`);
      if (ownerId !== request.auth.uid) {
        throw new functions.https.HttpsError('permission-denied', 'Only the house owner can delete the house');
      }
    } catch (err) {
      console.error('Error getting house owner:', err);
      throw new functions.https.HttpsError('internal', 'Internal error occurred');
    }

    try {
      const membersSnap = await get(`houses/${houseId}/members`);
      if (membersSnap) {
        const memberIds = Object.keys(membersSnap);
        for (const memberId of memberIds) {
          let houses: string[];
          try {
            const housesRef = await get(`housemates/${memberId}/houses`);
            houses = housesRef ? housesRef : [];
            houses = houses.filter(hId => hId !== houseId);
          } catch (err) {
            console.error(`Error getting houses for member ${memberId}:`, err);
            houses = [];
          }
          await setTyped<string[]>(`housemates/${memberId}/houses`, houses);
        }
      }
    } catch (err) {
      console.error('Error getting house members:', err);
    }

    await remove(`houses/${houseId}`);
    
    return null;
  },
);
    

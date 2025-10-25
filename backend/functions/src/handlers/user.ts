import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { onValueUpdated } from 'firebase-functions/v2/database';

import { setTyped } from '../db/db';
import type { Housemate } from '../db/types';


export const writeUser = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ userId: string, name: string, email: string, phoneNumber: string, houses: string[] }>) => {
    const { userId, name, email, phoneNumber, houses } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!userId || !name || !email || !phoneNumber || !houses ) {
      throw new functions.https.HttpsError('invalid-argument', 'all arguments are required');
    }

    const user: Housemate = {
      name, 
      email, 
      phoneNumber, 
      houses,
    }
    await setTyped<Housemate>(`housemates/${userId}`, user);

    return null;
  },
);

export const updateUser = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ userId: string, name: string }>) => {
    const { userId, name } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'userId is required');
    }
    if (!name) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required');
    }
    if (name.length < 1) {
      throw new functions.https.HttpsError('invalid-argument', 'name must have length at least 1');
    }

    await setTyped<String>(`housemates/${userId}/name`, name);

    return null;
  }
);

export const syncUserName = onValueUpdated(`housemates/{userId}`, 
  async (event) => {
    const beforeName = event.data.before.child('name').val();
    const afterName = event.data.after.child('name').val();
    const userId = event.params.userId;

    if (beforeName.name !== afterName) {
      const userHousesRef = event.data.after.child('houses');
      const houseIds = userHousesRef.exists() ? userHousesRef.val() : [];

      const updates: { [key: string]: string } = {};
      houseIds.forEach((houseId: string) => {
        updates[`houses/${houseId}/members/${userId}/name`] = afterName;
      });

      try {
        await admin.database().ref().update(updates);
      } catch (error) {
        console.error("Failed to update user name in houses:", error);
        throw new functions.https.HttpsError('internal', `Failed to update name in house`);
      }
    }
  }
)

export const updateUserColor = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ userId: string, houseId: string, color: string }>) => {
    const { userId, houseId, color } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'userId is required');
    }
    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    if (!color) {
      throw new functions.https.HttpsError('invalid-argument', 'color is required');
    }

    setTyped<string>(`houses/${houseId}/members/${userId}/color`, color);

    return null;
  }
);
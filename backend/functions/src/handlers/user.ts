import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { onValueUpdated } from 'firebase-functions/v2/database';

import { setTyped } from '../db/db';
import type { Housemate } from '../db/types';
import { isValidHexColor, userInHouse } from '../validation/verify';

export const writeUser = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ userId: string, name: string, email: string, houses: string[] }>) => {
    const { userId, name, email, houses } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!userId || !name || !email || !houses ) {
      throw new functions.https.HttpsError('invalid-argument', 'all arguments are required');
    }
    if (userId !== request.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'You can only write your own user data');
    }
    if (name.length < 1 || name.length > 30) {
      throw new functions.https.HttpsError('invalid-argument', 'name must have length between 1 and 30');
    }

    const user: Housemate = {
      name, 
      email, 
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

    if (!userId || userId !== request.auth.uid) {
      throw new functions.https.HttpsError('invalid-argument', 'userId is required and must match authenticated user');
    }
    if (!name || name.trim().length < 1 || name.trim().length > 30) {
      throw new functions.https.HttpsError('invalid-argument', 'name is required and must have length between 1 and 30');
    }

    await setTyped<String>(`housemates/${userId}/name`, name);

    const user = await admin.auth().getUser(userId);
    if (user.displayName !== name) {
      await admin.auth().updateUser(userId, { displayName: name });
    }

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
      } catch (err) {
        console.error("Failed to update user name in houses:", err);
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

    if (!userId || userId !== request.auth.uid) {
      throw new functions.https.HttpsError('invalid-argument', 'userId is required and must match authenticated user');
    }
    if (!houseId || !(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    if (!color || !isValidHexColor(color)) {
      throw new functions.https.HttpsError('invalid-argument', 'color is required');
    }

    setTyped<string>(`houses/${houseId}/members/${userId}/color`, color);

    return null;
  }
);

export const getUserEmail = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ userId: string }>) => {
    const { userId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!userId) {
      throw new functions.https.HttpsError('invalid-argument', 'userId is required');
    }

    try {
      const userRecord = await admin.auth().getUser(userId);
      return { email: userRecord.email };
    } catch (err) {
      console.log("Error fetching user email:", err);
      throw new functions.https.HttpsError('not-found', 'User not found');
    }
  }
);
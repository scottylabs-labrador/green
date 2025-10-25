import * as functions from 'firebase-functions';

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
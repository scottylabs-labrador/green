import * as crypto from 'crypto';

import * as functions from 'firebase-functions';

import type { Invite } from '../../../../db/types';
import { setTyped } from '../db/db';

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
    const expiresAt = now + 1000 * 60 * 60 * 24;

    const invite: Invite = {
      houseId,
      createdAt: now,
      expiresAt,
    };
    await setTyped<Invite>(`invites/${token}`, invite);

    return { token };
  },
);

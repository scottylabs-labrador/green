import * as functions from 'firebase-functions';

import { updateTyped } from '../db/db';
import type { Receipt, ReceiptItems, ReceiptRecordInHouse } from '../db/types';

export const writeReceipt = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ receiptId: string, houseId: string, receiptItems: ReceiptItems }>) => {
    const { receiptId, houseId, receiptItems } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!receiptId) {
      throw new functions.https.HttpsError('invalid-argument', 'receiptId is required');
    }
    if (!houseId) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    if (!receiptItems) {
      throw new functions.https.HttpsError('invalid-argument', 'receiptItems is required');
    }

    const currentDate = new Date();

    const receipt: Receipt = {
      date: currentDate.toLocaleDateString(),
      receiptitems: receiptItems
    }
    const receiptRecordInHouse: ReceiptRecordInHouse = {
      date: currentDate.toLocaleDateString()
    }
    await updateTyped<Receipt>(`receipts/${receiptId}`, receipt);
    await updateTyped<ReceiptRecordInHouse>(`houses/${houseId}/receipts/${receiptId}`, receiptRecordInHouse);
    
    return null;
  },
)
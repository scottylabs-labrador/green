import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { updateTyped } from '../db/db';
import type { Receipt, ReceiptItem, ReceiptItems, ReceiptRecordInHouse, Splits } from '../db/types';

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

export const updateReceiptItem = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ 
    receiptId: string, 
    receiptItemId: string, 
    receiptItemName: string,
    groceryItemName: string,
    splits: Splits,
    price: string, 
  }>) => {
    const { receiptId, receiptItemId, receiptItemName, groceryItemName, splits, price } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    const receiptItem: ReceiptItem = {
      groceryItem: groceryItemName, 
      receiptItem: receiptItemName,
      price: price,
      splits: splits
    }
    await updateTyped<ReceiptItem>(`receipts/${receiptId}/receiptitems/${receiptItemId}`, receiptItem);
    
    return null;
  },
)

export const deleteReceiptItem = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ 
    receiptId: string, 
    receiptItemId: string, 
  }>) => {
    const { receiptId, receiptItemId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    const db = admin.database();
    await db.ref(`receipts/${receiptId}/receiptitems/${receiptItemId}`).remove();
    
    return null;
  },
)
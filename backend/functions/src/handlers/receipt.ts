import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { get, updateTyped } from '../db/db';
import type { Receipt, ReceiptItem, ReceiptItems, ReceiptRecordInHouse, Splits } from '../db/types';
import { groceryListInHouse, receiptInHouse, userInHouse } from '../validation/verify';

export const writeReceipt = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ receiptId: string, houseId: string, receiptItems: ReceiptItems, groceryListId: string }>) => {
    const { receiptId, houseId, receiptItems, groceryListId } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    if (!receiptId) {
      throw new functions.https.HttpsError('invalid-argument', 'receiptId is required');
    }
    if (!houseId || !(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('invalid-argument', 'houseId is required');
    }
    if (!groceryListId || !(await groceryListInHouse(groceryListId, houseId))) {
      throw new functions.https.HttpsError('invalid-argument', 'groceryListId is required and must belong to the house');
    }

    const currentDate = new Date();

    const receipt: Receipt = {
      date: currentDate.toLocaleDateString(),
      receiptitems: receiptItems, 
      groceryListId: groceryListId,
      houseId: houseId,
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
    price: number, 
  }>) => {
    const { receiptId, receiptItemId, receiptItemName, groceryItemName, splits, price } = request.data;

    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be logged in');
    }

    const houseId = await get(`receipts/${receiptId}/houseId`);
    if (!houseId || !(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('permission-denied', 'You must be a member of the house to update receipt items');
    }
    if (!receiptId || !(await receiptInHouse(receiptId, houseId))) {
      throw new functions.https.HttpsError('invalid-argument', 'receiptId is required and must belong to the house');
    }

    if (!groceryItemName) {
      throw new functions.https.HttpsError('invalid-argument', 'grocery item name is required');
    }
    if (groceryItemName.trim().length == 0 || groceryItemName.trim().length > 30) {
      throw new functions.https.HttpsError('invalid-argument', 'grocery item name length must be between 1 and 30');
    }
    if (!receiptItemName) {
      throw new functions.https.HttpsError('invalid-argument', 'receipt item name is required');
    }
    if (receiptItemName.trim().length == 0 || receiptItemName.trim().length > 30) {
      throw new functions.https.HttpsError('invalid-argument', 'receipt item name length must be between 1 and 30');
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
    const houseId = await get(`receipts/${receiptId}/houseId`);
    if (!houseId || !(await userInHouse(request.auth.uid, houseId))) {
      throw new functions.https.HttpsError('permission-denied', 'You must be a member of the house to delete receipt items');
    }
    if (!receiptId || !(await receiptInHouse(receiptId, houseId))) {
      throw new functions.https.HttpsError('invalid-argument', 'receiptId is required and must belong to the house');
    }

    const db = admin.database();
    await db.ref(`receipts/${receiptId}/receiptitems/${receiptItemId}`).remove();
    
    return null;
  },
)
import { GroceryItem, GroceryItems, Receipt, ReceiptItems, Splits } from '@db/types';
import { onValue, ref } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import Fuse from 'fuse.js';

import { db, functions } from './firebase';

export const matchWords = (
  userId: string,
  receiptItems: Record<string, string>,
  groceryItems: GroceryItems,
  threshold = 0.3,
): ReceiptItems => {
  console.log("match words");
  const groceryItemsArray = Object.values(groceryItems);
  const fuse = new Fuse<GroceryItem>(groceryItemsArray, {
    keys: ['name'],
    threshold,
  });

  const usedWords = new Set<string>();

  // Match receipt items to grocery items
  const matchedList = Object.keys(receiptItems).map((word) => {
    const results = fuse.search(word);
    const bestMatch = results.find(r => !usedWords.has(r.item.name));

    if (bestMatch) {
      usedWords.add(bestMatch.item.name);
      return {
        receiptItem: word,
        groceryItem: bestMatch.item.name,
        price: parseFloat(receiptItems[word]),
        splits: bestMatch.item.splits,
      };
    }

    // Handle unmatched items
    const splits: Splits = { [userId]: 1 };
    return {
      receiptItem: word,
      groceryItem: '',
      price: parseFloat(receiptItems[word]),
      splits,
    };
  });

  const finalReceiptItems: ReceiptItems = {};
  for (const item of matchedList) {
    const itemId = crypto.randomUUID();
    finalReceiptItems[itemId] = item;
  }

  return finalReceiptItems;
};

export async function writeReceipt(
  receiptId: string,
  houseId: string,
  receiptItems: ReceiptItems,
  groceryListId: string,
) {
  const fn = httpsCallable<{
    receiptId: String, 
    houseId: String, 
    receiptItems: ReceiptItems, 
    groceryListId: string,
  }, null>(functions, 'writeReceipt');

  await fn({ receiptId, houseId, receiptItems, groceryListId });
}

export async function updateReceiptItem(
  receiptId: string,
  receiptItemId: string,
  receiptItemName: string,
  groceryItemName: string,
  splits: Splits,
  price: number,
) {
  const fn = httpsCallable<{
    receiptId: string,
    receiptItemId: string,
    receiptItemName: string,
    groceryItemName: string,
    splits: Splits,
    price: number,
  }, null>(functions, 'updateReceiptItem');

  await fn({ receiptId, receiptItemId, receiptItemName, groceryItemName, splits, price });
}

export async function deleteReceiptItem(receiptId: string, receiptItemId: string) {
  const fn = httpsCallable<{
    receiptId: string,
    receiptItemId: string,
  }, null>(functions, 'deleteReceiptItem');

  await fn({ receiptId, receiptItemId });
}

export function listenForReceipt(receiptId: string, callback: (receipt: Receipt) => void) {
  const receiptRef = ref(db, `receipts/${receiptId}`);

  const unsubscribe = onValue(receiptRef, snapshot => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    } else {
      throw new Error('No receipt found');
    }
  });

  return unsubscribe;
}

import { getDatabase, ref, remove, update } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import Fuse from 'fuse.js';

import { GroceryItem, ReceiptItems, Splits } from '../db/types';

import { functions } from './firebase';

export const matchWords = (
  userEmail: string,
  receiptItems: Record<string, string>,
  groceryListItems: string[],
  groceryItemObjects: GroceryItem[],
  threshold = 0.3,
) => {
  const fuse = new Fuse(groceryListItems, { threshold });
  const usedWords = new Set();
  console.log('userEmail:', userEmail);
  var emailParts = userEmail.split('.');
  var filteredEmail = emailParts[0] + ':' + emailParts[1];

  let listOfItems = Object.keys(receiptItems).map(word => {
    const results = fuse.search(word);
    const bestMatch = results.find(r => !usedWords.has(r.item));

    if (bestMatch) {
      usedWords.add(bestMatch.item);
      let splits: Splits = {};
      for (let i = 0; i < groceryItemObjects.length; i++) {
        if (groceryItemObjects[i].name == bestMatch.item) {
          splits = groceryItemObjects[i].splits;
        }
      }
      return {
        receiptItem: word,
        groceryItem: bestMatch.item,
        price: receiptItems[word],
        splits: splits,
      }; // word is from the receiptItems, bestMatch is from groceryListItems
    }
    let splits: Splits = {};
    splits[filteredEmail] = 1;
    return { receiptItem: word, groceryItem: '', price: receiptItems[word], splits: splits };
  });

  return listOfItems.reduce((obj: ReceiptItems, item: types.ReceiptItem) => {
    let itemId = window.crypto.randomUUID();
    obj[itemId] = item;
    return obj;
  }, {});
};

// https://chatgpt.com/c/67b11891-1e2c-8009-86bf-ee0c7c6b02a8

// matchWords(["apple", "banana", "cherry"], ["aple", "banana", "cherry"])

export async function writeReceipt(
  receiptId: string,
  houseId: string,
  receiptItems: ReceiptItems,
) {
  const fn = httpsCallable<{
    receiptId: String, 
    houseId: String, 
    receiptItems: ReceiptItems
  }, null>(functions, 'writeReceipt');

  await fn({ receiptId, houseId, receiptItems });
}

export function updateReceiptItem(
  receiptId: string,
  receiptItemId: string,
  receiptItemName: string,
  groceryItemName: string,
  splits: Splits,
  price: string,
) {
  const db = getDatabase();
  const updates = {};
  console.log('update receiptItemId: ', receiptItemId);
  updates['/receipts/' + receiptId + '/receiptitems/' + receiptItemId + '/groceryItem'] =
    groceryItemName;
  updates['/receipts/' + receiptId + '/receiptitems/' + receiptItemId + '/splits'] = splits;
  updates['/receipts/' + receiptId + '/receiptitems/' + receiptItemId + '/receiptItem'] =
    receiptItemName;
  updates['/receipts/' + receiptId + '/receiptitems/' + receiptItemId + '/price'] = price;
  return update(ref(db), updates);
}

export function deleteReceiptItem(receiptId: string, receiptItemId: string) {
  const db = getDatabase();
  const itemRef = ref(db, `receipts/${receiptId}/receiptitems/${receiptItemId}`);
  remove(itemRef).catch((error: any) => console.error('Error removing item:', error));
}

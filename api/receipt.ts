import { GroceryItems, Receipt, ReceiptItem, ReceiptItems, Splits } from '@db/types';
import { onValue, ref } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import Fuse from 'fuse.js';

import { db, functions } from './firebase';

export const matchWords = (
  userId: string,
  receiptItems: Record<string, string>,
  groceryItems: GroceryItems,
  threshold = 0.3,
) => {
  let groceryItemNames = [];
  let groceryItemsArray = [];

  for (const itemId in groceryItems) {
    const item = groceryItems[itemId];
    groceryItemNames.push(item.name);
    groceryItemsArray.push(item);
  }

  const fuse = new Fuse(groceryItemNames, { threshold });
  const usedWords = new Set();

  let listOfItems = Object.keys(receiptItems).map(word => {
    const results = fuse.search(word);
    const bestMatch = results.find(r => !usedWords.has(r.item));

    if (bestMatch) {
      usedWords.add(bestMatch.item);
      let splits: Splits = {};
      for (let i = 0; i < groceryItemsArray.length; i++) {
        if (groceryItemsArray[i].name == bestMatch.item) {
          splits = groceryItemsArray[i].splits;
        }
      }
      return {
        receiptItem: word,
        groceryItem: bestMatch.item,
        price: parseFloat(receiptItems[word]),
        splits: splits,
      }; // word is from the receiptItems, bestMatch is from groceryListItems
    }
    let splits: Splits = {};
    splits[userId] = 1;
    return { 
      receiptItem: word, 
      groceryItem: '', 
      price: parseFloat(receiptItems[word]), 
      splits: splits 
    };
  });

  return listOfItems.reduce((obj: ReceiptItems, item: ReceiptItem) => {
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

import { GroceryItem, ReceiptItem, ReceiptItems, Splits } from '@db/types';
import { httpsCallable } from 'firebase/functions';
import Fuse from 'fuse.js';

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
        price: parseFloat(receiptItems[word]),
        splits: splits,
      }; // word is from the receiptItems, bestMatch is from groceryListItems
    }
    let splits: Splits = {};
    splits[filteredEmail] = 1;
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

import { getDatabase, ref, remove, update } from 'firebase/database';
import Fuse from 'fuse.js';

import * as types from '../db/types';

// export const matchWords = (receiptItems, groceryListItems, groceryItemObjects, threshold = 0.3) => {
//     const fuse = new Fuse(Object.keys(receiptItems), { threshold });
//     const usedWords = new Set();

//     let listOfItems = groceryItemObjects.map(groceryItem => {
//         let word = groceryItem.name;
//         const results = fuse.search(word);
//         const bestMatch = results.find(r => !usedWords.has(r.item));

//         if (bestMatch) {
//             usedWords.add(bestMatch.item);
//             let price = 0;
//             for (const receiptItem of Object.keys(receiptItems)) {
//                 if (receiptItem == bestMatch.item) {
//                     price = receiptItems[receiptItem];
//                 }
//             }
//             return { receiptItem: bestMatch.item, groceryItem: word, price: price, splits: groceryItem.splits };
//         }
//         return { receiptItem: "", groceryItem: word, price: 0, splits: groceryItem.splits };
//     });

//     return listOfItems.reduce((obj, item) => {
//         let itemId = window.crypto.randomUUID();
//         obj[itemId] = item;
//         return obj;
//     }, {});
// };

export const matchWords = (
  userEmail: string,
  receiptItems: Record<string, string>,
  groceryListItems: string[],
  groceryItemObjects: types.GroceryItem[],
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
      let splits: types.Splits = {};
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
    let splits: types.Splits = {};
    splits[filteredEmail] = 1;
    return { receiptItem: word, groceryItem: '', price: receiptItems[word], splits: splits };
  });

  return listOfItems.reduce((obj: types.ReceiptItems, item: types.ReceiptItem) => {
    let itemId = window.crypto.randomUUID();
    obj[itemId] = item;
    return obj;
  }, {});
};

// https://chatgpt.com/c/67b11891-1e2c-8009-86bf-ee0c7c6b02a8

// matchWords(["apple", "banana", "cherry"], ["aple", "banana", "cherry"])

export function writeMatches(
  receiptId: string,
  houseCode: string,
  receiptItems: types.ReceiptItems,
) {
  const db = getDatabase();
  //   const postReceiptRef = ref(db, 'receipts/' + receiptId);
  //   set(postReceiptRef, {
  //     receiptitems: receiptItems
  //   });
  //   return postReceiptRef;
  const updates = {};
  const currentDate = new Date();
  updates['/receipts/' + receiptId] = {
    receiptitems: receiptItems,
    date: currentDate.toLocaleDateString(),
  };
  updates['/houses/' + houseCode + '/receipts/' + receiptId] = {
    date: currentDate.toLocaleDateString(),
  };
  return update(ref(db), updates);
}

export function updateReceiptItem(
  receiptId: string,
  receiptItemId: string,
  receiptItemName: string,
  groceryItemName: string,
  splits: types.Splits,
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

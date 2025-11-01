import * as types from '@db/types';
import { GroceryItems } from '@db/types';
import { child, get, getDatabase, push, ref, remove, runTransaction, set } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';

import * as schema from './classes';
import { db, functions } from './firebase';

export async function writeGroceryList(grocerylist: string, name: string) {
  const fn = httpsCallable<{ grocerylist: string, name: string }, null>(functions, 'writeGroceryList');

  await fn({ grocerylist, name });
}

export async function getGroceryListId(userId: string): Promise<string> {
  const houseRef = ref(db, `housemates/${userId}`);
  const houseSnap = await get(houseRef);

  if (!houseSnap.exists()) throw new Error('No housemate record found');

  const houses = houseSnap.val().houses;
  if (!houses || houses.length === 0) throw new Error('No houses listed');

  const houseId = houses[0];
  const houseDataSnap = await get(ref(db, `houses/${houseId}`));

  if (!houseDataSnap.exists()) throw new Error('No house data found');

  const grocerylist = houseDataSnap.val().grocerylist;
  if (!grocerylist) throw new Error('No grocerylist ID found');

  return grocerylist;
}

export async function getGroceryListIdFromHouse(houseId: string) {
  const groceryListRef = ref(db, `houses/${houseId}/grocerylist`)
  
  const snap = await get(groceryListRef);

  if (snap.exists()) {
    return snap.val();
  }

  throw new Error('No grocery list found');
}

export function listenForGroceryItems(groceryListId: string, callback: (groceryItems: GroceryItems) => void) {
  const houseRef = ref(db, `grocerylists/${groceryListId}/groceryitems`);

  const unsubscribe = onValue(houseRef, snapshot => {
    const data = snapshot.val();
    if (data) {
      const grceryItems = snapshot.val() as GroceryItems;
      callback(grceryItems);
    } else {
      throw new Error('No grocery list found');
    }
  });

  return unsubscribe;
}

export async function writeGroceryItem(grocerylist: string, name: string, member: string, quantity = 1) {
  const fn = httpsCallable<{ grocerylist: string, name: string, member: string, quantity : number}, null>(functions, 'writeGroceryItem');

  await fn({ grocerylist, name, member, quantity });
}

// export function writeGroceryItem(
//   grocerylist: string,
//   name: string,
//   member: string,
//   quantity = 1,
// ) {
//   const db = getDatabase();
//   const postListRef = ref(db, 'grocerylists/' + grocerylist + '/groceryitems');
//   let splits: types.Splits = {};
//   splits[member] = quantity;
//   const item = new schema.GroceryItem(name, quantity, []);
//   const newPostRef = push(postListRef);
//   set(newPostRef, {
//     name: item.name,
//     quantity: item.quantity,
//     splits: splits,
//   });
// }

export async function updateGroceryItem(grocerylist: string, id: string, name: string, changeQuantity = 1, member: string) {
  const fn = httpsCallable<{ grocerylist: string, id: String, name: string, changeQuantity: Number, member: string}, null>(functions, 'updateGroceryItem');

  await fn({ grocerylist, id, name, changeQuantity, member });
}

// export function updateGroceryItem(
//   grocerylist: string,
//   id: string,
//   name: string,
//   changeQuantity = 1,
//   member: string,
// ) {
//   const db = getDatabase();
//   const itemRef = ref(db, 'grocerylists/' + grocerylist + '/groceryitems/');

//   runTransaction(itemRef, currentData => {
//     if (currentData == null) {
//       return {
//         [id]: {
//           name: name,
//           quantity: changeQuantity,
//           splits: {
//             [member]: changeQuantity,
//           },
//         },
//       };
//     }

//     if (currentData[id] == null && changeQuantity > 0) {
//       return {
//         ...currentData,
//         [id]: {
//           name: name,
//           quantity: changeQuantity,
//           splits: {
//             [member]: changeQuantity,
//           },
//         },
//       };
//     }

//     const isRemoveItem = changeQuantity < 0;
//     const userInSplits = currentData[id].splits?.[member];

//     if (userInSplits && !isRemoveItem) {
//       return {
//         ...currentData,
//         [id]: {
//           name: name,
//           quantity: currentData[id].quantity + changeQuantity,
//           splits: {
//             ...currentData[id].splits,
//             [member]: currentData[id].splits?.[member] + changeQuantity,
//           },
//         },
//       };
//     } else if (userInSplits && isRemoveItem) {
//       if (currentData[id].quantity + changeQuantity <= 0) {
//         delete currentData[id];
//         return currentData;
//       } else if (currentData[id].splits?.[member] + changeQuantity <= 0) {
//         let splits = { ...currentData[id].splits };
//         delete splits[member];
//         return {
//           ...currentData,
//           [id]: {
//             name: name,
//             quantity: currentData[id].quantity + changeQuantity,
//             splits: splits,
//           },
//         };
//       } else {
//         return {
//           ...currentData,
//           [id]: {
//             name: name,
//             quantity: currentData[id].quantity + changeQuantity,
//             splits: {
//               ...currentData[id].splits,
//               [member]: currentData[id].splits?.[member] + changeQuantity,
//             },
//           },
//         };
//       }
//     } else if (!userInSplits && !isRemoveItem) {
//       return {
//         ...currentData,
//         [id]: {
//           name: name,
//           quantity: currentData[id].quantity + changeQuantity,
//           splits: {
//             ...currentData[id].splits,
//             [member]: changeQuantity,
//           },
//         },
//       };
//     }

//     return currentData;
//   });
// }

export function removeGroceryItem(grocerylist: string, id: string) {
  const db = getDatabase();
  const itemRef = ref(db, 'grocerylists/' + grocerylist + '/groceryitems/');

  get(itemRef).then(snapshot => {
    if (snapshot.exists()) {
      const items = snapshot.val();

      Object.keys(items).forEach(itemId => {
        // Check if the name matches and quantity matches one removed
        if (itemId == id) {
          const itemRef = ref(db, `grocerylists/${grocerylist}/groceryitems/${id}`);
          remove(itemRef) // Remove the item
            .catch(error => console.error('Error removing item:', error));
        }
      });
    } else {
      console.error('No matching items found');
    }
  });
}

import { child, get, getDatabase, push, ref, remove, runTransaction, set } from 'firebase/database';

import * as types from '../db/types';

import * as schema from './classes';

export async function writeGroceryList(grocerylist: string, name: string) {
  const db = getDatabase();
  const postListRef = ref(db, 'grocerylists/' + grocerylist);
  await set(postListRef, {
    name: name,
    groceryitems: 1,
  });
  return postListRef;
}

export async function getGroceryListId(email: string): Promise<string> {
  const db = getDatabase();
  const emailKey = email.replace(/\./g, ':');
  const houseRef = ref(db, `housemates/${emailKey}`);
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

export function getGroceryListIdFromHouse(houseId: string) {
  const db = getDatabase();
  const dbRef = ref(db);
  return get(child(dbRef, 'houses/' + houseId + '/grocerylist')).then(snapshot => {
    if (snapshot.exists()) {
      const groceryListId = snapshot.val();
      return groceryListId;
    } else {
      console.error('failed to get grocery list id from house id');
      return Promise.reject('no grocery list');
    }
  });
}

export function writeGroceryItem(
  grocerylist: string | string[],
  name: string,
  member: string,
  quantity = 1,
) {
  const db = getDatabase();
  const postListRef = ref(db, 'grocerylists/' + grocerylist + '/groceryitems');
  let splits: types.Splits = {};
  splits[member] = quantity;
  const item = new schema.GroceryItem(name, quantity, []);
  const newPostRef = push(postListRef);
  set(newPostRef, {
    name: item.name,
    quantity: item.quantity,
    splits: splits,
  });
}

export function updateGroceryItem(
  grocerylist: string,
  id: string,
  name: string,
  changeQuantity = 1,
  member: string,
) {
  const db = getDatabase();
  const itemRef = ref(db, 'grocerylists/' + grocerylist + '/groceryitems/');

  runTransaction(itemRef, currentData => {
    if (currentData == null) {
      return {
        [id]: {
          name: name,
          quantity: changeQuantity,
          splits: {
            [member]: changeQuantity,
          },
        },
      };
    }

    if (currentData[id] == null && changeQuantity > 0) {
      return {
        ...currentData,
        [id]: {
          name: name,
          quantity: changeQuantity,
          splits: {
            [member]: changeQuantity,
          },
        },
      };
    }

    const isRemoveItem = changeQuantity < 0;
    const userInSplits = currentData[id].splits?.[member];

    if (userInSplits && !isRemoveItem) {
      return {
        ...currentData,
        [id]: {
          name: name,
          quantity: currentData[id].quantity + changeQuantity,
          splits: {
            ...currentData[id].splits,
            [member]: currentData[id].splits?.[member] + changeQuantity,
          },
        },
      };
    } else if (userInSplits && isRemoveItem) {
      if (currentData[id].quantity + changeQuantity <= 0) {
        delete currentData[id];
        return currentData;
      } else if (currentData[id].splits?.[member] + changeQuantity <= 0) {
        let splits = { ...currentData[id].splits };
        delete splits[member];
        return {
          ...currentData,
          [id]: {
            name: name,
            quantity: currentData[id].quantity + changeQuantity,
            splits: splits,
          },
        };
      } else {
        return {
          ...currentData,
          [id]: {
            name: name,
            quantity: currentData[id].quantity + changeQuantity,
            splits: {
              ...currentData[id].splits,
              [member]: currentData[id].splits?.[member] + changeQuantity,
            },
          },
        };
      }
    } else if (!userInSplits && !isRemoveItem) {
      return {
        ...currentData,
        [id]: {
          name: name,
          quantity: currentData[id].quantity + changeQuantity,
          splits: {
            ...currentData[id].splits,
            [member]: changeQuantity,
          },
        },
      };
    }

    return currentData;
  });
}

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

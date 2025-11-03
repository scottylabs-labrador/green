import { GroceryItems, GroceryList } from '@db/types';
import { get, getDatabase, onValue, ref, remove } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';

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

  throw new Error('No grocery list found from house');
}

export function listenForGroceryItems(groceryListId: string, callback: (groceryItems: GroceryItems) => void) {
  const listRef = ref(db, `grocerylists/${groceryListId}`);

  const unsubscribe = onValue(listRef, snapshot => {
    const data = snapshot.val();
    if (data) {
      const groceryList = snapshot.val() as GroceryList;
      callback(groceryList?.groceryitems || {});
    } else {
      throw new Error('No grocery list found while listening for grocery items');
    }
  });

  return unsubscribe;
}

export async function writeGroceryItem(grocerylist: string, name: string, member: string, quantity = 1) {
  const fn = httpsCallable<{ 
    grocerylist: string, 
    name: string, 
    member: string, 
    quantity : number
  }, null>(functions, 'writeGroceryItem');

  await fn({ grocerylist, name, member, quantity });
}

export async function updateGroceryItem(grocerylist: string, id: string, name: string, changeQuantity = 1, member: string) {
  const fn = httpsCallable<{ 
    grocerylist: string, 
    id: String, 
    name: string, 
    changeQuantity: Number, 
    member: string
  }, null>(functions, 'updateGroceryItem');

  await fn({ grocerylist, id, name, changeQuantity, member });
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
